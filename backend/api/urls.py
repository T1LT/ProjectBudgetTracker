from django.urls import path
from .views import dashboard, export_csv, home, reports, transactions, projects, handle_project, project_names, handle_transaction

urlpatterns = [
    path('', home),
    path('project/<id>/', dashboard),
    path('project/<id>/transactions/', transactions),
    path('project/<id>/report/', reports),
    path('projects/', projects),
    path('projects/modify-project/', handle_project),
    path('projects/add-transaction/', handle_transaction),
    path('projects/names/', project_names),
    path('project/<id>/download_csv/', export_csv),
]