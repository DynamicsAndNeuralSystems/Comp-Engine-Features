import io
import os
import urllib
import base64
import docker
import tarfile
import warnings
import numpy as np
import pandas as pd
import seaborn as sns
from pymongo import MongoClient
import matplotlib.pyplot as plt
from scipy.stats import spearmanr
from django.http import JsonResponse
from matplotlib.patches import Rectangle
from func_timeout import FunctionTimedOut, func_set_timeout

plt.switch_backend('agg')
warnings.filterwarnings("ignore", category=RuntimeWarning)
warnings.filterwarnings("ignore", category=UserWarning)

myclient = MongoClient(port=27017)
mydb = myclient["CompEngineFeaturesDatabase"]
mycol = mydb["FeaturesCollection"]
featureDic = {}
AllFeatures = []
Alltimeseries = []
AlltimeSeriesNames = []
TimeSeriesCategory = []
AlltimeseriesCategory = []
alpha = 0.05
popKeywords = ['moment', 'misc', 'raw', 'lengthdep', 'distribution', 'location', 'locationDependent']


def init():
    global TimeSeriesCategory

    def getAllTimeSeries():
        col = mydb["TimeSeries"]
        for timeSeries in col.find({}, {"_id": 0}):
            Alltimeseries.append(timeSeries["timeseries"])
            AlltimeSeriesNames.append(timeSeries["name"])
            AlltimeseriesCategory.append(timeSeries["category"])

    getAllTimeSeries()
    TimeSeriesCategory = list(set(AlltimeseriesCategory))
    for x in mycol.find({}, {"_id": 0, "timeseriesValues": 0, "correlation": 0, "pvalue": 0}):
        AllFeatures.append({
            "id": int(x["id"]),
            "name": x["name"],
            "keywords": x["keywords"]
        })


init()


def getPairWiseDataFrame(dataframe, fids):
    for fid in fids:
        temp = mycol.find_one({'id': fid}, {"timeseriesValues": 1, "name": 1})
        dataframe[temp["name"]] = temp['timeseriesValues']
    return dataframe.fillna(0)


def getfeatures(request):
    try:
        if len(featureDic) == 0:
            for i in AllFeatures:
                tdic = {
                    "id": i["id"],
                    "name": i["name"],
                    "keywords": i["keywords"]
                }
                featureDic[i["id"]] = tdic
        return JsonResponse({"featureDic": featureDic, "popKeywords": popKeywords})
    except Exception as e:
        print(e)
        return JsonResponse({"error": "Recheck the API request made"})


def gettimeseries(request, timeseriesname):
    try:
        number = AlltimeSeriesNames.index(timeseriesname)
        if number < 0:
            raise Exception
        dic = {
            "name": AlltimeSeriesNames[number],
            "ydata": Alltimeseries[number],
            "xdata": np.linspace(1, len(Alltimeseries[number]), len(Alltimeseries[number])).tolist()
        }
        return JsonResponse(dic)
    except Exception as e:
        print(e)
        return JsonResponse({"error": "Recheck the API request made"})


def apiNetwork(request, fid, nodes):
    return apiNetworkUtil(fid, nodes)


def getDataFrame(category, value):
    data = []
    if category == "FeatureExplored":
        x = mycol.find_one({'id': int(value)},
                           {"_id": 0, "name": 0, "keywords": 0, "id": 0, "timeseriesValues": 0})
        x["correlation"] = np.array(x["correlation"]).astype(np.float64)
        x["pvalue"] = np.array(x["pvalue"]).astype(np.float64)
        for i in range(len(AllFeatures)):
            if x["pvalue"][i] > alpha:
                continue
            data.append({
                "id": AllFeatures[i]["id"],
                "correlation": x["correlation"][i]
            })
    elif category == "FeatureSubmitted":
        featuresTimeseriesValues = mycol.find({}, {"timeseriesValues": 1})
        for index, featureValue in enumerate(featuresTimeseriesValues):
            featureValue = featureValue["timeseriesValues"]
            if (int(pd.DataFrame(featureValue).isna().sum())) < 50:
                correlation, pvalue = spearmanr(featureValue, value, nan_policy="omit")
                if pvalue < alpha:
                    data.append({
                        "id": AllFeatures[index]["id"],
                        "correlation": float(format(correlation, '.3f'))
                    })
    data.sort(key=lambda item: abs(item['correlation']), reverse=True)
    if category == "FeatureExplored":
        data = data[1:]
    data = pd.DataFrame(data)
    data['rank'] = np.arange(1, len(data) + 1)
    data = data.fillna(0)
    return data


