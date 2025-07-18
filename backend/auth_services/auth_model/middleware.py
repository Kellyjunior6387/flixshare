from django.http import JsonResponse
from rest_framework.authentication import get_authorization_header
from .utlis import verify_jwt  # Import the verify_jwt function
from rest_framework.authentication import BaseAuthentication

class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        auth_header = get_authorization_header(request).split()
        if len(auth_header) == 2:
            token = auth_header[1].decode("utf-8")
            user_id = verify_jwt(token)
            if user_id:
                request.user_id = user_id  # Attach user_id to request
            else:
                return JsonResponse({"error": "Unauthorized"}, status=401)
        else:
            return JsonResponse({"error": "Missing or invalid token"}, status=401)

        return self.get_response(request)
