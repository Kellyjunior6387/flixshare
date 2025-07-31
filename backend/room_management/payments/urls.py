from django.urls import path
from .views import MpesaSTKPushView

urlpatterns = [
    path('stk-push/', MpesaSTKPushView.as_view(), name='stk-push'),
]
