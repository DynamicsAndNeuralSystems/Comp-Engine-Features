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


def updateFeaturesCollection():
    mycol = mydb["FeaturesCollection"]
    # mycol = mydb["Temp"]
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
    total = len(hctsaFeatures)
    print("Total features :", total)
    count = 0
    for i in range(total):
        dic = {
            "codefile": "NA",
            "description": "NA"
        }
        codeString = hctsaFeatures['CodeString'][i]
        if codeString.find(".") != -1:
            codeString = codeString[:codeString.find(".")]
        if codeString in inpMopsDic:
            dic["codefile"] = inpMopsDic[codeString]
        else:
            print(i)
            count += 1
        if dic["codefile"] in codeFileDescDic:
            dic["description"] = codeFileDescDic[dic["codefile"]]
        else:
            print(i)
            count += 1
        mycol.update_one({"id": int(hctsaFeatures['ID'][i])}, {"$set": dic})
    print("Non-matching codeString/codeFile:", count)


def updateTimeSeriesCollection():
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


# updateTimeSeriesCollection()
updateFeaturesCollection()
