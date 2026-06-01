# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from .models import Room, Message 

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    @database_sync_to_async
    def save_message(self, room_id, text_content, sender_username, iv=None, is_encrypted=False):
        try:
            room = Room.objects.get(id=room_id)
            user = User.objects.filter(username=sender_username).first()
            return Message.objects.create(
                room=room, 
                message_content=text_content, 
                sender=user,
                iv=iv,
                is_encrypted=is_encrypted
            )
        except Exception as e:
            print(f"Error saving message: {e}")
            return None

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json['message']
            sender_name = text_data_json.get('sender_name', 'Guest')
            iv = text_data_json.get('iv', None)
            is_encrypted = text_data_json.get('is_encrypted', False)

            await self.save_message(self.room_id, message, sender_name, iv, is_encrypted)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'sender_name': sender_name,
                    'iv': iv,
                    'is_encrypted': is_encrypted
                }
            )
        except Exception as e:
            print(f"WebSocket receive error: {e}")

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'content': event['message'],
            'sender_name': event['sender_name'],
            'iv': event.get('iv'),
            'is_encrypted': event.get('is_encrypted', False),
            'file_url': event.get('file_url'),
            'file_name': event.get('file_name'),
            'file_type': event.get('file_type'),
        }))