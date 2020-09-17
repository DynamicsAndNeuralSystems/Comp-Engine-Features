from django.shortcuts import render,HttpResponse
from django.core.files.storage import FileSystemStorage
import io
import urllib,base64
from plotly.offline import plot
import plotly.graph_objs as go





# Create your views here.

def error404page(request,exception):
    return render(request,"error404page.html")


def index(request):
    return render(request,'index.html')


def howitworks(request):
    return render(request,'howitworks.html')

def about(request):
    return render(request,'about.html')

def contact(request):
    return render(request,'contact.html')

def contribute(request):
    return render(request,'contribute.html')



def result(request):
    import time
    import os
    import pandas as pd
    import warnings
    from csv import reader
    from tqdm import tqdm
    from scipy.stats import zscore
    from scipy.stats import spearmanr
    from operator import itemgetter
    import seaborn as sns
    import sys
    import matplotlib.pyplot as plt
    plt.switch_backend('agg')
    from matplotlib.patches import Rectangle
    import numpy as np
    from RestrictedPython import safe_builtins, compile_restricted
    from RestrictedPython.Eval import default_guarded_getitem
    warnings.filterwarnings("ignore",category=RuntimeWarning)
    warnings.filterwarnings("ignore",category=UserWarning) 
    Alltimeseries = []
    missing = []
    finalfeatures = []
    New_feature_vector=[]

    # Reading code file and function name

    if request.method == 'POST':

        # Taking user's input

        featurename=request.POST['featurename']
        featurecode=request.FILES['featurecode']
        fs= FileSystemStorage()



        modulename=fs.save(featurecode.name,featurecode).replace(".py","")
        print(modulename)




        MAX_ITER_LEN = 1000000000000000

        class MaxCountIter:

            def __init__(self, dataset, max_count):
                self.i = iter(dataset)
                self.left = max_count

            def __iter__(self):
                return self

            def __next__(self):
                if self.left > 0:
                    self.left -= 1
                    return next(self.i)
                else:
                    raise StopIteration()


        def _import(name, globals=None, locals=None, fromlist=(), level=0):
                safe_modules = ["math","statistics","numpy","scipy","pandas","statsmodels","sklearn"]
                if name in safe_modules:
                    globals[name] = __import__(name, globals, locals, fromlist, level)
                else:
                    raise


        def _getiter(ob):
            return MaxCountIter(ob, MAX_ITER_LEN)


        def execute_user_code(user_code, user_func, *args, **kwargs):
            def _apply(f, *a, **kw):
                return f(*a, **kw)
            
            
            safe_builtins['__import__'] = _import

            
            try:

        # This is the variables we allow user code to see. @result will contain return value.

                restricted_locals = {
                    "result": None,
                    "args": args,
                    "kwargs": kwargs,
                }

                restricted_globals = {
                    "_getiter_": _getiter,
                    "__builtins__": safe_builtins,
                    "_getitem_": default_guarded_getitem,
                    "_apply_": _apply,
                    "sum":sum,
                    "min":min,
                    "max":max,
                    "abs":abs,
                    "sorted":sorted,
                    "round":round,
                    "type":type,
                    "complex":complex
                }


                user_code += "\nresult = {0}(*args, **kwargs)".format(user_func)


                byte_code = compile_restricted(user_code, filename="<user_code>", mode="exec")


                exec(byte_code, restricted_globals, restricted_locals)

                return restricted_locals["result"]
            except SyntaxError as e:
                raise
            except Exception as e:
                raise
        

        #  Reading all required files - timeseries data, hctsa datamatrix and keywords 
        

        with open('hctsa_timeseries-data.csv', 'r') as read_obj:
            csv_reader = reader(read_obj)
            li = list(csv_reader)
            for i in tqdm(li):
                Alltimeseries.append(list(map(float, i)))
      


        # Reading hctsa datamatrix


        
        hctsa = pd.read_csv('hctsa_datamatrix.csv')
        keywords = pd.read_csv('hctsa_features.csv')

        # Reading user's code as string
        with open(f"media\{modulename}.py") as f:
            usercode=f.read()



        def usercodeexec():
            for i in tqdm(range(len(Alltimeseries))):
                featurevalue=execute_user_code(usercode,featurename,Alltimeseries[i])
                New_feature_vector.append(featurevalue)

        from func_timeout import func_timeout,FunctionTimedOut

        def Execute_User_Code():
            for i in tqdm(range(len(Alltimeseries))):
                featurevalue = execute_user_code(usercode, featurename, Alltimeseries[i])
                New_feature_vector.append(featurevalue)


        # Passing timeseries data to user's uploaded function

        try:
            mytemplate="result.html"
            try:

                func_timeout(300,Execute_User_Code)
            except FunctionTimedOut:
                raise



        #  For handling too many Nan values

            if int(pd.DataFrame(New_feature_vector).isna().sum())>50:
                raise SyntaxError
            


        # Removing hctsa datamatrix's column having more than 70% missing values
        

            for i in tqdm(range(len(hctsa.columns))):
                if (hctsa.iloc[:,i].isna().sum()*100/hctsa.iloc[:,i].shape[0])>70:
                    missing.append(hctsa.columns[i])
                else:
                #  Column number of hctsa datamatrix which have less <70% missing values are stored in finalfeatures list.
                    
                    finalfeatures.append(i)
            
            
            #   Comparing features


            alpha=0.05
            New_Feature_vector_dataframe=pd.DataFrame(New_feature_vector)

            #   Calculating total Nan values in feature vector 
            
            nan_fvector=int(New_Feature_vector_dataframe.isna().sum())
            

            correlatedfeatures=[]
         
            for i in tqdm(finalfeatures):
                eachfeature=[]
                if (hctsa.iloc[:,i].isna().sum()+nan_fvector)<50:
                    coef, p = spearmanr(hctsa.iloc[:,i],New_Feature_vector_dataframe.values,nan_policy="omit")
                    if p < alpha:
                        eachfeature=[hctsa.columns[i],p,format(abs(coef),'.3f'),i,*keywords.iloc[i:i+1,2].values,format(coef,'.3f')]
                        correlatedfeatures.append(eachfeature)


            BestMatches = sorted(correlatedfeatures, key=itemgetter(2))[::-1]

            totalmatches=len(BestMatches)
            
            
            # for displaying all row columns in one screen

            pd.set_option('display.max_columns', None)
            pd.set_option('display.max_rows', None)




            # Preparing Dataframe for visualization

            DATAFRAME = pd.DataFrame(BestMatches)
            DATAFRAME.columns = ['Name', 'pvalue', 'Corr', 'ColumnId', 'Keywords', 'Signedcorrvalue']
            DATAFRAME['Rank']=np.arange(1,len(BestMatches)+1)


            
            myfulljsondata=DATAFRAME[:100]
            jsontable=[]




            for i in tqdm(range(myfulljsondata.shape[0])):
                temp=myfulljsondata.iloc[i]
                jsontable.append(dict(temp))



            # Creating csv file for downloading by the user


            DATAFRAME=DATAFRAME[['Rank','Name','Keywords','Corr','pvalue','Signedcorrvalue']]
            DATAFRAME.to_csv('media/matching data.csv',index=False)



            # visualization

            PairWise=pd.DataFrame()

        # appending user's feature vector to pairwise datframe 
        
            PairWise[featurename]=New_feature_vector

            for i in range(len(BestMatches[:12])):
                PairWise[BestMatches[i][0]] = hctsa.iloc[:, BestMatches[i][3]]

            

            pairwise_corr=PairWise.corr(method="spearman").abs()

            g=sns.clustermap(pairwise_corr,method="complete",annot=True,linewidth=0.5,square=True)


        # Highlighting user's row and column in pairwise correlation with patch  

            columns = list(PairWise.columns)

            N = len(columns)
            wanted_label = featurename
            wanted_row = g.dendrogram_row.reordered_ind.index(columns.index(wanted_label))
            wanted_col = g.dendrogram_col.reordered_ind.index(columns.index(wanted_label))

            xywh_row = (0, wanted_row, N, 1)
            xywh_col = (wanted_col, 0, 1, N)
            for x, y, w, h in (xywh_row, xywh_col):
                g.ax_heatmap.add_patch(Rectangle((x, y), w, h, fill=False, edgecolor='Blue', lw=4, clip_on=True))
            g.ax_heatmap.tick_params(length=0)
            myfig=plt.gcf()
            buf=io.BytesIO()
            myfig.savefig(buf,format='png')
            
            buf.seek(0)
        
            string=base64.b64encode(buf.read())
            
            uri=urllib.parse.quote(string)
            




            # Using plotly for creating interactive graphs
        

            import plotly.graph_objs as go
            
            from plotly.tools import make_subplots

         
            Scatterdataframe=pd.DataFrame()
            
            for i in range(12):
                Scatterdataframe[i]=hctsa.iloc[:,BestMatches[i][3]]
            
            Scatterdataframe[13]=New_Feature_vector_dataframe.iloc[:,0]


            # For generating  x and y axis scatter plots suing plotly

            trace0 = go.Scatter(x=Scatterdataframe.iloc[:,0].rank(), y=Scatterdataframe[13].rank(),mode="markers")
            trace1 = go.Scatter(x=Scatterdataframe.iloc[:,1].rank(), y=Scatterdataframe[13].rank(),mode="markers")
            trace2 = go.Scatter(x=Scatterdataframe.iloc[:,2].rank(), y=Scatterdataframe[13].rank(),mode="markers")
            trace3 = go.Scatter(x=Scatterdataframe.iloc[:,3].rank(), y=Scatterdataframe[13].rank(),mode="markers")
            trace4 = go.Scatter(x=Scatterdataframe.iloc[:,4].rank(), y=Scatterdataframe[13].rank(),mode="markers")
            trace5 = go.Scatter(x=Scatterdataframe.iloc[:,5].rank(), y=Scatterdataframe[13].rank(),mode="markers")
            trace6 = go.Scatter(x=Scatterdataframe.iloc[:,6].rank(), y=Scatterdataframe[13].rank(),mode="markers")
            trace7 = go.Scatter(x=Scatterdataframe.iloc[:,7].rank(), y=Scatterdataframe[13].rank(),mode="markers")
            trace8 = go.Scatter(x=Scatterdataframe.iloc[:,8].rank(), y=Scatterdataframe[13].rank(),mode="markers")
            trace9 = go.Scatter(x=Scatterdataframe.iloc[:,9].rank(), y=Scatterdataframe[13].rank(),mode="markers")
            trace10 = go.Scatter(x=Scatterdataframe.iloc[:,10].rank(), y=Scatterdataframe[13].rank(),mode="markers")
            trace11 = go.Scatter(x=Scatterdataframe.iloc[:,11].rank(), y=Scatterdataframe[13].rank(),mode="markers")
            

            # adding correlation value as title for all 12 plots

            fig=go.FigureWidget(make_subplots(rows=3,cols=4,subplot_titles=(f"Correlation = {BestMatches[0][2]}",f"Correlation = {BestMatches[1][2]}",f"Correlation = {BestMatches[2][2]}",f"Correlation = {BestMatches[3][2]}",f"Correlation = {BestMatches[4][2]}",
            f"Correlation = {BestMatches[5][2]}",f"Correlation = {BestMatches[6][2]}",f"Correlation = {BestMatches[7][2]}",f"Correlation = {BestMatches[8][2]}",f"Correlation = {BestMatches[9][2]}",
            f"Correlation = {BestMatches[10][2]}",f"Correlation = {BestMatches[11][2]}")))
            fig.update_layout(template='plotly')


            # Generating 12 scatter plots on single page


            fig.add_trace(trace0,1,1)
            fig.add_trace(trace1,1,2)
            fig.add_trace(trace2,1,3)
            fig.add_trace(trace3,1,4)
            fig.add_trace(trace4,2,1)
            fig.add_trace(trace5,2,2)
            fig.add_trace(trace6,2,3)
            fig.add_trace(trace7,2,4)
            fig.add_trace(trace8,3,1)
            fig.add_trace(trace9,3,2)
            fig.add_trace(trace10,3,3)
            fig.add_trace(trace11,3,4)


            # Updating x-axis labels for scatter plots


            fig.update_xaxes(title_text=BestMatches[0][0], row=1, col=1)
            fig.update_xaxes(title_text=BestMatches[1][0], row=1, col=2)
            fig.update_xaxes(title_text=BestMatches[2][0], row=1, col=3)
            fig.update_xaxes(title_text=BestMatches[3][0], row=1, col=4)
            fig.update_xaxes(title_text=BestMatches[4][0], row=2, col=1)
            fig.update_xaxes(title_text=BestMatches[5][0], row=2, col=2)
            fig.update_xaxes(title_text=BestMatches[6][0], row=2, col=3)
            fig.update_xaxes(title_text=BestMatches[7][0], row=2, col=4)
            fig.update_xaxes(title_text=BestMatches[8][0], row=3, col=1)
            fig.update_xaxes(title_text=BestMatches[9][0], row=3, col=2)
            fig.update_xaxes(title_text=BestMatches[10][0], row=3, col=3)
            fig.update_xaxes(title_text=BestMatches[11][0], row=3, col=4)


            fig.update_yaxes(title_text=featurename,row=1,col=1)
            fig.update_yaxes(title_text=featurename,row=2,col=1)
            fig.update_yaxes(title_text=featurename,row=3,col=1)



            # plots configuration (papercolor,margin,show legends)


            fig.update_layout(showlegend=False,template='ggplot2',paper_bgcolor='rgba(0,0,0,0)',
            margin=dict(
                r=130
        ))
            
            # configuring graph into html for rendering.

            graph = fig.to_html(full_html=False, default_height=1200, default_width=1200)
            

            # Dictionary for passsing the variables to be rendered on result page

            context = {
                "clusterdata":uri,
                "data":jsontable,
                'graph': graph,
                "totalmatches":totalmatches,
                "featurename":featurename
                }
          


        # change the template so as to redirect user to syntax page if syntax error encounters

        except SyntaxError as e:
            print(e)
            context={}
            mytemplate="syntaxerror.html"

        
        # change the template so as to redirect user to warning page if unwanted imports encounters

        except Exception as e:
            print(e)
            context={}
            mytemplate="warningpage.html"

        except FunctionTimedOut:
            context={}
            mytemplate="timeout.html"

        return render(request,mytemplate,context)
    