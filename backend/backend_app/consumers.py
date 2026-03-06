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

        # Join the room's communication group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the room group when the user closes the page
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # --- UPDATED DATABASE SAVING FUNCTION ---
    @database_sync_to_async
    def save_message(self, room_id, text_content, sender_username):
        try:
            room = Room.objects.get(id=room_id)
            # Find the actual User object using the username string from React
            user = User.objects.get(username=sender_username)
            
            # Use exact field names from models.py: 'message_content' and 'sender'
            return Message.objects.create(
                room=room, 
                message_content=text_content, 
                sender=user
            )
        except User.DoesNotExist:
            print(f"Failed to save: User '{sender_username}' does not exist in the DB.")
            return None
        except Exception as e:
            print(f"Error saving message to SQLite: {e}")
            return None

    # Receive message from React
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        sender_name = text_data_json.get('sender_name', 'Guest')

        # 1. Save the message to SQLite permanently
        await self.save_message(self.room_id, message, sender_name)

        # 2. Broadcast the message to everyone in the room instantly
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender_name': sender_name
            }
        )

    # Push the message back to React
    async def chat_message(self, event):
        # We send 'content' back because that is what your React UI maps to currently
        await self.send(text_data=json.dumps({
            'content': event['message'],
            'sender_name': event['sender_name']
        }))