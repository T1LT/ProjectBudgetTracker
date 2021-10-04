from django.db import models
from django.utils import timezone


class TransactionType(models.Model):
    name = models.CharField(max_length=32)

class Project(models.Model):
    name = models.CharField(max_length=32)
    start_date = models.DateTimeField(default=timezone.now)
    manager = models.CharField(max_length=32)
    budget = models.DecimalField(max_digits=32, decimal_places=6)


class Transaction(models.Model):
    name = models.CharField(max_length=32)
    type = models.ForeignKey(TransactionType, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=32, decimal_places=6)
    date = models.DateTimeField(default = timezone.now)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)



