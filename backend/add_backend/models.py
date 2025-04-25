from django.db import models
from django.contrib.auth.models import User as Moderator

# Статусы заявки
class ApplicationStatus(models.TextChoices):
    DRAFT = 'draft', 'Черновик'
    DELETED = 'deleted', 'Удалён'
    FORMATTED = 'formatted', 'Сформирован'
    COMPLETED = 'completed', 'Завершён'
    REJECTED = 'rejected', 'Отклонён'

# Статус услуги
class ServiceStatus(models.TextChoices):
    ACTIVE = 'active', 'Действует'
    DELETED = 'deleted', 'Удален'

# Модель пользователя
class User(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    role = models.CharField(max_length=50)

    def __str__(self):
        return self.name  # Теперь при отображении будет выводиться только имя услуги

# Модель услуги
class Service(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.IntegerField()
    image = models.URLField(max_length=500)
    status = models.CharField(max_length=10, choices=ServiceStatus.choices, default=ServiceStatus.ACTIVE)
    def soft_delete(self):
        self.status = ServiceStatus.DELETED
        self.save()

    def __str__(self):
        return self.name  # Теперь при отображении будет выводиться только имя услуги

# Модель заявки
class Application(models.Model):
    status = models.CharField(max_length=10, choices=ApplicationStatus.choices, default=ApplicationStatus.DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)
    form_date = models.DateTimeField(null=True, blank=True)
    completion_date = models.DateTimeField(null=True, blank=True)
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_applications')
    moderator = models.ForeignKey(Moderator, on_delete=models.SET_NULL, null=True, related_name='moderated_applications')

    def __str__(self):
        # Проверка, если creator существует
        creator_name = self.creator.name if self.creator else "No creator"
        return f"Заявка #{self.pk} от {creator_name}"

# Связующая таблица для заявки и услуги
class ApplicationService(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='application_services')
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('application', 'service')

    def __str__(self):
        return f"Заявка #{self.application.pk} - Услуга: {self.service.name}"