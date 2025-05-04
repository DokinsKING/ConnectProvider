from django.urls import path
from . import views

urlpatterns = [
    path('api/services/', views.ServiceList.as_view(), name='service-list'),
    path('api/services/<int:pk>/', views.ServiceDetail.as_view(), name='service-detail'),
    path('api/applications/', views.ApplicationList.as_view(), name='application-list'),
    path('api/applications/<int:pk>/', views.ApplicationDetail.as_view(), name='application-detail'),
    path('api/application-services/', views.ApplicationServicesList.as_view(), name='application-services-list'),
    path('api/users/', views.UserList.as_view(), name='user-list'),
]
