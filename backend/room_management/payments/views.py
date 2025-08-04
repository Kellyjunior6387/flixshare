import requests
import base64
import json
from django.utils import timezone
from datetime import datetime
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import Transaction, PaymentIntent
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.generics import ListAPIView
from .serializers import TransactionSerializer
from room.models import Room, RoomMember    
import uuid
from .utils import set_payment_intent, get_payment_intent
import logging

logger = logging.getLogger(__name__)

class MpesaSTKPushView(APIView):
    def post(self, request):
        phone = request.data.get("phone_number")
        amount = request.data.get("amount")
        room_id = request.data.get("room_id")
        user_id = request.user.id

        if not phone or not amount or not room_id:
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        # Get room name for transaction description
        room_name = "Unknown Room"
        try:
            room = Room.objects.get(room_id=room_id)
            room_name = room.name
        except Room.DoesNotExist:
            logger.warning(f"Room not found for ID: {room_id}")

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
            "AccountReference": room_name,
            "TransactionDesc": f"Payment of {room_name}"  # Updated transaction description
        }
        print(settings.MPESA_CALLBACK_URL)
        stk_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        response = requests.post(stk_url, headers = headers, json = payload)
        if response.status_code == 200:
            merchant_request_id = response.json().get('MerchantRequestID')

            #Store the details in redis with room_name
            set_payment_intent(merchant_request_id,{
                               "user_id":user_id,
                                "room_id":room_id,
                                "room_name":room_name,  # Added room_name to cache
                                "phone_number":phone})
            
            #Store the details in the DB
            PaymentIntent.objects.create(
                merchant_request_id=merchant_request_id,
                user_id=user_id,
                room_id=room_id,
                phone_number=phone
            )
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
            merchant_request_id = stk_callback.get("MerchantRequestID")
            metadata = stk_callback.get("CallbackMetadata", {}).get("Item", []) if result_code == 0 else []

            amount = MpesaReceiptNumber = phone_number = transaction_date = None
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
    
                intent = get_payment_intent(merchant_request_id)

                if not intent:
                    return Response({"error": "Unknown MerchantRequestID"}, status=404)

                user_id = intent["user_id"]
                room_id = intent["room_id"]
                room_name = intent.get("room_name", "Unknown Room")  # Get room_name from cache
                phone = intent["phone_number"]
                
                # Create transaction record
                transaction = Transaction.objects.create(
                    phone_number=phone_number or 'Unknown',
                    amount=amount or 0,
                    MpesaReceiptNumber=MpesaReceiptNumber,
                    status='successful',  # Changed back to 'successful'
                    description=result_desc,
                    room_name=room_name,  # Store room_name in transaction
                    timestamp=transaction_date,
                    room_id=room_id
                )
                
                # Update room member payment status if payment was successful
                if result_code == 0 and room_id and phone:
                    self.update_room_payment_status(room_id, user_id)
                
                return Response({'message': 'Callback processed'}, status=status.HTTP_200_OK)
            return Response({'message': 'Payment failed or Cancellled by user'}, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({"error":str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def update_room_payment_status(self, room_id, user_id):
        """Update the payment status for the room member based on phone number"""
        try:
            try:
                room = Room.objects.get(room_id=room_id)
            except Room.DoesNotExist:
                print(f"Room not found: {room_id}")
                return
            
            # Update room member payment status
            try:
                room_member = RoomMember.objects.get(room=room, user_id=user_id)
                room_member.payment_status = 'paid'
                room_member.last_payment_date = timezone.now()
                room_member.save()
                print(f"Updated payment status for user {user_id} in room {room_id}")
            except RoomMember.DoesNotExist:
                print(f"Room member not found: user {user_id} in room {room_id}")
                
        except Exception as e:
            print(f"Error updating room payment status: {e}")
        


class TransactionListView(ListAPIView):
    permission_classes = []
    authentication_classes = []
    queryset = Transaction.objects.all().order_by('timestamp')
    serializer_class = TransactionSerializer
    
