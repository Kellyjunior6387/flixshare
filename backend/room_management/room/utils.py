import requests

def get_owner_username(owner_id, token):
        try:
            response = requests.get(
                'http://localhost:8000/auth/info/',
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