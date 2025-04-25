from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Создаем роутер для автоматической генерации маршрутов для ViewSet-ов
router = DefaultRouter()
router.register(r'services', views.ServiceViewSet)
router.register(r'applications', views.ApplicationViewSet)
router.register(r'application-services', views.ApplicationServiceViewSet)
router.register(r'users', views.UserViewSet)

# Здесь подключаем только API маршруты
urlpatterns = [
    path('api/', include(router.urls)),  # Подключаем все API-роуты
]
