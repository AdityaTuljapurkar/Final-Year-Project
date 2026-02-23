import React, { useState, useEffect } from "react";
import { getRooms } from "../api/rooms"

export default function RoomList() {
  const [rooms, setRooms] = useState([]) // Changed to setRooms
  const [showPopup, setShowPopup] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [roomPassword, setRoomPassword] = useState("")

  useEffect(() => {
    getRooms().then((res) => {
      console.log('Rooms Received : ', res.data);
      setRooms(res.data) // Changed to setRooms
    }).catch((err) => {
      console.log("ERROR in the data : ", err);
    })
  }, []);

  const handelRoomClick = (room) => {
    if (room.has_password) {
      setSelectedRoom(room)
      setShowPopup(true)
    } else {
      console.log("Entering unlocked room: ", room.name);
    }
  }

  const handelPopupSubmit = (e) => {
    e.preventDefault(); // Fixed spelling and changed comma to semicolon
    console.log(`Trying to enter the room ${selectedRoom.name} with password ${roomPassword} `);
    setRoomPassword('')
    setShowPopup(false)
  }

  return (
    <div className="w-full h-full bg-teal-800 text-white relative">
      <h2 className="p-4 text-xl font-bold border-b border-teal-600 bg-teal-900">Chats</h2>
      <ul>
        {/* Fixed: changed room.map to rooms.map */}
        {rooms.map((room) => (
          <li
            key={room.id}
            onClick={() => handelRoomClick(room)} // Fixed: added 'room' inside the parentheses
            className="p-4 border-b border-teal-700 cursor-pointer hover:bg-teal-600 flex justify-between items-center"
          >
            <div className="font-semibold">{room.name}</div>
            {room.has_password && <span>🔒</span>}
          </li>
        ))}
      </ul>
      
      {showPopup && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="bg-teal-900 border-2 border-[#468A9A] p-4 rounded-lg w-full max-w-sm">
            <h3 className="text-[#468A9A] text-lg font-bold mb-2">
              {selectedRoom?.name}
            </h3>
            <form onSubmit={handelPopupSubmit} className="flex flex-col gap-3">
              {/* Fixed: Input is now self-closing! */}
              <input
                type="password"
                placeholder="Enter password"
                className="border-b-2 border-[#468A9A] bg-transparent text-white p-1 outline-none"
                value={roomPassword}
                onChange={(e) => setRoomPassword(e.target.value)}
                autoFocus
              />
              
              <div className="flex justify-between mt-2">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#468A9A] text-black px-4 py-1 rounded hover:bg-teal-400"
                >
                  Enter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}