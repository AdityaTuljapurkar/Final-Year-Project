# backend/backend_app/admin.py
from django.contrib import admin
from .models import Room, Message


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "owner", "created_at")
    search_fields = ("name", "owner__username")
    list_filter = ("created_at",)  # optional improvement
    ordering = ("created_at",)    # matches model Meta ordering


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("id", "room", "sender", "timestamp", "short_message")
    search_fields = ("sender__username", "room__name", "message_content")
    list_filter = ("timestamp", "room")  # optional improvement
    ordering = ("timestamp",)

    def short_message(self, obj):
        return (obj.message_content[:30] + "…") if len(obj.message_content) > 30 else obj.message_content

    short_message.short_description = "Message Preview"
    