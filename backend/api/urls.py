from django.urls import path
from .views import dashboard, home, project_names, reports, transactions, projects

urlpatterns = [
    path('', home),
    path('project/<id>/', dashboard),
    path('project/<id>/transactions/', transactions),
    path('project/<id>/report/', reports),
    path('projects/', projects),
    path('projects/names/', project_names)
]