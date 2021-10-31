import datetime
from django.db.models.aggregates import Sum
from django.http import HttpResponse, response
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import MonthlyBudget, Project, Transaction, TransactionType
from .serializers import ProjectSerializer, TransactionSerializer

from datetime import date
import csv


def home(request):
    return HttpResponse("<h1>nice</h1>")


@api_view(["GET"])
def dashboard(request, id):
    budget = {"budget": Project.objects.get(id=id).budget}

    incurred_expenses = Transaction.objects.filter(
        project__id=id).aggregate(incurred_expenses=Sum('amount'))
    expenses = {}

    monthly_budget = MonthlyBudget.objects.values_list().get(id = id)[1:]
    monthly_budget_sum = {"monthly_budget_sum": sum(monthly_budget)}

    for x in TransactionType.objects.all():
        expenses[x.name] = Transaction.objects.filter(project=id).filter(
            type=x.id).aggregate(Sum('amount')).get('amount__sum', 0)
    for x in expenses:
        if expenses[x]:
            expenses[x] = float(expenses[x])
        else:
            expenses[x] = 0
    return Response({**budget, **incurred_expenses, **monthly_budget_sum, **{"expenses": expenses}})


@api_view(["GET"])
def transactions(request, id):
    records = Transaction.objects.filter(project=id)
    serializer = TransactionSerializer(records, many=True)
    for x in serializer.data:
        x['type'] = TransactionType.objects.get(id=x['type']).name
    return Response(serializer.data)


@api_view(["GET"])
def reports(request, id):
    reports = {}
    for month in range(1, 13):
        reports[month] = Transaction.objects.filter(project=id).filter(
            date__month=month).aggregate(Sum('amount')).get('amount__sum', 0)
        if reports[month]:
            reports[month] = float(reports[month])
        else:
            reports[month] = 0
    return Response(reports)


@api_view(["GET"])
def projects(request):
    serializer = ProjectSerializer(Project.objects.all(), many=True)
    return Response(serializer.data)


@api_view(["GET"])
def project_names(request):
    project_names = {}
    for record in Project.objects.values_list('name', 'id'):
        project_names[record[1]] = record[0]
    return Response(project_names)


@api_view(["POST", "PUT", "DELETE"])
def handle_project(request):
    if request.method == 'POST':
        print(request.data["projectMonthlyBudgets"])
        monthly_budget_details = MonthlyBudget(
            january = request.data["projectMonthlyBudgets"][0],
            february = request.data["projectMonthlyBudgets"][1],
            march = request.data["projectMonthlyBudgets"][2],
            april = request.data["projectMonthlyBudgets"][3],
            may = request.data["projectMonthlyBudgets"][4],
            june = request.data["projectMonthlyBudgets"][5],
            july = request.data["projectMonthlyBudgets"][6],
            august = request.data["projectMonthlyBudgets"][7],
            september = request.data["projectMonthlyBudgets"][8],
            october = request.data["projectMonthlyBudgets"][9],
            november = request.data["projectMonthlyBudgets"][10],
            december = request.data["projectMonthlyBudgets"][11],
        )
        monthly_budget_details.save()
        project_details = Project(
            name=request.data['projectName'],
            start_date = date(*map(int, request.data['projectStartDate'].split('-'))),
            end_date = date(*map(int, request.data['projectEndDate'].split('-'))),
            manager = request.data['projectManager'],
            budget = request.data['projectBudget'],
            monthly_budget = MonthlyBudget.objects.get(id = monthly_budget_details.id)
        )
        project_details.save()

    elif request.method == "PUT":
        project_details = Project.objects.get(id = request.data["id"])
        project_details.name = request.data["projname"]
        project_details.start_date = date(*map(int, request.data['projdate'][:10].split('-')))
        project_details.manager = request.data["projmanager"]
        project_details.budget = request.data["projbudget"]
        project_details.save()

    elif request.method == "DELETE":
        Project.objects.get(id = request.data["id"]).delete()
    return HttpResponse(status=200)


@api_view(["POST", "PUT", "DELETE"])
def handle_transaction(request):
    print(request.data)
    if request.method == 'POST':
        transaction_details = Transaction(
            name=request.data["transaction-name"],
            type=TransactionType.objects.get(name = request.data["transaction-type"]),
            amount=request.data["transaction-amount"],
            date=date(*map(int, request.data['transaction-date'].split('-'))),
            project=Project.objects.get(id=request.data["project_id"]),
        )
        transaction_details.save()
    elif request.method == "PUT":
        transaction_details = Transaction.objects.get(id = request.data["transaction-id"])
        transaction_details.name = request.data["transaction-name"]
        transaction_details.amount = request.data["transaction-amount"]
        transaction_details.type = TransactionType.objects.get(name = request.data["transaction-type"])
        transaction_details.date = date(*map(int, request.data['transaction-date'].split('-')))
        transaction_details.save()
    elif request.method == "DELETE":
        Transaction.objects.get(id = request.data["transaction-id"]).delete()

    return HttpResponse(status=200)

@api_view(["GET"])
def export_csv(request, id):
    transaction_details = Transaction.objects.filter(project_id = id)

    response = HttpResponse(content_type = 'text/csv')
    # response['Content-Disposition'] = f'attachment; filename={Project.objects.get(id = id).name}.csv'
    writer = csv.writer(response)
    writer.writerow(["S.No.","Transaction Name", "Transaction Amount", "Transaction Type"])
    for ind, x in enumerate(transaction_details):
        writer.writerow([ind+1, x.name, x.amount, x.date, x.type.name])
    return response