def splittimeseries(arr):
    dic = {}
    for i in range(len(AlltimeseriesCategory)):
        if AlltimeseriesCategory[i] in dic:
            dic[AlltimeseriesCategory[i]].append(arr[i])
        else:
            dic[AlltimeseriesCategory[i]] = []
            dic[AlltimeseriesCategory[i]].append(arr[i])
    res = []
    for i in TimeSeriesCategory:
        res.append(dic[i])
    return res


def apiNetworkUtil(fid, nodes):
    try:
        nodes = min(20, int(nodes))
        df = getDataFrame("FeatureExplored", fid)
        PairWise = pd.DataFrame()
        temp = mycol.find_one({'id': int(fid)}, {"timeseriesValues": 1, "name": 1})
        PairWise[temp["name"]] = temp["timeseriesValues"]
        PairWise = getPairWiseDataFrame(PairWise, df.iloc[:nodes, 0])
        pairwise_corr = PairWise.corr(method="spearman").abs()
        networkGraph = getNetworkGraph(df, pairwise_corr, int(fid))
        return JsonResponse(
            {"networkGraph": networkGraph})
    except Exception as e:
        print(e)
        return JsonResponse({"error": "Recheck the API request made"})


def getHeatmapImage(pairwise_corr, columns, wanted_label):
    plt.switch_backend('agg')
    g = sns.clustermap(pairwise_corr, method="complete", annot=True, linewidth=0.5, square=True)
    N = len(columns)
    wanted_row = g.dendrogram_row.reordered_ind.index(columns.index(wanted_label))
    wanted_col = g.dendrogram_col.reordered_ind.index(columns.index(wanted_label))
    xywh_row = (0, wanted_row, N, 1)
    xywh_col = (wanted_col, 0, 1, N)
    for x, y, w, h in (xywh_row, xywh_col):
        g.ax_heatmap.add_patch(Rectangle((x, y), w, h, fill=False, edgecolor='Blue', lw=4, clip_on=True))
    g.ax_heatmap.tick_params(length=0)
    myfig = plt.gcf()
    buf = io.BytesIO()
    myfig.savefig(buf, format='png')
    buf.seek(0)
    string = base64.b64encode(buf.read())
    return urllib.parse.quote(string)


def getScatterPlotsData(dataframe, pairwise):
    featureName = list(pairwise.columns)
    scatterPlotsData = {
        'xaxis': {
            'xdata': splittimeseries(pairwise[featureName[0]].rank()),
            'xdataraw': splittimeseries(pairwise[featureName[0]]),
            'xtit': featureName[0]
        },
        'yaxes': []
    }
    for i in range(1, len(featureName)):
        gr = {
            'title': "Correlation = " + str(dataframe["correlation"][i - 1]),
            'ytit': featureName[i],
            'ydata': splittimeseries(pairwise[featureName[i]].rank()),
            'ydataraw': splittimeseries(pairwise[featureName[i]]),
            'yfid': str(dataframe["id"][i - 1])
        }
        scatterPlotsData['yaxes'].append(gr)
    return scatterPlotsData


