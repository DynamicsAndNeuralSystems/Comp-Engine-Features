from django.contrib import admin
from django.urls import path
from CompEngineFeaturesWeb import views

urlpatterns = [
    path('', views.index,name='home'),
    path('about', views.about,name='about'),
    path('contact', views.contact,name='contact'),
    path('contribute', views.contribute,name='contribute'),
    path('howitworks', views.howitworks,name='howitworks'),
    path('result',views.result,name='result')
    
]