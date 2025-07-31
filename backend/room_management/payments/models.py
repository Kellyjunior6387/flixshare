from django.db import models

# Create your models here.


class Transaction(models.Model):

    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('successful', 'Successful'),
        ('failed', 'Failed'),
    ]
    phone_number = models.CharField(max_length=15)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    mpesa_code = models.CharField(max_length=20, unique=True)  # e.g., MPESA123XYZ
    reference = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default="PENDING")  # e.g., PENDING, SUCCESS, FAILED

    def __str__(self):
        return f"{self.mpesa_code} - {self.amount} KES"
