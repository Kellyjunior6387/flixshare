from django.urls import path
from .views import (
    RegisterView, LoginView, TestJWT, VerifyUser, UserInfo, UserByPhoneView, 
    UpdatePhoneNumberView, UpdatePasswordView, SendSignupOTPView, VerifySignupOTPView,
    SendResetOTPView, VerifyResetOTPView, ResetPasswordView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='create-room'),
    path('login/', LoginView.as_view(), name='login'),
    path('test/', TestJWT.as_view(), name='test'),
    path('verify/', VerifyUser.as_view(), name='verify'),
    path('info/', UserInfo.as_view(), name='info'),
    path('user-by-phone/', UserByPhoneView.as_view(), name='user-by-phone'),
    path('profile/phone/', UpdatePhoneNumberView.as_view(), name='update-phone'),
    path('profile/password/', UpdatePasswordView.as_view(), name='update-password'),
    
    # OTP endpoints
    path('send-signup-otp/', SendSignupOTPView.as_view(), name='send-signup-otp'),
    path('verify-signup-otp/', VerifySignupOTPView.as_view(), name='verify-signup-otp'),
    path('send-reset-otp/', SendResetOTPView.as_view(), name='send-reset-otp'),
    path('verify-reset-otp/', VerifyResetOTPView.as_view(), name='verify-reset-otp'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
]  