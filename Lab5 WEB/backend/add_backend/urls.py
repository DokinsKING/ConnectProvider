from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('api/register/', views.RegisterUserView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


    path('api/services/', views.ServiceList.as_view(), name='service-list'),
    path('api/services/<int:pk>/', views.ServiceDetail.as_view(), name='service-detail'),
    path('api/applications/', views.ApplicationList.as_view(), name='application-list'),
    path('api/applications/<int:pk>/', views.ApplicationDetail.as_view(), name='application-detail'),
    path('api/application-services/', views.ApplicationServicesList.as_view(), name='application-services-list'),
    path('api/users/', views.UserList.as_view(), name='user-list'),
]
