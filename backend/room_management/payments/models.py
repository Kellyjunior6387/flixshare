from django.db import models

# Create your models here.


class Transaction(models.Model):

    PAYMENT_STATUS = [
        ('pending', 'PENDING'),
        ('successful', 'SUCCESSFUL'),  # Changed back from 'SUCCESS' to 'successful'
        ('failed', 'FAILED'),
    ]
    phone_number = models.CharField(max_length=15)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    MpesaReceiptNumber = models.CharField(max_length=20, unique=True, null=True, blank=True)  # e.g., MPESA123XYZ
    description = models.TextField(blank=True)
    room_name = models.CharField(max_length=100, blank=True, null=True, help_text="Name of the room for payment")  # Added room_name field
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default="pending")  # e.g., PENDING, SUCCESSFUL, FAILED
    room_id = models.CharField(max_length=50, blank=True, null=True, help_text="Room ID for the payment")

    def __str__(self):
        return f"{self.phone_number} - {self.amount} KES"

class PaymentIntent(models.Model):
    merchant_request_id = models.CharField(max_length=100, unique=True)
    user_id = models.UUIDField()
    room_id = models.UUIDField()
    phone_number = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)

