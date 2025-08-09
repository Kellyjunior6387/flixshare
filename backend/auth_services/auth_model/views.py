from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User, OTPVerification
from .utlis import generate_jwt, verify_jwt, send_email
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.utils import timezone

class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get("email")
        password = request.data.get("password")
        phone_number = request.data.get("phone_number")

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=400)

        user = User(email=email, username=username, phone_number=phone_number)
        user.set_password(password)
        user.save()

        # Send OTP for email verification
        try:
            otp_obj = OTPVerification.objects.create(
                email=email,
                purpose='signup'
            )
            send_email(
                email,
                'Welcome to FlixShare - Verify Your Email',
                f'Your verification code is: {otp_obj.otp}\n\nThis code will expire in 10 minutes.\n\nThank you for joining FlixShare!'
            )
        except Exception as e:
            print(f"Failed to send verification email: {e}")

        return Response({"message": "User registered successfully. Please check your email for verification code.",
                         "user_id": user.unique_id}, status=201)
    
class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = User.objects.filter(email=email).first()
        if not user or not user.check_password(password):
            return Response({"error": "Invalid credentials"}, status=401)
        
        # Check if email is verified
        if not user.email_verified:
            return Response({"error": "Please verify your email before logging in"}, status=401)
            
        token = generate_jwt(user.unique_id)
        return Response({"token": token})
    
class TestJWT(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({'user_id': request.user.unique_id})

class VerifyUser(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({'user_id': request.user.unique_id,
                         'username': request.user.username,
                         'email': request.user.email,
                         'phone_number': request.user.phone_number},
                        )

class UserInfo(APIView):
     permission_classes = [IsAuthenticated]
     def get(self, request):
         user_id = request.query_params.get('user_id')
         user = User.objects.filter(unique_id=user_id).first()
         if user:
            return Response({'username': user.username},status=status.HTTP_200_OK)
         else:
             return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class UserByPhoneView(APIView):
    permission_classes = [AllowAny]  # For internal service communication
    authentication_classes = []
    def get(self, request):
        phone_number = request.query_params.get('phone_number')
        if not phone_number:
            return Response({'error': 'Phone number is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.filter(phone_number=phone_number).first()
        if user:
            return Response({'user_id': str(user.unique_id), 'username': user.username}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class UpdatePhoneNumberView(APIView):
    permission_classes = [IsAuthenticated]
    
    def put(self, request):
        phone_number = request.data.get('phone_number')
        
        if not phone_number:
            return Response({'error': 'Phone number is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if phone number is already in use by another user
        if User.objects.filter(phone_number=phone_number).exclude(unique_id=request.user.unique_id).exists():
            return Response({'error': 'Phone number is already in use'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update user's phone number
        request.user.phone_number = phone_number
        request.user.save()
        
        return Response({'message': 'Phone number updated successfully'}, status=status.HTTP_200_OK)

class UpdatePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    
    def put(self, request):
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        
        if not current_password or not new_password:
            return Response({'error': 'Both current and new password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify current password
        if not request.user.check_password(current_password):
            return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate new password
        if len(new_password) < 8:
            return Response({'error': 'New password must be at least 8 characters long'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update password
        request.user.set_password(new_password)
        request.user.save()
        
        return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)

class SendSignupOTPView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if user.email_verified:
            return Response({'error': 'Email already verified'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Delete any existing OTPs for this email and purpose
        OTPVerification.objects.filter(email=email, purpose='signup').delete()
        
        # Create new OTP
        otp_obj = OTPVerification.objects.create(
            email=email,
            purpose='signup'
        )
        
        try:
            send_email(
                email,
                'FlixShare - Email Verification Code',
                f'Your verification code is: {otp_obj.otp}\n\nThis code will expire in 10 minutes.\n\nThank you for joining FlixShare!'
            )
            return Response({'message': 'OTP sent successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Failed to send OTP'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifySignupOTPView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        
        if not email or not otp:
            return Response({'error': 'Email and OTP are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        otp_obj = OTPVerification.objects.filter(
            email=email,
            otp=otp,
            purpose='signup',
            is_verified=False
        ).first()
        
        if not otp_obj:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
        
        if otp_obj.is_expired():
            return Response({'error': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Mark OTP as verified and user email as verified
        otp_obj.is_verified = True
        otp_obj.save()
        
        user.email_verified = True
        user.save()
        
        return Response({'message': 'Email verified successfully'}, status=status.HTTP_200_OK)

class SendResetOTPView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Delete any existing reset OTPs for this email
        OTPVerification.objects.filter(email=email, purpose='reset').delete()
        
        # Create new OTP
        otp_obj = OTPVerification.objects.create(
            email=email,
            purpose='reset'
        )
        
        try:
            send_email(
                email,
                'FlixShare - Password Reset Code',
                f'Your password reset code is: {otp_obj.otp}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.'
            )
            return Response({'message': 'OTP sent successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Failed to send OTP'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyResetOTPView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        
        if not email or not otp:
            return Response({'error': 'Email and OTP are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        otp_obj = OTPVerification.objects.filter(
            email=email,
            otp=otp,
            purpose='reset',
            is_verified=False
        ).first()
        
        if not otp_obj:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
        
        if otp_obj.is_expired():
            return Response({'error': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'message': 'OTP verified successfully'}, status=status.HTTP_200_OK)

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')
        
        if not email or not otp or not new_password:
            return Response({'error': 'Email, OTP, and new password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if len(new_password) < 8:
            return Response({'error': 'Password must be at least 8 characters long'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        otp_obj = OTPVerification.objects.filter(
            email=email,
            otp=otp,
            purpose='reset',
            is_verified=False
        ).first()
        
        if not otp_obj:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
        
        if otp_obj.is_expired():
            return Response({'error': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update password and mark OTP as verified
        user.set_password(new_password)
        user.save()
        
        otp_obj.is_verified = True
        otp_obj.save()
        
        return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)