import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from uuid import UUID
import requests
import logging
from .cache_utils import get_user_cache, set_user_cache, is_redis_available

logger = logging.getLogger(__name__)

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
            # First, try to get user data from Redis cache
            if is_redis_available():
                cached_user_data = get_user_cache(token)
                if cached_user_data:
                    user_id = cached_user_data.get('user_id')
                    if user_id:
                        user = SimpleUser(user_id)
                        logger.info(f"User authenticated from cache: {user_id}")
                        return (user, token)
            # If not in cache or Redis is unavailable, fetch from auth service
            response = requests.get(
                'http://localhost:8000/auth/verify/',
                headers={'Authorization': f'Bearer {token}'},
                timeout=10  # Add timeout for security
            )
            
            if response.status_code == 200:
                data = response.json()
                user_id = data.get('user_id')
                if not user_id:
                    raise AuthenticationFailed('User ID not found in response')
                
                # Cache the user data for future requests
                if is_redis_available():
                    user_cache_data = {
                        'user_id': user_id,
                        'verified': True
                    }
                    # Cache for 30 minutes to balance between performance and security
                    set_user_cache(token, user_cache_data, ttl=1800)
                
                user = SimpleUser(user_id)
                logger.info(f"User authenticated from auth service: {user_id}")
                return (user, token)
            else:
                raise AuthenticationFailed('Invalid User')
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Request to auth service failed: {e}")
            raise AuthenticationFailed('Authentication service unavailable')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')
        except Exception as e:
            logger.error(f"Unexpected authentication error: {e}")
            raise AuthenticationFailed('Authentication failed')
