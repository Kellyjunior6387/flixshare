import jwt
import datetime
from django.conf import settings
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import asyncio
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


SECRET_KEY = settings.SECRET_KEY
# Create your views here.

def generate_jwt(user_id):
    payload = {
        "user_id": str(user_id),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1),
        "iat": datetime.datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_jwt(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["user_id"]
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def send_email(to_email, subject, body):
    """
    Send email using aiosmtplib (for production, configure with your email provider)
    For now, this is a placeholder that prints the email content
    """
    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list= [to_email],
            fail_silently=False
        )
        logger.info("Email sent to %s", to_email)
        # For development/testing, just print the email content
        print(f"\n=== EMAIL SENT ===")
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print(f"Body: {body}")
        print(f"==================\n")
        return True
        
    except Exception as e:
        print(f"Email sending failed: {e}")
        return False
