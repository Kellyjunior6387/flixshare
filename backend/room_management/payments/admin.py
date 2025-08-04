from django.contrib import admin
from .models import Transaction, PaymentIntent
# Register your models here.
admin.site.register(Transaction)
admin.site.register(PaymentIntent)