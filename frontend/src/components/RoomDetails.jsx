import React, { useEffect, useState } from 'react'
import { getRoomDetails } from "../api/rooms"
function RoomDetails({open ,room_id}) {
  // const [room_id, setRoom_id] = useState('')
  const [roomdata, setdata] = useState('')

  useEffect(() => {
    getRoomDetails(room_id).then((res)=>{
      console.log(res.data);
      setdata(res.data)
    }).catch((err)=>{
      console.log('The error in the Room info : ',err );
    })
  }, [open , room_id])
  
  
  return (
<div className="m-0 p-0">
  <div className="flex flex-col bg-black/60 p-5 rounded-xl text-pink-200 shadow-md w-fit mt-0">
    <ul className="space-y-3 text-sm m-0 p-0">
      <li className="flex gap-2">
        <span className="font-semibold text-pink-300">Room Name:</span>
        <span>{roomdata.name}</span>
      </li>

      <li className="flex gap-2">
        <span className="font-semibold text-pink-300">Created at:</span>
        <span>
          {new Date(roomdata.created_at).toLocaleString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })}
        </span>
      </li>
    </ul>
  </div>
</div>
  )
}

export default RoomDetails
