from rest_framework import serializers
from .models import Room

class RoomCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        # Fields provided by the client; room_id and created_at will be auto-generated.
        fields = ['service_type', 'cost', 'name', 'due_date','description']
