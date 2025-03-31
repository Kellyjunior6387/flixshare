import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from uuid import UUID
import requests

class SimpleUser:
    def __init__(self, user_id):
        self.id = user_id
        self.is_authenticated = True
        self.is_active = True

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith('Bearer '):
            raise AuthenticationFailed('Invalid token')


        token = auth_header.split(' ')[1]

        try:
            response = requests.get(
                'http://localhost:8000/auth/verify/',
                headers={'Authorization': f'Bearer {token}'}
            )
            
            if response.status_code == 200:
                data = response.json()
                user_id  = data.get('user_id')
                if not user_id:
                    raise AuthenticationFailed('User ID not found in response')
                user = SimpleUser(user_id)
                return (user, token)
            else:
                 raise AuthenticationFailed('Invalid User')
            # TODO: Retrieve user from the database
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')
