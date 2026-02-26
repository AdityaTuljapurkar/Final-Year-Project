import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router"; 
import { getRooms } from "../api/rooms";

export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    getRooms().then((res) => {
      setRooms(res.data);
    }).catch((err) => {
      console.log("ERROR in the data : ", err);
    });
  }, []);

  const handelRoomClick = (room) => {
    if (room.has_password) {

      // We also pass the room's name in the "state" so the next page knows it.
      navigate(`/verify_room/${room.id}`, { state: { roomName: room.name } });
    } else {
      // If no password, go straight to the room
      navigate(`/room/${room.id}`);
    }
  }

  return (
    <div className="w-full h-full bg-teal-800 text-white relative">
      <h2 className="p-4 text-xl font-bold border-b border-teal-600 bg-teal-900">Chats</h2>
      <ul>
        {rooms.map((room) => (
          <li
            key={room.id}
            onClick={() => handelRoomClick(room)}
            className="p-4 border-b border-teal-700 cursor-pointer hover:bg-teal-600 flex justify-between items-center"
          >
            <div className="font-semibold">{room.name}</div>
            {room.has_password && <span>🔒</span>}
          </li>
        ))}
      </ul>

    </div>
  )
}