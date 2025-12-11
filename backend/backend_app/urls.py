from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    
    #defakult checking of the webpage 
    path("",views.home , name = "default_home"),
    # JWT Authentication
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Register user (your view is register_view)
    path("register/", views.register_view, name="register"),

    # Rooms
    path("rooms/", views.get_rooms, name="get_rooms"),
    path("rooms/create/", views.create_rooms, name="create_rooms"),

    # Room detail (your view is room_serailizer)
    path("rooms/<int:room_id>/", views.room_serailizer, name="room_detail"),

    # Messages (your get_message reads ?room_id=)
    # Keep this route if you want query-param style: GET /messages/?room_id=1
    path("messages/", views.get_message, name="get_message"),
]
