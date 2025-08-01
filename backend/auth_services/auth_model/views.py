from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User
from .utlis import generate_jwt, verify_jwt
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status

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

        return Response({"message": "User registered successfully",
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
                         'username': request.user.username},
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