def getNetworkGraph(dataframe, pairwise_corr, fid):
    pairwise_corr = pairwise_corr.fillna(0)
    names = list(pairwise_corr.columns)
    networkGraph = {
        'nodes': [],
        'edges': []
    }
    networkGraph['nodes'].append({
        'id': 0,
        'fid': fid,
        'name': names[0]
    })
    for i in range(1, len(names)):
        networkGraph['nodes'].append({
            'id': i,
            'fid': int(dataframe["id"][i - 1])
        })
    for i in range(len(names)):
        for j in range(i + 1, len(names)):
            networkGraph['edges'].append({
                'to': j,
                'from': i,
                'length': float(format(pairwise_corr[names[i]][names[j]], '.3f'))
            })
    networkGraph['edges'].sort(key=lambda x: abs(x['length']), reverse=True)
    networkGraph['edges'] = networkGraph['edges'][:max(10, int(len(networkGraph['edges']) * 0.4))]
    return networkGraph


def apiexploremode(request, number, fname):
    try:
        featureDocument = mycol.find_one({'id': int(number)}, {"timeseriesValues": 1, "codefile": 1, "description": 1})
        response = apiFeatureExplore(fname, "FeatureExplored", featureDocument["timeseriesValues"], number)
        response["description"] = featureDocument["description"]
        response["codeFile"] = featureDocument["codefile"]
        return JsonResponse(response)
    except Exception as e:
        print(e)
        return JsonResponse({"error": "Recheck the API request made"})


def getPythonContainer():
    try:
        print("Getting docker client")
        client = docker.from_env()
        print("Getting list of docker containers")
        containers = client.containers.list(filters={"ancestor": "python", "status": "running"})
        while len(containers) == 0:
            print("No existing container found. Creating a docker container with python image")
            client.containers.run("python", detach=True, stdin_open=True, tty=True, mem_limit="500m")
            print("Getting list of docker containers")
            containers = client.containers.list(filters={"ancestor": "python", "status": "running"})
            if len(containers) > 0:
                print("Initializing the docker container with required packages and files")
                container = containers[0]
                data = open('PythonDockerRequirements' + '.tar', 'rb').read()
                container.put_archive('/', data)
                container.exec_run("pip install -r dockerPythonRequirements.txt")
        return containers[0]
    except docker.errors.NotFound:
        print("Not found")


def getJuliaContainer():
    try:
        client = docker.from_env()
        containers = client.containers.list(filters={"ancestor": "julia:latest", "status": "running"})
        while len(containers) == 0:
            client.containers.run("julia:latest", detach=True, stdin_open=True, tty=True, mem_limit="500m")
            containers = client.containers.list(filters={"ancestor": "julia:latest", "status": "running"})
            if len(containers) > 0:
                container = containers[0]
                data = open('JuliaDockerRequirements.tar', 'rb').read()
                container.put_archive('/', data)
                # container.exec_run("pip install -r dockerPythonRequirements.txt")
        return containers[0]
    except docker.errors.NotFound:
        print("Not found")


def cleanupContainer(container, filename):
    container.exec_run("rm -r " + filename)
    os.chdir(os.getcwd())
    os.remove(filename + '.tar')
    os.remove(filename)


