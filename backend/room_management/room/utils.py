import requests
import os
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

import os

class ServiceConfig:
    AUTH_SERVICE = {
        'name': 'auth-service',
        'base_url': os.getenv('AUTH_BACKEND_URL', 'http://localhost:8000'),
        'timeout': 10
    }

    ROOM_SERVICE = {
        'name': 'room-service',
        'base_url': os.getenv('ROOM_BACKEND_URL', 'http://localhost:8080'),
        'timeout': 10
    }

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


class ServiceClient:
    def __init__(self, service_name: str, base_url: str, timeout: int = 10, max_retries: int = 3):
        self.service_name = service_name
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
        
        # Configure retry strategy
        retry_strategy = Retry(
            total=max_retries,
            backoff_factor=0.5,
            status_forcelist=[500, 502, 503, 504],
        )
        
        self.session = requests.Session()
        self.session.mount("http://", HTTPAdapter(max_retries=retry_strategy))
        self.session.mount("https://", HTTPAdapter(max_retries=retry_strategy))

    def _make_request(self, method: str, endpoint: str, **kwargs) -> Dict[Any, Any]:
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        try:
            response = self.session.request(
                method=method,
                url=url,
                timeout=self.timeout,
                **kwargs
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Request to {self.service_name} failed: {str(e)}")
            raise

    def get(self, endpoint: str, **kwargs) -> Dict[Any, Any]:
        return self._make_request('GET', endpoint, **kwargs)

    def post(self, endpoint: str, **kwargs) -> Dict[Any, Any]:
        return self._make_request('POST', endpoint, **kwargs)
