# backend_app/seralizers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Room, Message


class Room_seralizer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)
    password = serializers.CharField(
        write_only=True,    
        required=False,
        allow_blank=True     
    )

    class Meta:
        model = Room 
        fields = ("id", "name", "owner", "created_at", "password")
        read_only_fields = ("id", "owner", "created_at")

    def create(self, validated_data):

        password = validated_data.pop("password", None)
        
        room = Room(**validated_data)
        if password:

            room.create_password(password)
        room.save()
        return room


class Message_seralizer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ("id", "room", "sender", "message_content", "timestamp")
        read_only_fields = ("id", "room", "sender", "timestamp")


class User_seralizer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=6,
        allow_null=False
    )

    class Meta:
        model = User
        fields = ("id", "username", "email", "password")
        read_only_fields = ("id",)

    def create(self, validated_data):

        password = validated_data.pop("password")

        user = User.objects.create_user(password=password, **validated_data)
        return user
