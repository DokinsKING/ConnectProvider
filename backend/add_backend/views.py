from django.shortcuts import render
from .data import services_list

def service_list(request):
    query = request.GET.get("q", "").lower()
    filtered_services = [s for s in services_list if query in s["name"].lower() or query in str(s["price"])]
    return render(request, "services_page.html", {"services": filtered_services, "query": query})

def service_detail(request, service_id):
    service = next((s for s in services_list if s["id"] == service_id), None)
    return render(request, "service_detail_page.html", {"service": service})
