import requests
import os

def get_owner_username(owner_id, token):
        try:
            auth_backend_url = os.getenv("AUTH_BACKEND_URL", "http://localhost:8000")
            response = requests.get(
                f'{auth_backend_url}/auth/info/',
                headers={
                    'Authorization': f'Bearer {token}',
                },
                params={'user_id': owner_id}
            )
            if response.status_code == 200:
                owner_username = response.json().get('username')
                return owner_username
            return None
        except requests.RequestException:
            return None