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
    def save_message(self, room_id, text_content, sender_username):
        try:
            room = Room.objects.get(id=room_id)
            # Find the user or default to None if it's a Guest/Unknown user
            user = User.objects.filter(username=sender_username).first()
            return Message.objects.create(room=room, message_content=text_content, sender=user)
        except Exception as e:
            print(f"Error saving message: {e}")
            return None

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json['message']
            sender_name = text_data_json.get('sender_name', 'Guest')

            # We still broadcast even if saving fails for some reason
            await self.save_message(self.room_id, message, sender_name)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'sender_name': sender_name
                }
            )
        except Exception as e:
            print(f"WebSocket receive error: {e}")

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'content': event['message'],
            'sender_name': event['sender_name']
        }))