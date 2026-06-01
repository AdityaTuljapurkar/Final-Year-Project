# backend/backend_app/views.py
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from deep_translator import GoogleTranslator
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
from langdetect import detect
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_room_password(request,room_id):
    room = get_object_or_404(Room , pk = room_id)
    typed_password = request.data.get("password","")

    #this function already exists in models.py 
    if room.verfy_password(typed_password):
        #if it returns true 
        return Response({"detail":"The room password is coreect "},status=status.HTTP_200_OK)
        # if it is return false  
    else: 
        return Response({"detail":"Entered Wrong room password"},status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_file_message(request):
    room_id = request.data.get('room')
    if not room_id:
        return Response({"detail": "room id required"}, status=status.HTTP_400_BAD_REQUEST)
    
    room = get_object_or_404(Room, pk=room_id)
    
    # We use the serializer to save the message
    # Note: message_content might be encrypted text or empty
    serializer = Message_seralizer(data=request.data)
    if serializer.is_valid():
        # Manual save to associate room and sender
        message = serializer.save(
            room=room,
            sender=request.user,
            message_content=request.data.get('message_content', '')
        )
        
        # Broadcast to WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"chat_{room_id}",
            {
                "type": "chat_message",
                "message": message.message_content,
                "sender_name": request.user.username,
                "iv": message.iv,
                "is_encrypted": message.is_encrypted,
                "file_url": message.file.url if message.file else None,
                "file_name": message.file_name,
                "file_type": message.file_type,
            }
        )
        
        return Response(Message_seralizer(message).data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@csrf_exempt
def translate_message(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            raw_text = data.get('text', '')
            target_lang = data.get('target_lang', 'en')
            
            # --- NEW: THE AI POLISHER ---
            # Capitalize the first letter and ensure it has punctuation
            text = raw_text.strip()
            if not text:
                return JsonResponse({'translated_text': ''}, status=200)

            text = text[0].upper() + text[1:]
            if text[-1] not in ".!?":
                text += "."
            # ----------------------------

            # 1. AUTO-DETECT THE SOURCE LANGUAGE
            try:
                source_lang = detect(text) 
            except:
                source_lang = 'en'
            
            # 2. Bypass if they are already the same language!
            if source_lang == target_lang:
                return JsonResponse({'translated_text': raw_text}, status=200)
            
            # 3. Dynamic Translation via deep-translator (Google)
            translated_text = GoogleTranslator(source=source_lang, target=target_lang).translate(text)
            
            # (Optional) Strip the artificial period if we added one, to keep UI clean
            if raw_text and raw_text[-1] not in ".!?" and translated_text.endswith("."):
                translated_text = translated_text[:-1]

            return JsonResponse({'translated_text': translated_text}, status=200)
            
        except Exception as e:
            print(f"Translation Error: {e}") 
            return JsonResponse({'error': str(e)}, status=400)
            
    return JsonResponse({'error': 'Invalid request'}, status=400)