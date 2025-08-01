from django.db import models

# Create your models here.


class Transaction(models.Model):

    PAYMENT_STATUS = [
        ('pending', 'PENDING'),
        ('successful', 'SUCCESS'),
        ('failed', 'FAILED'),
    ]
    phone_number = models.CharField(max_length=15)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    MpesaReceiptNumber = models.CharField(max_length=20, unique=True)  # e.g., MPESA123XYZ
    description = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default="PENDING")  # e.g., PENDING, SUCCESS, FAILED

    def __str__(self):
        return f"{self.phone_number} - {self.amount} KES"
