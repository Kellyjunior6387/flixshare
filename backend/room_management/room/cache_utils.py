import redis
import json
from django.conf import settings
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

# Redis client for user authentication caching
redis_client = redis.StrictRedis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB,
    decode_responses=True,
    encoding='utf-8'
)

def set_user_cache(token: str, user_data: Dict[str, Any], ttl: int = 3600) -> bool:
    """
    Store user authentication data in Redis cache.
    
    Args:
        token: JWT token to use as cache key
        user_data: User data to cache (must be JSON serializable)
        ttl: Time to live in seconds (default: 1 hour)
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Create a secure cache key by hashing the token
        import hashlib
        cache_key = f"user_auth:{hashlib.sha256(token.encode()).hexdigest()[:32]}"
        
        # Add timestamp to track cache creation
        cache_data = {
            **user_data,
            '_cached_at': int(redis_client.time()[0])  # Redis server timestamp
        }
        
        redis_client.setex(cache_key, ttl, json.dumps(cache_data))
        logger.info(f"User data cached successfully for user_id: {user_data.get('user_id')}")
        return True
        
    except redis.exceptions.RedisError as e:
        logger.error(f"Redis error while caching user data: {e}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error while caching user data: {e}")
        return False

def get_user_cache(token: str) -> Optional[Dict[str, Any]]:
    """
    Retrieve user authentication data from Redis cache.
    
    Args:
        token: JWT token to use as cache key
    
    Returns:
        Dict containing user data if found, None otherwise
    """
    try:
        import hashlib
        cache_key = f"user_auth:{hashlib.sha256(token.encode()).hexdigest()[:32]}"
        
        cached_data = redis_client.get(cache_key)
        if cached_data:
            user_data = json.loads(cached_data)
            logger.info(f"User data retrieved from cache for user_id: {user_data.get('user_id')}")
            return user_data
        
        return None
        
    except redis.exceptions.RedisError as e:
        logger.error(f"Redis error while retrieving user data: {e}")
        return None
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error while retrieving user data: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error while retrieving user data: {e}")
        return None

def invalidate_user_cache(token: str) -> bool:
    """
    Remove user authentication data from Redis cache.
    
    Args:
        token: JWT token to use as cache key
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        import hashlib
        cache_key = f"user_auth:{hashlib.sha256(token.encode()).hexdigest()[:32]}"
        
        result = redis_client.delete(cache_key)
        if result:
            logger.info("User cache invalidated successfully")
        else:
            logger.info("No cache found to invalidate")
        return True
        
    except redis.exceptions.RedisError as e:
        logger.error(f"Redis error while invalidating user cache: {e}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error while invalidating user cache: {e}")
        return False

def is_redis_available() -> bool:
    """
    Check if Redis is available and responding.
    
    Returns:
        bool: True if Redis is available, False otherwise
    """
    try:
        redis_client.ping()
        return True
    except redis.exceptions.RedisError:
        return False
    except Exception:
        return False