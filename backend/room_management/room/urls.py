from django.urls import path
from .views import CreateRoomView, JoinRoomView

urlpatterns = [
    path('create/', CreateRoomView.as_view(), name='create-room'),
    path('join/', JoinRoomView.as_view(), name='join')
]