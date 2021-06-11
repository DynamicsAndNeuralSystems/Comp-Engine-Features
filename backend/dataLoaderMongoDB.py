import csv
import math
import requests
import warnings
import pandas as pd
from copy import deepcopy as dp
from pymongo import MongoClient
from scipy.stats import spearmanr

warnings.filterwarnings("ignore", category=RuntimeWarning)
warnings.filterwarnings("ignore", category=UserWarning)

# Mongo Connection
myclient = MongoClient(port=27017)
mydb = myclient["CompEngineFeaturesDatabase"]


def addFeaturesCollection():
    mycol = mydb["FeaturesCollection"]
    # mycol = mydb["Temp"]
    mycol.drop()
    inpMopsDic = {}
    with open('INP_mops.txt') as f:
        lines = f.readlines()
        for i in lines:
            i = i.strip()
            i = i.replace('\t', ' ')
            temp = list(i.split(" "))
            if len(temp) < 2:
                print(i)
                print(temp)
            inpMopsDic[temp[-1]] = temp[0][: temp[0].index('(')]
    df = pd.read_csv('codeFileDesc.csv')
    codeFileDescDic = {}
    for index, row in df.iterrows():
        codeFileDescDic[row['codeFile']] = row['desc']
    # Loading file
    print("Loading Features Files")
    hctsaFeatures = pd.read_csv('https://ndownloader.figshare.com/files/29061870')
    hctsaDataMatrix = pd.read_csv("https://ndownloader.figshare.com/files/29061867", header=None)
    print(hctsaFeatures)
    print(hctsaDataMatrix)
    hctsaDataMatrix = hctsaDataMatrix.fillna(0)
    for col in hctsaDataMatrix.columns:
        hctsaDataMatrix[col] = hctsaDataMatrix[col].astype("float64")
    col = hctsaDataMatrix.columns
    if hctsaDataMatrix.isnull().sum().sum() > 0:
        print("NaN detected!! Exiting")
        exit()
    total = len(hctsaFeatures)
    print("Total features :", total)
    coefarr = [[0 for j in range(total)] for i in range(total)]
    pvalarr = [[0 for j in range(total)] for i in range(total)]
    for i in range(total):
        print(i)
        dic = {
            "id": int(hctsaFeatures['ID'][i]),
            "name": hctsaFeatures['Name'][i],
            "keywords": hctsaFeatures['Keywords'][i],
            "timeseriesValues": dp(list(hctsaDataMatrix[col[i]])),
            "codefile": "NA",
            "description": "NA"
        }
        codeString = hctsaFeatures['CodeString'][i]
        if codeString.find(".") != -1:
            codeString = codeString[:codeString.find(".")]
        if codeString in inpMopsDic:
            dic["codefile"] = inpMopsDic[codeString]
        else:
            print("NA detected")
            print(hctsaFeatures['CodeString'][i], " ", i)
        if dic["codefile"] in codeFileDescDic:
            dic["description"] = codeFileDescDic[dic["codefile"]]
        coefList = []
        pval = []
        for j in range(total):
            if j == i:
                coefList.append(float(format(1.000, '.3f')))
                pval.append(float(format(0.000, '.3f')))
            elif j < i:
                coefList.append(coefarr[j][i])
                pval.append(pvalarr[j][i])
            else:
                coef, p = 0, 0
                try:
                    if (hctsaDataMatrix.iloc[:, j].isna().sum() + hctsaDataMatrix.iloc[:, i].isna().sum()) < 50:
                        coef, p = spearmanr(hctsaDataMatrix.iloc[:, j], hctsaDataMatrix.iloc[:, i], nan_policy="omit")
                except Exception as e:
                    print("Exception  : ", e, "  |    j-value : ", )
                finally:
                    if math.isnan(coef):
                        coef, p = 0, 0
                    coefList.append(float(format(coef, '.3f')))
                    pval.append(float(format(p, '.3f')))
                coefarr[i][j] = float(format(coef, '.3f'))
                pvalarr[i][j] = float(format(p, '.3f'))
        dic["correlation"] = coefList
        dic['pvalue'] = pval
        mycol.insert_one(dic)
    resp = mycol.create_index([("id", 1)])
    print("index response:", resp)


def addTimeSeriesCollection():
    def getCategory(arr):
        if 'dynsys' in arr:
            return "Ordinary Differential Equation (ODE)"
        elif 'map' in arr:
            return "Iterative map (Map)"
        elif 'noise' in arr:
            return "Uncorrelated noise (Noise)"
        elif 'synthetic' in arr:
            return "Synthetic (Other)"
        else:
            return "Real-world"

    mycol = mydb["TimeSeries"]
    mycol.drop()
    print("Loading Time Series Files")
    timeseriesInfo = pd.read_csv('https://ndownloader.figshare.com/files/29061879')
    with requests.Session() as s:
        timeseriesDataMatrix = list(
            csv.reader(s.get('https://ndownloader.figshare.com/files/29061876').content.decode('utf-8').splitlines(),
                       delimiter=','))
        print(len(timeseriesDataMatrix))
        print(timeseriesInfo)
        total = min(len(timeseriesInfo), len(timeseriesDataMatrix))
        for i in range(total):
            mycol.insert_one({
                "name": timeseriesInfo['Name'][i],
                "timeseries": list(map(float, timeseriesDataMatrix[i])),
                "category": getCategory(timeseriesInfo['Keywords'][i].split(','))
            })


addTimeSeriesCollection()
addFeaturesCollection()
