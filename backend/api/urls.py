from django.urls import path
from .views import dashboard, home, reports, transactions, projects, add_project

urlpatterns = [
    path('', home),
    path('project/<id>/', dashboard),
    path('project/<id>/transactions/', transactions),
    path('project/<id>/report/', reports),
    path('projects/', projects),
    path('projects/add-project/', add_project)
    # path('projects/names/', project_names)
]