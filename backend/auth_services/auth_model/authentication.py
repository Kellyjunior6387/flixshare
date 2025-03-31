import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from uuid import UUID

User = get_user_model()

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith('Bearer '):
            print('No token was provided')
            raise AuthenticationFailed('Invalid token')
         # No token provided

        token = auth_header.split(' ')[1]

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
            try:
                user_uuid = UUID(user_id)
            except ValueError:
                raise AuthenticationFailed('Invalid user ID format')
            # Retrieve user from the database
            user = User.objects.filter(unique_id=user_uuid).first()
            print(user)
            if not user:
                raise AuthenticationFailed('User not found')
            return (user, None)  # Authenticated user
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')
