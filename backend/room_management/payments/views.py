import requests
import base64
import json
from datetime import datetime
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import Transaction
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.generics import ListAPIView
from .serializers import TransactionSerializer
from room.models import Room, RoomMember
import uuid


class MpesaSTKPushView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        phone = request.data.get("phone_number")
        amount = request.data.get("amount")
        room = request.data.get("room")

        if not phone or not amount or not room:
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        # Step 1: Generate Access Token
        data_to_encode = f"{settings.MPESA_CONSUMER_KEY}:{settings.MPESA_CONSUMER_SECRET}"
        encoded_data = base64.b64encode(data_to_encode.encode()).decode()
        token_response = requests.request("GET", 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', 
                                          headers = { 'Authorization': f'Basic {encoded_data}' })
        access_token = token_response.json().get("access_token")
       
         # Step 2: Prepare STK Push Payload
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password_str = f"{settings.MPESA_SHORTCODE}{settings.MPESA_PASSKEY}{timestamp}"
        password = base64.b64encode(password_str.encode()).decode()
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        payload = {
            "BusinessShortCode": settings.MPESA_SHORTCODE,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone,
            "PartyB": settings.MPESA_SHORTCODE,
            "PhoneNumber": phone,
            "CallBackURL": settings.MPESA_CALLBACK_URL,
            "AccountReference": f"room_{room}",
            "TransactionDesc": f"Payment for room {room}"
        }

        stk_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        response = requests.post(stk_url, headers = headers, json = payload)


        return Response(response.json(), status=response.status_code)
@method_decorator(csrf_exempt, name='dispatch')
class MpesaCallbackView(APIView):
    authentication_classes = [] 
    permission_classes=[AllowAny]
    def post(self, request):
        if request.method != "POST":
            return Response({"error":"Only POST allowed"}, status=405)
        try:
            data = json.loads(request.body)
            stk_callback = data.get("Body", {}).get("stkCallback", {})

            result_code = stk_callback.get("ResultCode")
            result_desc = stk_callback.get("ResultDesc")
            metadata = stk_callback.get("CallbackMetadata", {}).get("Item", []) if result_code == 0 else []

            amount = MpesaReceiptNumber = phone_number = transaction_date = account_reference = None
            if result_code == 0:
                for item in metadata:
                    if item["Name"] == "Amount":
                        amount = item['Value']
                    elif item["Name"] == "MpesaReceiptNumber":
                        MpesaReceiptNumber = item['Value']
                    elif item['Name'] == 'PhoneNumber':
                        phone_number = item['Value']
                    elif item['Name'] == 'TransactionDate':
                        transaction_date = item['Value']
                    elif item['Name'] == 'AccountReference':
                        account_reference = item['Value']
                        
            status_value = 'successful' if result_code == 0 else 'failed'
            
            # Extract room_id from account_reference (format: "room_{room_id}")
            room_id = None
            if account_reference and account_reference.startswith('room_'):
                room_id = account_reference.replace('room_', '')
            
            # Create transaction record
            transaction = Transaction.objects.create(
                phone_number=phone_number or 'Unknown',
                amount=amount or 0,
                MpesaReceiptNumber=MpesaReceiptNumber or 'N/A',
                status=status_value,
                description=result_desc,
                timestamp=transaction_date,
                room_id=room_id
            )
            
            # Update room member payment status if payment was successful
            if result_code == 0 and room_id and phone_number:
                self.update_room_payment_status(room_id, phone_number)
            
            return Response({'message': 'Callback processed'}, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({"error":str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def update_room_payment_status(self, room_id, phone_number):
        """Update the payment status for the room member based on phone number"""
        try:
            # Get user_id from auth service using phone number
            user_id = self.get_user_id_by_phone(phone_number)
            if not user_id:
                print(f"No user found for phone number: {phone_number}")
                return
            
            # Find the room
            try:
                room = Room.objects.get(room_id=room_id)
            except Room.DoesNotExist:
                print(f"Room not found: {room_id}")
                return
            
            # Update room member payment status
            try:
                room_member = RoomMember.objects.get(room=room, user_id=user_id)
                room_member.payment_status = 'paid'
                room_member.last_payment_date = datetime.now()
                room_member.save()
                print(f"Updated payment status for user {user_id} in room {room_id}")
            except RoomMember.DoesNotExist:
                print(f"Room member not found: user {user_id} in room {room_id}")
                
        except Exception as e:
            print(f"Error updating room payment status: {e}")
    
    def get_user_id_by_phone(self, phone_number):
        """Get user_id from auth service by phone number"""
        try:
            # For now, we'll make a simple HTTP request to the auth service
            # In production, this should be properly configured with service URLs
            auth_service_url = "http://localhost:8001/auth/user-by-phone/"  # Assuming auth service runs on port 8001
            response = requests.get(f"{auth_service_url}?phone_number={phone_number}")
            if response.status_code == 200:
                data = response.json()
                return data.get('user_id')
            return None
        except Exception as e:
            print(f"Error getting user by phone: {e}")
            return None
        


class TransactionListView(ListAPIView):
    permission_classes = []
    authentication_classes = []
    queryset = Transaction.objects.all().order_by('timestamp')
    serializer_class = TransactionSerializer
    
