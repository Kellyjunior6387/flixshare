import jwt
import datetime
from django.conf import settings
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import asyncio

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
        # For development/testing, just print the email content
        print(f"\n=== EMAIL SENT ===")
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print(f"Body: {body}")
        print(f"==================\n")
        
        # In production, replace the above with actual email sending logic:
        # message = MIMEMultipart()
        # message["From"] = settings.EMAIL_HOST_USER
        # message["To"] = to_email
        # message["Subject"] = subject
        # message.attach(MIMEText(body, "plain"))
        
        # async def send_async():
        #     await aiosmtplib.send(
        #         message,
        #         hostname=settings.EMAIL_HOST,
        #         port=settings.EMAIL_PORT,
        #         username=settings.EMAIL_HOST_USER,
        #         password=settings.EMAIL_HOST_PASSWORD,
        #         use_tls=True,
        #     )
        
        # asyncio.run(send_async())
        return True
        
    except Exception as e:
        print(f"Email sending failed: {e}")
        return False
