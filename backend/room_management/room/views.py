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
class ListUserRoomsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_id = request.user.id
            # Get the rooms through RoomMember
            user_room_members = RoomMember.objects.filter(user_id=user_id).select_related('room')
            
            rooms_data = []
            for member in user_room_members:
                room_data = {
                    'id': str(member.room.room_id),
                    'name': member.room.name,
                    'description': member.room.description,
                    'cost': str(member.room.cost),
                    'due_date': member.room.due_date,
                    'created_at': member.room.created_at,
                    'role': member.role,
                    'payment_status': member.payment_status,
                    'member_count': member.room.members.count()
                }
                rooms_data.append(room_data)

            return Response({
                'rooms': rooms_data,
                'total_rooms': len(rooms_data)
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error in ListUserRoomsView: {str(e)}")  # Debug print
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
           

            
