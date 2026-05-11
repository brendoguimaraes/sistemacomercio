from django.db import models
from apps.products.models import Product

class Inventory(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE)
    current_stock = models.IntegerField(default=0)
    min_stock = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Inventory for {self.product.name}'