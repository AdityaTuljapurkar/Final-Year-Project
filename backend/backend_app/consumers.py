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
        room = Room.objects.get(id=room_id)
        user = User.objects.get(username=sender_username)
        return Message.objects.create(room=room, message_content=text_content, sender=user)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        sender_name = text_data_json.get('sender_name', 'Guest')

        await self.save_message(self.room_id, message, sender_name)

        # Just broadcast the message instantly!
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender_name': sender_name
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'content': event['message'],
            'sender_name': event['sender_name']
        }))