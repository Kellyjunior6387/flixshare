from django.urls import path
from .views import MpesaSTKPushView, MpesaCallbackView, TransactionListView

urlpatterns = [
    path('stk-push/', MpesaSTKPushView.as_view(), name='stk-push'),
    path('callback/',  MpesaCallbackView.as_view(), name='callback'),
    path('transactions/', TransactionListView.as_view(), name='transactions')
]
