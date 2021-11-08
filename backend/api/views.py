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

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
full_months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]

def home(request):
    return HttpResponse("<h1>nice</h1>")

def get_monthly_budget_data(id):
    monthly_budget_data = MonthlyBudget.objects.values_list().get(id = id)[1:]
    return list(monthly_budget_data)

@api_view(["GET"])
def dashboard(request, id):
    project_details = Project.objects.get(id=id)
    budget = {"budget": project_details.budget}

    incurred_expenses = Transaction.objects.filter(
        project__id=id).aggregate(incurred_expenses=Sum('amount'))

    monthly_budget_data = get_monthly_budget_data(project_details.monthly_budget.id)
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
    project_details = Project.objects.get(id = id)
    min_date = project_details.start_date
    labels = months[min_date.month - 1:] + months[:min_date.month-1]
    curr_year = str(min_date.year)
    for i in range(12):
        labels[i] += "'" + curr_year[2:]
        if labels[i][:3] == "Dec":
            curr_year = str(int(curr_year) + 1)
    labels = {"labels": labels}

    expenses = []
    for month in range(min_date.month, min_date.month + 12):
        month = month % 12
        expenses.append(
            Transaction.objects.filter(project=id).filter(
            date__month=month).aggregate(Sum('amount')).get('amount__sum', 0)
        )
        expenses[-1] = float(expenses[-1]) if expenses[-1] else 0
    expenses = {"expenses": expenses}


    monthly_budget_data = get_monthly_budget_data(project_details.monthly_budget.id)
    monthly_budget_data = monthly_budget_data[min_date.month - 1:] + monthly_budget_data[:min_date.month-1]
    monthly_budget_data = {"monthly_budgets": monthly_budget_data}

    return Response({**expenses, **monthly_budget_data, **labels})


@api_view(["GET"])
def projects(request):
    serializer = ProjectSerializer(Project.objects.all(), many=True)
    project_data = serializer.data
    for i, x in enumerate(serializer.data):
        start_date = Project.objects.get(id = project_data[i]["id"]).start_date
        monthly_budget_data = get_monthly_budget_data(project_data[i]["monthly_budget"])
        project_data[i]["monthly_budget"] = monthly_budget_data[start_date.month - 1:] + monthly_budget_data[:start_date.month-1]
    return Response(project_data)


@api_view(["GET"])
def project_names(request):
    project_names = {}
    for record in Project.objects.values_list('name', 'id'):
        project_names[record[1]] = record[0]
    return Response(project_names)


@api_view(["POST", "PUT", "DELETE"])
def handle_project(request):
    start_month = int(request.data["projectStartDate"].split("-")[1])
    monthly_budget_details = {}
    for i in range(12):
        monthly_budget_details[full_months[i]] = request.data["projectMonthlyBudgets"][(12 - start_month + 1 + i)%12 ]
    if request.method == 'POST':
        monthly_budget_details = MonthlyBudget(**monthly_budget_details)
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

        _monthly_budget_details = MonthlyBudget.objects.filter(id = project_details.monthly_budget.id)
        _monthly_budget_details.update(**monthly_budget_details)

        project_details.save()

    elif request.method == "DELETE":
        project_details = Project.objects.get(id = request.data["id"])
        MonthlyBudget.objects.get(id = project_details.monthly_budget.id).delete()
        project_details.delete()
    return HttpResponse(status=200)


@api_view(["POST", "PUT", "DELETE"])
def handle_transaction(request):
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