from rest_framework import serializers
from .models import Service, Application, ApplicationService
from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError
from django.core.files.base import ContentFile
import base64
import uuid

class Base64ImageField(serializers.ImageField):
    def to_internal_value(self, data):
        if isinstance(data, str) and data.startswith('data:image'):
            format, imgstr = data.split(';base64,')
            ext = format.split('/')[-1]
            
            data = ContentFile(
                base64.b64decode(imgstr),
                name=f"{uuid.uuid4()}.{ext}"
            )
        return super().to_internal_value(data)

    def to_representation(self, value):
        if not value:
            return None
            
        try:
            with value.open() as f:
                return f"data:image/{value.name.split('.')[-1]};base64,{base64.b64encode(f.read()).decode()}"
        except:
            return None

class ServiceSerializer(serializers.ModelSerializer):
    image = Base64ImageField(required=False)  # Используем кастомное поле

    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'price', 'image', 'status']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
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
        # Проверка уникальности username и email
        if User.objects.filter(username=validated_data['username']).exists():
            raise ValidationError("Username is already taken.")

        # Создание пользователя
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