def apicodesubmit(request):
    try:
        if request.method != 'POST':
            return JsonResponse({"stat": 5})
        featurename = request.POST['featurename']
        language = request.POST['language']
        featurecode = request.FILES['featurecode']
        container, filename, exitCode, output = None, None, None, None

        @func_set_timeout(150)
        def scriptRunnerPython():
            baseFile = open("pythonBaseScript.py", "r")
            baseCode = ''.join(baseFile.readlines())
            baseFile.close()
            baseCode = baseCode.replace('function_name', featurename)
            file1 = open(filename, "w")
            file1.write(featurecode.read().decode('utf-8') + '\n' + baseCode)
            file1.close()
            tar = tarfile.open(filename + '.tar', mode='w')
            try:
                tar.add(filename)
            finally:
                tar.close()
            data = open(filename + '.tar', 'rb').read()
            container.put_archive('/', data)
            return container.exec_run("python " + filename)

        @func_set_timeout(150)
        def scriptRunnerJulia():
            baseFile = open('juliaBaseScript.jl', "r")
            baseCode = ''.join(baseFile.readlines())
            baseFile.close()
            baseCode = baseCode.replace('function_name', featurename)
            file1 = open(filename, "w")
            file1.write(featurecode.read().decode('utf-8') + '\n' + baseCode)
            file1.close()
            tar = tarfile.open(filename + '.tar', mode='w')
            try:
                tar.add(filename)
            finally:
                tar.close()
            data = open(filename + '.tar', 'rb').read()
            container.put_archive('/', data)
            return container.exec_run("julia " + filename)

        def getResponse():
            if exitCode == 0:
                featureVector = list(map(float, output.split(" ")[-1000:]))
                if int(pd.DataFrame(featureVector).isna().sum()) > 50:
                    raise SyntaxError
                return JsonResponse({"stat": 1, "featurename": featurename, "featureTimeSeriesValues": featureVector})
            elif exitCode == 137:
                print("OOM")
                raise Exception
            elif exitCode == 1:
                print("Error in code structure")
                raise SyntaxError
            else:
                raise Exception

        try:
            if language == "Python":
                filename = featurename + ".py"
                container = getPythonContainer()
                exitCode, output = scriptRunnerPython()
            elif language == "Julia":
                filename = featurename + ".jl"
                container = getJuliaContainer()
                exitCode, output = scriptRunnerJulia()
            print("exitCode : ", exitCode)
            output = output.decode()
            return getResponse()
        except FunctionTimedOut:
            print("Function Timed out")
            if container is not None:
                container.restart(timeout=1)
            raise
        except Exception as e:
            print(e)
            raise Exception
        finally:
            if container is not None:
                cleanupContainer(container, filename)
    except SyntaxError as e:
        return JsonResponse({"stat": 2})
    except Exception as e:
        print(e)
        return JsonResponse({"stat": 3})
    except FunctionTimedOut:
        return JsonResponse({"stat": 4})


def apiFeatureExplore(featurename, exploreType, timeSeriesValues, fid=None):
    try:
        if fid is None:
            df = getDataFrame(exploreType, timeSeriesValues)
        else:
            df = getDataFrame("FeatureExplored", fid)
        pairWise = pd.DataFrame()
        pairWise[featurename] = timeSeriesValues
        pairWise = getPairWiseDataFrame(pairWise, df.iloc[:15, 0])
        pairwise_corr = pairWise.corr(method="spearman").abs()
        # image = getHeatmapImage(pairwise_corr, list(PairWise.columns), featurename)
        image = "fdfsd"
        scatterPlotsData = getScatterPlotsData(df, pairWise)
        networkGraph = getNetworkGraph(df, pairwise_corr, -1)
        TimeseriesNamesDivided = splittimeseries(AlltimeSeriesNames)
        res = []
        for index, row in list(df.iterrows()):
            res.append(dict(row))
        totalmatches = len(df)
        return {"tabledata": res, "totalmatches": totalmatches, "featurename": featurename, "heatmap": image,
                "timeseriesnames": TimeseriesNamesDivided, "timeseriescategory": TimeSeriesCategory,
                "networkGraph": networkGraph, "scatterPlotGraphs": scatterPlotsData}
    except Exception as e:
        return JsonResponse({"error": "Recheck the API request made"})


def apiuserfeature(request):
    try:
        if request.method != 'POST':
            raise Exception
        featurename = request.POST['featurename']
        featureTimeSeriesValues = list(map(float, request.POST['featureTimeSeriesValues'].split(",")))
        if len(featureTimeSeriesValues) != 1000:
            raise Exception
        return JsonResponse(apiFeatureExplore(featurename, "FeatureSubmitted", featureTimeSeriesValues))
    except Exception as e:
        return JsonResponse({"error": "Recheck the API request made"})
