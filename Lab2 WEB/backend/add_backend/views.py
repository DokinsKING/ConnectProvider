from django.shortcuts import render
from .data import services_list
from .models import Service, Application

def main_page(request):
    return render(request, "main_page.html", {"show_services": ""})

def service_list(request):
    query = request.GET.get("q", "").lower()
    services = Service.objects.all()  # Получаем все услуги из базы данных

    # Фильтруем услуги по запросу
    if query:
        services = services.filter(name__icontains=query)
    
    return render(request, "main_page.html", {"show_services": "services","services": services,"query": query})

def service_detail(request, service_id):
    service = Service.objects.get(id=service_id)  # Получаем услугу по id
    return render(request, "main_page.html", {"show_services": "service_detail", "service": service })

def applications(request):
    applications = Application.objects.all()
    return render(request, "main_page.html", {"show_services": "applications", "applications": applications})
