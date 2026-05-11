from django.db import models

class FinancialReport(models.Model):
    date = models.DateField()
    revenue = models.DecimalField(max_digits=15, decimal_places=2)
    expenses = models.DecimalField(max_digits=15, decimal_places=2)
    profit = models.DecimalField(max_digits=15, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Report for {self.date}'