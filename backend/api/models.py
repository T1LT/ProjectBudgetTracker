from django.db import models

class MonthlyBudget(models.Model):
    january = models.DecimalField(max_digits=32, decimal_places=6)
    february = models.DecimalField(max_digits=32, decimal_places=6)
    march = models.DecimalField(max_digits=32, decimal_places=6)
    april = models.DecimalField(max_digits=32, decimal_places=6)
    may = models.DecimalField(max_digits=32, decimal_places=6)
    june = models.DecimalField(max_digits=32, decimal_places=6)
    july = models.DecimalField(max_digits=32, decimal_places=6)
    august = models.DecimalField(max_digits=32, decimal_places=6)
    september = models.DecimalField(max_digits=32, decimal_places=6)
    october = models.DecimalField(max_digits=32, decimal_places=6)
    november = models.DecimalField(max_digits=32, decimal_places=6)
    december = models.DecimalField(max_digits=32, decimal_places=6)

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



