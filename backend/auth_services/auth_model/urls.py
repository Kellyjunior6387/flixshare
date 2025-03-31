from django.urls import path
from .views import RegisterView, LoginView, TestJWT, VerifyUser

urlpatterns = [
    path('register/', RegisterView.as_view(), name='create-room'),
    path('login/', LoginView.as_view(), name='login'),
    path('test/', TestJWT.as_view(), name='test'),
    path('verify/', VerifyUser.as_view(), name='verify')
]  