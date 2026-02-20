import React , {useState , useEffect} from "react";

import { getRooms } from "../api/rooms"

export default function RoomList(){ 
  const [rooms, setRoom] = useState([])

  useEffect(()=>{
    getRooms().then((res)=>{
      console.log('Rooms Recived : ',res.data);
      setRoom(res.data)
      
    }).catch((err)=>{
      console.log("ERROR in the data : " , err);
    })
  },[]);
  return (
    <div>
      <h2>Available Rooms</h2>
      {rooms.map((room)=>(
        <div key={room.id} className="p-2 border-b border-blue-600">
          <li>
            {room.name}
          </li>
        </div>
      ))}
    </div>
  )

}