# Create your models here.
# rooms/models.py
import uuid
from django.db import models

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
        return str(self.room_id)
    
class RoomMember(models.Model):
    MEMBER_ROLES = [
        ('owner', 'Owner'),
        ('member', 'Member'),
    ]

    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
    ]

    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='members', db_index=True)
    user_id = models.UUIDField(db_index=True)  # Changed to UUIDField since we're using UUIDs
    join_date = models.DateTimeField(auto_now_add=True)
    role = models.CharField(max_length=20, choices=MEMBER_ROLES, default='member')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    last_payment_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('room', 'user_id')
        indexes = [
            models.Index(fields=['user_id', 'room']),
            models.Index(fields=['payment_status']),
        ]
        db_table = 'room_members'

    def __str__(self):
        return f"{self.user_id} in {self.room.name} ({self.role})"