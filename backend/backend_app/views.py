# backend/backend_app/views.py
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from .models import *
from .seralizers import * 
from rest_framework_simplejwt.tokens import RefreshToken
from django.http.response import HttpResponse

@permission_classes([AllowAny])
def home(request):
    return HttpResponse("<h1>This is the backend </h1> " , status = status.HTTP_200_OK)
    

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
 
    serializer = User_seralizer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()   

        refresh = RefreshToken.for_user(user)
        return Response(
            {

                'user': User_seralizer(user).data,
                'access': str(refresh.access_token),

                'refresh': str(refresh),
            },
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_rooms(request):
    rooms = Room.objects.all()

    serializer = Room_seralizer(rooms, many=True)

    return Response(serializer.data)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_rooms(request):

    serializer = Room_seralizer(data=request.data)
    if serializer.is_valid():

        room = serializer.save(owner=request.user)
        return Response(Room_seralizer(room).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_message(request):
    room_id = request.query_params.get('room_id')
    if not room_id:
        return Response({"detail": "room_id query parameter required"}, status=status.HTTP_400_BAD_REQUEST)


    room = get_object_or_404(Room, pk=room_id)
    messages = Message.objects.filter(room=room)
    serializer = Message_seralizer(messages, many=True)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def room_serailizer(request, room_id):

    room = get_object_or_404(Room, pk=room_id)
    serializer = Room_seralizer(room)
    return Response(serializer.data)


