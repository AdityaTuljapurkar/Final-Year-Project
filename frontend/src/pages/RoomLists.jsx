import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router"; 
import { getRooms } from "../api/rooms";

export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
      navigate(`/room/${room.id}`,{state:{roomName : room.name}});
    }
  }

  // Real-time filtering logic
  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full bg-teal-800 dark:bg-transparent text-white dark:text-obsidian-text relative transition-colors duration-300 flex flex-col">
      <div className="p-4 border-b border-teal-600 dark:border-obsidian-border bg-teal-900 dark:bg-black/20">
        <h2 className="text-xl font-bold mb-3">Rooms</h2>
        <div className="relative">
          <input 
            type="text"
            placeholder="Search rooms..."
            className="w-full bg-teal-700/50 dark:bg-white/5 border border-teal-600 dark:border-obsidian-border rounded-lg px-4 py-2 outline-none focus:border-cyan-400 dark:focus:border-teal-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <li
              key={room.id}
              onClick={() => handelRoomClick(room)}
              className="p-4 border-b border-teal-700 dark:border-obsidian-border cursor-pointer hover:bg-teal-600 dark:hover:bg-white/5 flex justify-between items-center transition-colors"
            >
              <div className="font-semibold">{room.name}</div>
              {room.has_password && <span>🔒</span>}
            </li>
          ))
        ) : (
          <li className="p-8 text-center text-teal-300/50 dark:text-obsidian-secondary italic">
            {searchTerm ? "No rooms match your search" : "No rooms available"}
          </li>
        )}
      </ul>
    </div>
  )
}