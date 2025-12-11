# backend/backend_app/models.py
from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password


class Room(models.Model):
    name = models.CharField(max_length=50, null=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rooms')
    created_at = models.DateField(default=timezone.now)
    password_hash = models.CharField( max_length=350,null=True, blank=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.name} @ (owner = {self.owner.username})"

    def create_password(self, raw_password):
        if raw_password:
            self.password_hash = make_password(raw_password)
        else:
            self.password_hash = None

    def verfy_password(self, raw_password):
        if not self.password_hash:
            return True
        else:
            return check_password(raw_password, self.password_hash)


class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages')
    message_content = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        # FIX: message_content is a string, so use len() not >
        short = (self.message_content[:20] + " ...") if len(self.message_content) > 20 else self.message_content
        return f"{self.sender.username}@{self.room.name} -> {short}"
