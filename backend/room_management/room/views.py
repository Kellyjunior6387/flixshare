from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Room, RoomMember
from .serializers import RoomCreateSerializer, RoomJoinSerializer
from rest_framework.permissions import IsAuthenticated
from django.db import transaction


class CreateRoomView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        data = request.data.copy()
        serializer = RoomCreateSerializer(data=data)
        if serializer.is_valid():
            try:
                owner_id = request.user.id
                room = serializer.save(owner_id=owner_id)
                RoomMember.objects.create(
                    room=room,
                    user_id=owner_id,
                    role='owner',
                    payment_status='paid'  # Owner is automatically marked as paid
                )
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

class JoinRoomView(APIView):
    permission_classes = [IsAuthenticated]
    @transaction.atomic
    def post(self, request):
        serializer = RoomJoinSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            try:
                user_id = request.user.id
                room_member = serializer.save(user_id=user_id,role='member',payment_status='pending')
                return Response({
                    'message': 'Successfully joined room',
                    'room_id': str(room_member.room_id),
                    'role': room_member.role,
                    'payment_status': room_member.payment_status
                }, status=status.HTTP_201_CREATED)
            
            except Exception as e:
                print(e)
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)