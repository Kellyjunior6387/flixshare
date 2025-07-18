from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Room, RoomMember
from .serializers import RoomCreateSerializer, RoomJoinSerializer
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .utils import get_owner_username


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
            user_id = request.user.id
            token = request.auth
            # Get the rooms through RoomMember
            user_room_members = RoomMember.objects.filter(user_id=user_id).select_related('room')
            rooms_data = []
            for member in user_room_members:
                owner_id = member.room.owner_id
                owner_username = get_owner_username(owner_id, token) if owner_id else 'unknown'
                room_data = {
                    'id': str(member.room.room_id),
                    'name': member.room.name,
                    'service': member.room.service_type,
                    'description': member.room.description,
                    'cost': str(member.room.cost),
                    'due_date': member.room.due_date,
                    'created_at': member.room.created_at,
                    'role': member.role,
                    'payment_status': member.payment_status,
                    'member_count': member.room.members.count(),
                    'owner_username': owner_username
                }
                rooms_data.append(room_data)

            return Response({
                'rooms': rooms_data,
                'total_rooms': len(rooms_data)
            }, status=status.HTTP_200_OK)

class RoomDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id):
        try:
            # Check if user is a member of the room
            user_id = request.user.id
            room_member = RoomMember.objects.filter(
                room_id=room_id,
                user_id=user_id
            ).select_related('room').first()

            if not room_member:
                return Response(
                    {"error": "You are not a member of this room"},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Get room details
            room = room_member.room
            owner_id = room.owner_id
            owner_username = get_owner_username(
                owner_id, 
                request.auth
            ) if owner_id else 'Unknown'

            # Get all members
            members = []
            for member in room.members.all():
                username = get_owner_username(member.user_id, request.auth)
                members.append({
                    'username': username,
                    'role': member.role,
                    'payment_status': member.payment_status,
                    'joined_at': member.join_date
                })

            room_data = {
                'id': str(room.room_id),
                'name': room.name,
                'service': room.service_type,
                'description': room.description,
                'cost': str(room.cost),
                'due_date': room.due_date,
                'created_at': room.created_at,
                'owner_username': owner_username,
                'user_role': room_member.role,
                'user_payment_status': room_member.payment_status,
                'members': members,
                'member_count': len(members)
            }

            return Response(room_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
       

            
