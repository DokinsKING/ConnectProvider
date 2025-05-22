from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Service, Application, ApplicationService,ApplicationStatus, ServiceStatus
from django.contrib.auth.models import User
from .serializers import ServiceSerializer, ApplicationSerializer, ApplicationServiceSerializer, UserSerializer
from django_filters import rest_framework as filters
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework_simplejwt.views import TokenRefreshView
from django.core.cache import cache
import json


class PublicTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]

# Фильтр для услуг
class ServiceFilter(filters.FilterSet):
    name = filters.CharFilter(field_name="name", lookup_expr='icontains')
    price_min = filters.NumberFilter(field_name="price", lookup_expr='gte')
    price_max = filters.NumberFilter(field_name="price", lookup_expr='lte')

    class Meta:
        model = Service
        fields = ['name', 'price_min', 'price_max']

class ApplicationFilter(filters.FilterSet):
    start_date = filters.DateFilter(field_name="created_at", lookup_expr='gte')  # Start date filter
    end_date = filters.DateFilter(field_name="completion_date", lookup_expr='lte')  # End date filter
    status = filters.CharFilter(field_name="status", lookup_expr='icontains')  # Status filter

    class Meta:
        model = Application
        fields = ['start_date', 'end_date', 'status']


class AdminCheckView(APIView):
    def get(self, request):
        return Response({
            'is_admin': request.user.is_staff or request.user.is_superuser
        }, status=status.HTTP_200_OK)

class ApplicationStatusList(APIView):
    def get(self, request):
        # Собираем все возможные статусы из ApplicationStatus
        statuses = [status[1] for status in ApplicationStatus.choices]
        return Response(statuses)


# API View для работы с услугами
class ServiceList(APIView):
    permission_classes = [AllowAny] 
    filterset_class = ServiceFilter

    def get(self, request, *args, **kwargs):
        params = request.GET.urlencode()  # преобразуем параметры в строку вида "name=test&category=1"
        cache_key = f"service_{params}"
        cached_json = cache.get(cache_key)
        if(cached_json):
            data = json.loads(cached_json)
            return Response(data)

        services = Service.objects.filter(status=ServiceStatus.ACTIVE)
        
        # Применяем фильтрацию вручную
        filterset = self.filterset_class(request.GET, queryset=services)
        if filterset.is_valid():
            filtered_services = filterset.qs
        else:
            return Response({"detail": "Invalid filter parameters."}, status=status.HTTP_400_BAD_REQUEST)

        # Передаем контекст запроса в сериализатор
        serializer = ServiceSerializer(filtered_services, many=True, context={'request': request})
        cache.set(cache_key, json.dumps(serializer.data))
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = ServiceSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ServiceDetail(APIView):
    permission_classes = [AllowAny] 
    def get(self, request, pk, *args, **kwargs):
        cache_key = f"service_detail_{pk}"
        cached_json = cache.get(cache_key)
        
        # Если данные есть в кэше - возвращаем их
        if cached_json:
            return Response(json.loads(cached_json), status=status.HTTP_200_OK)
        
        try:
            service = Service.objects.get(pk=pk)
        except Service.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        # Сериализация и сохранение в кэш
        serializer = ServiceSerializer(service, context={'request': request})
        cache.set(cache_key, json.dumps(serializer.data))  # 15 минут
        
        return Response(serializer.data, status=status.HTTP_200_OK)

# API View для работы с заявками
class ApplicationList(APIView):
    filterset_class = ApplicationFilter  # Add the filterset class
    def get(self, request, *args, **kwargs):
        staff = request.user.is_staff or request.user.is_superuser
        # Check if the user is a moderator
        if staff:
            params = request.GET.urlencode()
            cache_key = f"applications_staff_{params}"
            cached_json = cache.get(cache_key)
            if cached_json:
                return Response(json.loads(cached_json))
            applications = Application.objects.exclude(status__in=[ApplicationStatus.DELETED, ApplicationStatus.COMPLETED, ApplicationStatus.REJECTED])  # Фильтруем заявки с статусами "deleted", "completed", "rejected"
        else:
            applications = Application.objects.filter(creator=request.user.id).exclude(status__in=[ApplicationStatus.DELETED, ApplicationStatus.COMPLETED, ApplicationStatus.REJECTED])

        
        # Apply filters manually using the filterset class
        filterset = self.filterset_class(request.GET, queryset=applications)
        if filterset.is_valid():
            filtered_applications = filterset.qs
        else:
            return Response({"detail": "Invalid filter parameters."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ApplicationSerializer(filtered_applications, many=True)
        if staff:
            params = request.GET.urlencode()
            cache_key = f"applications_staff_{params}"
            cache.set(cache_key, json.dumps(serializer.data)) 

        return Response(serializer.data)
            
    def post(self, request, *args, **kwargs):
        # Автоматически устанавливаем создателя заявки
        request.data['creator'] = request.user.id
        serializer = ApplicationSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ApplicationDetail(APIView):
    def get_permissions(self):
        permission_classes = [IsAdminUser]
        if self.request.method == 'GET':
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get(self, request, pk, *args, **kwargs):
        try:
            application = Application.objects.get(pk=pk)
        except Application.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ApplicationSerializer(application)
        return Response(serializer.data)
    def put(self, request, pk, *args, **kwargs):
        try:
            application = Application.objects.get(pk=pk)
        except Application.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        # Обновляем поля заявки на основе данных из запроса
        status_custom = request.data.get("status", application.status)  # если не передано, оставляем старое значение
        form_date = request.data.get("form_date", application.created_at)  # то же самое для даты оформления
        completion_date = request.data.get("completion_date", application.completion_date)  # то же самое для даты завершения

        # Применяем изменения
        application.status = status_custom
        application.form_date = form_date
        application.completion_date = completion_date
        application.moderator = request.user

        # Сохраняем обновленную заявку
        application.save()

        # Сериализуем обновленную заявку и возвращаем
        serializer = ApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

# API View для работы с заявками и услугами
class ApplicationServicesList(APIView):
    def get_permissions(self):
        permission_classes = [IsAdminUser]
        if self.request.method == 'POST':
            # For POST requests, allow any authenticated user
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]


    def get(self, request, *args, **kwargs):
        application_services = ApplicationService.objects.all()  # Note: removed try-except as all() never raises DoesNotExist
        serializer = ApplicationServiceSerializer(application_services, many=True)  # Added many=True
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = ApplicationServiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, *args, **kwargs):
        try:
            application_service = ApplicationService.objects.get(pk=pk)
        except ApplicationService.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ApplicationServiceSerializer(application_service, data=request.data, partial=True)
        if serializer.is_valid():
            updated_instance = serializer.save()
            if 'quantity' in request.data:
                updated_instance.quantity = request.data['quantity']
                updated_instance.save()
            return Response(serializer.data)
        return Response({"No access"}, status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, pk, *args, **kwargs):
        try:
            application_service = ApplicationService.objects.get(pk=pk)
        except ApplicationService.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        application_service.delete()
        return Response({"detail": "Deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


# API View для работы с пользователями
class UserList(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request, *args, **kwargs):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserDetail(APIView):
    def get(self, request, pk, *args, **kwargs):
        try:
            user = User.objects.get(pk=pk)  # Получаем пользователя по id
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Возвращаем только имя пользователя
        return Response({"username": user.username})

    
class RegisterUserView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Создаем JWT токен для нового пользователя
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    def post(self, request):
        try:
            refresh = request.data["refresh_token"]
            token = RefreshToken(refresh)
            token.blacklist()  # Добавляем refresh токен в черный список
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)