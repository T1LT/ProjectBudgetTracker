from django.db import models

class MonthlyBudget(models.Model):
    january = models.DecimalField(max_digits=32, decimal_places=6, null=True)
    february = models.DecimalField(max_digits=32, decimal_places=6, null=True)
    march = models.DecimalField(max_digits=32, decimal_places=6, null=True)
    april = models.DecimalField(max_digits=32, decimal_places=6, null=True)
    may = models.DecimalField(max_digits=32, decimal_places=6, null=True)
    june = models.DecimalField(max_digits=32, decimal_places=6, null=True)
    july = models.DecimalField(max_digits=32, decimal_places=6, null=True)
    august = models.DecimalField(max_digits=32, decimal_places=6, null=True)
    september = models.DecimalField(max_digits=32, decimal_places=6, null=True)
    october = models.DecimalField(max_digits=32, decimal_places=6, null=True)
    november = models.DecimalField(max_digits=32, decimal_places=6, null=True)
    december = models.DecimalField(max_digits=32, decimal_places=6, null=True)

class Project(models.Model):
    name = models.CharField(max_length=32)
    start_date = models.DateField()
    end_date = models.DateField()
    manager = models.CharField(max_length=32)
    budget = models.DecimalField(max_digits=32, decimal_places=6)
    monthly_budget = models.ForeignKey(MonthlyBudget, on_delete=models.CASCADE)

class TransactionType(models.Model):
    name = models.CharField(max_length=32)

class Transaction(models.Model):
    name = models.CharField(max_length=32)
    type = models.ForeignKey(TransactionType, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=32, decimal_places=6)
    date = models.DateField()
    project = models.ForeignKey(Project, on_delete=models.CASCADE)



