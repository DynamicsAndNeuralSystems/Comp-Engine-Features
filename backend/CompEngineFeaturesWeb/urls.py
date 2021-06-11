from django.urls import path
from CompEngineFeaturesWeb import views

urlpatterns = [
    path('codesubmit', views.apicodesubmit, name='apicodesubmit'),
    path('exploremode/userfeature', views.apiuserfeature, name='apiuserfeature'),
    path('getfeatures', views.getfeatures, name="getfeatures"),
    path('network/<fid>/<nodes>', views.apiNetwork, name="apiNetwork"),
    path('exploremode/<number>/<fname>', views.apiexploremode, name="apiexploremode"),
    path('gettimeseries/<timeseriesname>', views.gettimeseries, name='gettimeseries'),
]
