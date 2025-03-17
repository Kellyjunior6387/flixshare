from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from supertokens_python.recipe.multitenancy.syncio import list_all_tenants


from django.http import JsonResponse

from supertokens_python.recipe.session.framework.django.syncio import verify_session
from supertokens_python.syncio import list_users_by_account_info, get_user


class UsersAPI(APIView):
    @method_decorator(verify_session())
    def get(self, request, format=None):
        user_info = get_user(request.supertokens.get_user_id()).to_json()                                    
        return JsonResponse({
            "status": "OK",
            "users": user_info,
        })
class TenantsAPI(APIView):
    def get(self, request, format=None):
        tenantReponse = list_all_tenants()

        tenantsList = []

        for tenant in tenantReponse.tenants:
            tenantsList.append(tenant.to_json())

        return JsonResponse({
            "status": "OK",
            "tenants": tenantsList,
        })
class SessionInfoAPI(APIView):
    @method_decorator(verify_session())
    def get(self, request, format=None):
        session_ = request.supertokens
        return JsonResponse(
            {
                "sessionHandle": session_.get_handle(),
                "userId": session_.get_user_id(),
                "accessTokenPayload": session_.get_access_token_payload(),
            }
        )