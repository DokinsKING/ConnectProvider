from django.shortcuts import render
from .data import services_list

def main_page(request):
    return render(request, "main_page.html", {"show_services": ""})

def service_list(request):
    query = request.GET.get("q", "").lower()
    filtered_services = [s for s in services_list if query in s["name"].lower() or query in str(s["price"])]
    return render(request, "main_page.html", {"show_services": "services", "services": filtered_services, "query": query})

def service_detail(request, service_id):
    service = next((s for s in services_list if s["id"] == service_id), None)
    return render(request, "main_page.html", {"show_services": "service_detail", "service": service})

def applications(request):
    return render(request, "main_page.html", {"show_services": "applications"})
