from rest_framework import serializers

from .models import MonthlyBudget, Transaction, Project


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'name', 'amount', 'date', 'type']

class MonthlyBudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyBudget
        fields = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
