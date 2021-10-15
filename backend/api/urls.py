from django.urls import path
from .views import dashboard, home, reports, transactions, projects, add_project, project_names, add_transaction

urlpatterns = [
    path('', home),
    path('project/<id>/', dashboard),
    path('project/<id>/transactions/', transactions),
    path('project/<id>/report/', reports),
    path('projects/', projects),
    path('projects/add-project/', add_project),
    path('projects/add-transaction/', add_transaction),
    path('projects/names/', project_names)
]