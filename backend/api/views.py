from django import http
from django.db.models.aggregates import Sum
from django.http import HttpResponse
from rest_framework import serializers
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import MonthlyBudget, Project, Transaction, TransactionType
from .serializers import ProjectSerializer, TransactionSerializer

from datetime import date
import csv


def home(request):
    return HttpResponse("<h1>nice</h1>")

def get_monthly_budget_data(id):
    monthly_budget_data = MonthlyBudget.objects.values_list().get(id = id)[1:]
    return monthly_budget_data

@api_view(["GET"])
def dashboard(request, id):
    budget = {"budget": Project.objects.get(id=id).budget}

    incurred_expenses = Transaction.objects.filter(
        project__id=id).aggregate(incurred_expenses=Sum('amount'))

    monthly_budget_data = get_monthly_budget_data(id)
    try:
        max_month = Transaction.objects.filter(project = id).latest('date').date.month
        min_month = Transaction.objects.filter(project = id).earliest('date').date.month
        if min_month > max_month:
            monthly_budget_sum = {"monthly_budget_sum": sum(monthly_budget_data[min_month-1:]) + sum(monthly_budget_data[:max_month])}
        else:
            monthly_budget_sum = {"monthly_budget_sum": sum(monthly_budget_data[min_month-1:max_month])}
    except:
        monthly_budget_sum = {"monthly_budget_sum": sum(monthly_budget_data)}

    expenses = {}
    for x in TransactionType.objects.all():
        expenses[x.name] = Transaction.objects.filter(project=id).filter(
            type=x.id).aggregate(Sum('amount')).get('amount__sum', 0)
    for x in expenses:
        if expenses[x]:
            expenses[x] = float(expenses[x])
        else:
            expenses[x] = 0
    # return HttpResponse("nice")
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
    reports = {"expenses": reports}
    monthly_budget_data = {"monthly_budgets": get_monthly_budget_data(id)}
    return Response({**reports, **monthly_budget_data})


@api_view(["GET"])
def projects(request):
    serializer = ProjectSerializer(Project.objects.all(), many=True)
    project_data = serializer.data
    for i, x in enumerate(serializer.data):
        project_data[i]["monthly_budget"] = get_monthly_budget_data(project_data[i]["id"])
    return Response(project_data)


@api_view(["GET"])
def project_names(request):
    project_names = {}
    for record in Project.objects.values_list('name', 'id'):
        project_names[record[1]] = record[0]
    return Response(project_names)


@api_view(["POST", "PUT", "DELETE"])
def handle_project(request):
    if request.method == 'POST':
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
        project_details.name = request.data["projectName"]
        project_details.start_date = date(*map(int, request.data['projectStartDate'].split('-')))
        project_details.end_date = date(*map(int, request.data["projectEndDate"].split('-')))
        project_details.manager = request.data["projectManager"]
        project_details.budget = request.data["projectBudget"]

        monthly_budget_details = MonthlyBudget.objects.get(id = project_details.monthly_budget.id)
        monthly_budget_details.january = request.data["projectMonthlyBudgets"][0]
        monthly_budget_details.february = request.data["projectMonthlyBudgets"][1]
        monthly_budget_details.march = request.data["projectMonthlyBudgets"][2]
        monthly_budget_details.april = request.data["projectMonthlyBudgets"][3]
        monthly_budget_details.may = request.data["projectMonthlyBudgets"][4]
        monthly_budget_details.june = request.data["projectMonthlyBudgets"][5]
        monthly_budget_details.july = request.data["projectMonthlyBudgets"][6]
        monthly_budget_details.august = request.data["projectMonthlyBudgets"][7]
        monthly_budget_details.september = request.data["projectMonthlyBudgets"][8]
        monthly_budget_details.october = request.data["projectMonthlyBudgets"][9]
        monthly_budget_details.november = request.data["projectMonthlyBudgets"][10]
        monthly_budget_details.december = request.data["projectMonthlyBudgets"][11]
        monthly_budget_details.save()

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