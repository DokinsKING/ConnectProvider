from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from .models import Service, Application, ApplicationService
from .serializers import ServiceSerializer, ApplicationSerializer, ApplicationServiceSerializer
from django_filters import rest_framework as filters

# Фильтр для услуг
class ServiceFilter(filters.FilterSet):
    # Фильтрация по имени услуги
    name = filters.CharFilter(field_name="name", lookup_expr='icontains')  # Поиск по части имени услуги
    # Фильтрация по цене
    price_min = filters.NumberFilter(field_name="price", lookup_expr='gte')  # Минимальная цена
    price_max = filters.NumberFilter(field_name="price", lookup_expr='lte')  # Максимальная цена

    class Meta:
        model = Service
        fields = ['name', 'price_min', 'price_max']

# ViewSet для управления услугами
class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    filter_class = ServiceFilter  # Применяем фильтрацию для услуг

# ViewSet для управления заявками
class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

    def perform_update(self, serializer):
        instance = self.get_object()

        if instance.status == 'draft' and 'status' in self.request.data:
            # Разрешаем изменять статус только если он в черновике
            serializer.save()
        elif instance.status == 'formatted' and 'status' in self.request.data:
            # Только модератор может изменить статус на завершен или отклонен
            if self.request.user == instance.moderator:
                serializer.save()
            else:
                return Response({"detail": "You don't have permission to change the status."}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({"detail": "Invalid status change."}, status=status.HTTP_400_BAD_REQUEST)


class ApplicationServiceViewSet(viewsets.ModelViewSet):
    queryset = ApplicationService.objects.all()
    serializer_class = ApplicationServiceSerializer

    def perform_create(self, serializer):
        # Устанавливаем связи между заявками и услугами
        serializer.save()

    def perform_destroy(self, instance):
        # Удаление связи заявки и услуги
        instance.delete()

    def perform_update(self, serializer):
        # Обновление количества или других полей в связи
        instance = serializer.save()
        # Пример изменения количества
        if 'quantity' in self.request.data:
            instance.quantity = self.request.data['quantity']
            instance.save()

