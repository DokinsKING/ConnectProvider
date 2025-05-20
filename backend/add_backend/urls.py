from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from . import views


urlpatterns = [
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    path('api/register/', views.RegisterUserView.as_view(), name='register'),
    path('api/logout/', views.LogoutView.as_view(), name='logout'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', views.PublicTokenRefreshView.as_view(), name='token_refresh'),
    path('api/check-admin/', views.AdminCheckView.as_view(), name='check-admin'),


    path('api/application-statuses', views.ApplicationStatusList.as_view(), name='application-statuses'),
    path('api/services/', views.ServiceList.as_view(), name='service-list'),
    path('api/services/<int:pk>/', views.ServiceDetail.as_view(), name='service-detail'),
    path('api/applications/', views.ApplicationList.as_view(), name='application-list'),
    path('api/applications/<int:pk>/', views.ApplicationDetail.as_view(), name='application-detail'),
    path('api/application-services/', views.ApplicationServicesList.as_view(), name='application-services-list'),
    path('api/users/', views.UserList.as_view(), name='user-list'),
    path('api/users/<int:pk>/', views.UserDetail.as_view(), name='user-detail'),
]
