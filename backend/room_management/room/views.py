from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from supertokens_python.recipe.session.framework.django.syncio import verify_session
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from .models import Room
from .serializers import RoomCreateSerializer


class CreateRoomView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    @method_decorator(verify_session())
    def perform_create(self, serializer, request):
        serializer.save(owner_id=str(request.supertokens.get_user_id()))
