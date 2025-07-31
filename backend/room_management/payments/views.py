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
        token_response = requests.request("GET", 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', 
                                          headers = { 'Authorization': 'Basic eXlucWpWQU1GM0JXYnpkand3SEdkZEw2TTc1endndVh6azQzZmxhNUFXOVFnTEoxOnZHOHc4OGN0MlI2TU9GMldaaWFNYUVvWDdjOHc3cEdiY3RaNUN2S0pPaWdMMjBTYnRtc0tBdnJzQThZdXFVUmE=' })
        access_token = token_response.json().get("access_token")
        print(access_token)
        print('Step 1 done')

        # Step 2: Prepare STK Push Payload
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        print(settings.MPESA_SHORTCODE, settings.MPESA_PASSKEY)

        password_str = f"{settings.MPESA_SHORTCODE}{settings.MPESA_PASSKEY}{timestamp}"
        password = base64.b64encode(password_str.encode()).decode()
        print(password)
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        payload = {
            "BusinessShortCode": settings.MPESA_SHORTCODE,
            #TODO: Remove this hardcoded credentials
            "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjUwNzMxMTI1NDI0",
            "Timestamp": "20250731125424",
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
