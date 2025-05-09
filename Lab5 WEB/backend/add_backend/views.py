from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Service, Application, ApplicationService
from django.contrib.auth.models import User
from .serializers import ServiceSerializer, ApplicationSerializer, ApplicationServiceSerializer, UserSerializer
from django_filters import rest_framework as filters
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken


# Фильтр для услуг
class ServiceFilter(filters.FilterSet):
    name = filters.CharFilter(field_name="name", lookup_expr='icontains')
    price_min = filters.NumberFilter(field_name="price", lookup_expr='gte')
    price_max = filters.NumberFilter(field_name="price", lookup_expr='lte')

    class Meta:
        model = Service
        fields = ['name', 'price_min', 'price_max']


# API View для работы с услугами
class ServiceList(APIView):
    permission_classes = [AllowAny] 
    filterset_class = ServiceFilter

    def get(self, request, *args, **kwargs):
        services = Service.objects.all()
        
        # Применяем фильтрацию вручную
        filterset = self.filterset_class(request.GET, queryset=services)
        if filterset.is_valid():
            filtered_services = filterset.qs
        else:
            return Response({"detail": "Invalid filter parameters."}, status=status.HTTP_400_BAD_REQUEST)

        # Передаем контекст запроса в сериализатор
        serializer = ServiceSerializer(filtered_services, many=True, context={'request': request})
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
        try:
            service = Service.objects.get(pk=pk)
        except Service.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        # Передаем контекст запроса в сериализатор
        serializer = ServiceSerializer(service, context={'request': request})
        return Response(serializer.data)

# API View для работы с заявками
class ApplicationList(APIView):
    def get(self, request, *args, **kwargs):
        # Проверяем, является ли пользователь модератором
        if request.user.groups.filter(name='Moderators').exists():
            # Модератор видит все заявки
            applications = Application.objects.all()
        else:
            # Обычный пользователь видит только свои заявки
            applications = Application.objects.filter(creator=request.user)
        
        serializer = ApplicationSerializer(applications, many=True)
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
    def get(self, request, pk, *args, **kwargs):
        try:
            application = Application.objects.get(pk=pk)
        except Application.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ApplicationSerializer(application)
        return Response(serializer.data)
    

# API View для работы с заявками и услугами
class ApplicationServicesList(APIView):
    def get(self, request, pk, *args, **kwargs):
        try:
            application_service = ApplicationService.objects.get(pk=pk)
        except ApplicationService.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ApplicationServiceSerializer(application_service)
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
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, *args, **kwargs):
        try:
            application_service = ApplicationService.objects.get(pk=pk)
        except ApplicationService.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        application_service.delete()
        return Response({"detail": "Deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


# API View для работы с пользователями
class UserList(APIView):
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
