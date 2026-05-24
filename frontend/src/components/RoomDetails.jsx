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
  <div className="flex flex-col bg-gray-900/95 dark:bg-black/90 p-5 rounded-xl text-white shadow-2xl border border-gray-700 dark:border-obsidian-border w-fit mt-0">
    <ul className="space-y-3 text-sm m-0 p-0">
      <li className="flex gap-2">
        <span className="font-semibold text-[#ffc300]">Room Name:</span>
        <span className="font-medium">{roomdata.name}</span>
      </li>

      <li className="flex gap-2">
        <span className="font-semibold text-[#ffc300]">Owner:</span>
        <span className="font-medium">{roomdata.owner}</span>
      </li>

      <li className="flex gap-2">
        <span className="font-semibold text-[#ffc300]">Created at:</span>
        <span className="text-gray-300 font-medium">
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
