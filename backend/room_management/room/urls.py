from django.urls import path
from .views import (
    CreateRoomView, 
    JoinRoomView, 
    ListUserRoomsView, 
    RoomDetailView,
    LeaveRoomView,
    DeleteRoomView,
    RemoveMemberView
)

urlpatterns = [
    path('create/', CreateRoomView.as_view(), name='create-room'),
    path('join/', JoinRoomView.as_view(), name='join'),
    path('list/', ListUserRoomsView.as_view(), name='list'),
    path('<uuid:room_id>/', RoomDetailView.as_view(), name='room-detail'),
    path('<uuid:room_id>/leave/', LeaveRoomView.as_view(), name='leave-room'),
    path('<uuid:room_id>/delete/', DeleteRoomView.as_view(), name='delete-room'),
    path('<uuid:room_id>/remove-member/', RemoveMemberView.as_view(), name='remove-member'),
]