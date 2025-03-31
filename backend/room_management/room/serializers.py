from rest_framework import serializers
from .models import Room, RoomMember

class RoomCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        # Fields provided by the client; room_id and created_at will be auto-generated.
        fields = ['service_type', 'cost', 'name', 'due_date','description']

class RoomJoinSerializer(serializers.ModelSerializer):
    room_id = serializers.CharField(write_only=True)
    class Meta:
        model = RoomMember
        fields = ['room_id']

    def validate_room_id(self, value):
        if not Room.objects.filter(room_id=value).exists():
            raise serializers.ValidationError("Room does not exist")
        user_id = self.context['request'].user.id
        if RoomMember.objects.filter(room_id=value, user_id=user_id).exists():
            raise serializers.ValidationError("User is already a member of this room")
        return value
    
    def create(self, validated_data):
        room_id = validated_data.pop('room_id')
        room = Room.objects.get(room_id=room_id)
        return RoomMember.objects.create(
            room=room,
            **validated_data
        )