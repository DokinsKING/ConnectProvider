from django.db import models

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

# Модель услуги
class Service(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='add_backend/static/img')
    status = models.CharField(max_length=10, choices=ServiceStatus.choices, default=ServiceStatus.ACTIVE)
    def soft_delete(self):
        self.status = ServiceStatus.DELETED
        self.save()

# Модель заявки
class Application(models.Model):
    status = models.CharField(max_length=10, choices=ApplicationStatus.choices, default=ApplicationStatus.DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)
    form_date = models.DateTimeField(null=True, blank=True)
    completion_date = models.DateTimeField(null=True, blank=True)
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_applications')
    moderator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='moderated_applications')

# Связующая таблица для заявки и услуги
class ApplicationService(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    class Meta:
        unique_together = ('application', 'service')
