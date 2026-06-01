from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # default checking of the webpage 
    path("", views.home, name="default_home"),
    
    # JWT Authentication
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Register user
    path("register/", views.register_view, name="register"),

    # Rooms
    path("rooms/", views.get_rooms, name="get_rooms"),
    path("rooms/create/", views.create_rooms, name="create_rooms"),
    path("rooms/<int:room_id>/", views.room_serailizer, name="room_detail"),
    path('rooms/<int:room_id>/verify/', views.verify_room_password, name="room_verify"),
    
    # Messages 
    path("messages/", views.get_message, name="get_message"),
    path("messages/upload/", views.upload_file_message, name="upload_message"),

    # NEW: The Translation Endpoint!
    path("translate/", views.translate_message, name="translate_message"),
]