import redis
from django.conf import settings
import json
from .models import PaymentIntent

redis_client = redis.StrictRedis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB,
    decode_responses=True,
    encoding='utf-8'
)

def set_payment_intent(merchant_request_id, data, ttl=3600):
    "Store data as JSON with expiration"
    redis_client.setex(f"payment_intent:{merchant_request_id}", ttl, json.dumps(data))

def get_payment_intent(merchant_request_id):
    "Retrieve JSON and convert back to dict"
    try:
        value = redis_client.get(f"payment_intent:{merchant_request_id}")
        if value:
            return json.loads(value)
    except redis.exceptions.RedisError as e:
        print(f"Redis error: {e}")

    # 🔁 Fallback to DB
    try:
        intent = PaymentIntent.objects.get(merchant_request_id=merchant_request_id)
        return {
            "user_id": str(intent.user_id),
            "room_id": str(intent.room_id),
            "phone_number": intent.phone_number
        }
    except PaymentIntent.DoesNotExist:
        return None