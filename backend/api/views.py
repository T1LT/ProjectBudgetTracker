from django.db.models.aggregates import Sum
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Project, Transaction, TransactionType
from .serializers import ProjectSerializer, TransactionSerializer

from datetime import datetime


def home(request):
    return HttpResponse("<h1>nice</h1>")

@api_view(["GET"])
def dashboard(request, id):
    budget = {"budget":Project.objects.get(id = id).budget}

    incurred_expenses = Transaction.objects.filter(project__id = id).aggregate(incurred_expenses = Sum('amount'))
    expenses = {}

    for x in TransactionType.objects.all():
        expenses[x.name] = Transaction.objects.filter(project = id).filter(type = x.id).aggregate(Sum('amount')).get('amount__sum', 0)
    for x in expenses:
        if expenses[x]:
            expenses[x] = float(expenses[x])
        else:
            expenses[x] = 0
    return Response({**budget, **incurred_expenses, **{"expenses": expenses}})

@api_view(["GET"])
def transactions(request, id):
    records = Transaction.objects.filter(project = id)
    serializer = TransactionSerializer(records, many = True)
    for x in serializer.data:
        x['type'] = TransactionType.objects.get(id = x['type']).name
    return Response(serializer.data)

@api_view(["GET"])
def reports(request, id):
    reports = {}
    for month in range(1, 13):
        reports[month] = Transaction.objects.filter(project = id).filter(date__month = month).aggregate(Sum('amount')).get('amount__sum', 0)
        if reports[month]:
            reports[month] = float(reports[month])
        else:
            reports[month] = 0
    return Response(reports)

@api_view(["GET"])
def projects(request):
    serializer = ProjectSerializer(Project.objects.all(), many = True)
    return Response(serializer.data)

# @api_view(["GET"])
# def project_names(request):
#     project_names = {}
#     for record in Project.objects.values_list('name','id'):
#         project_names[record[0]] = record[1]
#     return Response(project_names)

@api_view(["POST"])
def add_project(request):
    if request.method == 'POST':
        print()
        project_details = Project(
            name = request.data['projname'],
            start_date = datetime(*map(int, request.data['projdate'].split('-'))),
            manager = request.data['projmanager'],
            budget = request.data['projbudget']
        )
        project_details.save()
    return HttpResponse(status = 200)