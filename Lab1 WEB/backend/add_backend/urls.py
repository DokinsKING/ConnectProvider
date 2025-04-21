from django.urls import path
from . import views

urlpatterns = [
    path('', views.main_page, name='main'),
    path('<int:service_id>/', views.service_detail, name='service_detail'),
    path('services', views.service_list, name='services'),
    path('applications', views.applications, name='applications'),
]
