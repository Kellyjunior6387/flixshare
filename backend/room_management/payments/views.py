import requests
import base64
import json
from datetime import datetime
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny


class MpesaSTKPushView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        phone = request.data.get("phone")
        amount = request.data.get("amount")
        room = request.data.get("room")

        if not phone or not amount or not room:
            return Response({"error": "Missing required fields"}, status=400)

        # Step 1: Generate Access Token
        data_to_encode = f"{settings.MPESA_CONSUMER_KEY}:{settings.MPESA_CONSUMER_SECRET}"
        encoded_data = base64.b64encode(data_to_encode.encode()).decode()
        token_response = requests.request("GET", 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', 
                                          headers = { 'Authorization': f'Basic {encoded_data}' })
        access_token = token_response.json().get("access_token")
        print(access_token)
        print('Step 1 done')

        # Step 2: Prepare STK Push Payload
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        print(settings.MPESA_SHORTCODE, settings.MPESA_PASSKEY)

        password_str = f"{settings.MPESA_SHORTCODE}{settings.MPESA_PASSKEY}{timestamp}"
        print(password_str)
        password = base64.b64encode(password_str.encode()).decode()
        print(password)
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
            "TransactionDesc": "Payment of"+ room
        }

        stk_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        response = requests.post(stk_url, headers = headers, json = payload)


        return Response(response.json(), status=response.status_code)
