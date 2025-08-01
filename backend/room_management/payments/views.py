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
            "AccountReference": 'room',
            "TransactionDesc": f"Payment of {room}"
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
            Transaction.objects.create(
                phone_number=phone_number or 'Unknown',
                amount=amount or 0,
                MpesaReceiptNumber=MpesaReceiptNumber or 'N/A',
                status='SUCCESS',
                description=result_desc,
                timestamp=transaction_date
            )
            return Response({'message': 'Callback processed'}, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({"error":str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


class TransactionListView(ListAPIView):
    permission_classes = []
    authentication_classes = []
    queryset = Transaction.objects.all().order_by('timestamp')
    serializer_class = TransactionSerializer
    
