from django.contrib import admin
from .models import Service, Application, User, ApplicationService

admin.site.register(Service)
admin.site.register(Application)
admin.site.register(User)
admin.site.register(ApplicationService)
