from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from .models import Room
from .serializers import RoomCreateSerializer
from supertokens_python.recipe.session.framework.django.syncio import verify_session
import uuid

#@method_decorator(verify_session(), name='dispatch')
class CreateRoomView(APIView):
    @method_decorator(verify_session())
    def post(self, request):
        print("Received data:", request.COOKIES)  # Debug print
        
        # Convert service_type to service for serializer
        data = request.data.copy()
        verify_session()(request)  # Verify session from access token
        #print(request.supertokens.get_user_id())  # Extract user_id

        serializer = RoomCreateSerializer(data=data)
        if serializer.is_valid():
            try:
                room = serializer.save(owner_id=str(uuid.uuid4()))
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        print("Validation errors:", serializer.errors)  # Debug print
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)