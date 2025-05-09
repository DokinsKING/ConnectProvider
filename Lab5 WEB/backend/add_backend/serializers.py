from rest_framework import serializers
from .models import Service, Application, ApplicationService
from django.contrib.auth.models import User

# Сериализатор для услуги
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'price', 'image', 'status']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Если метод запроса - PUT или PATCH, то сделаем поля необязательными
        if self.context['request'].method in ['PUT', 'PATCH']:
            for field in self.fields:
                self.fields[field].required = False

# Сериализатор для ApplicationService
class ApplicationServiceSerializer(serializers.ModelSerializer):
    service = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all())  # Выбираем существующие услуги
    application = serializers.PrimaryKeyRelatedField(queryset=Application.objects.all())  # Для связи с заявкой

    class Meta:
        model = ApplicationService
        fields = ['id', 'application', 'service']

class ApplicationSerializer(serializers.ModelSerializer):
    # Это поле будет только для чтения, и оно будет показывать связанные услуги
    application_services = ApplicationServiceSerializer(many=True, read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'status', 'created_at', 'form_date', 'completion_date', 'creator', 'moderator', 'application_services']

    def __init__(self, *args, **kwargs):
        # Если мы создаем заявку, не включаем поле application_services
        if kwargs.get('context') and kwargs['context'].get('request') and kwargs['context']['request'].method == 'POST':
            self.fields.pop('application_services', None)  # Исключаем поле для POST-запросов
        super().__init__(*args, **kwargs)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

