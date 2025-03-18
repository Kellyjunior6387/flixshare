from django.db import models

# Create your models here.
# rooms/models.py
import uuid
from django.db import models
from django.contrib.postgres.fields import ArrayField

class Room(models.Model):
    ROOM_SERVICES = [
        ('netflix', 'Netflix'),
        ('spotify', 'Spotify'),
        ('disney+', 'Disney+'),
        ('hbomax', 'HBO Max'),
        ('youtube', 'YouTube'),
        ('appletv', 'Apple TV+'),
    ]
    
    room_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner_id = models.CharField(max_length=255) 
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    service_type = models.CharField(max_length=50, choices=ROOM_SERVICES)
    name = models.CharField(max_length=100)  # e.g., "Spotify Family Plan"
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField()  # Next billing date

    def __str__(self):
        return self.name
    
class RoomMember(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='members')
    user_id = models.CharField(max_length=255)  # Supertokens user ID for the member
    join_date = models.DateTimeField(auto_now_add=True)
    role = models.CharField(max_length=50, default='member')

    class Meta:
        unique_together = ('room', 'user_id')  # Ensure a user is not added twice to the same room

    def __str__(self):
        return f"{self.user_id} in {self.room.name}"
