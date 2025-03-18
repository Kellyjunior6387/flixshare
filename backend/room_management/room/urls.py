from django.urls import path
from .views import CreateRoomView

urlpatterns = [
    path('rooms/create/', CreateRoomView.as_view(), name='create-room'),
]