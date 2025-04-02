from django.urls import path
from .views import RegisterView, LoginView, TestJWT, VerifyUser, UserInfo

urlpatterns = [
    path('register/', RegisterView.as_view(), name='create-room'),
    path('login/', LoginView.as_view(), name='login'),
    path('test/', TestJWT.as_view(), name='test'),
    path('verify/', VerifyUser.as_view(), name='verify'),
    path('info/', UserInfo.as_view(), name='info')
]  