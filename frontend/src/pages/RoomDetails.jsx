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
    <div>
      {/* {getData} */}
      <div className='flex border-red-500 border-2  flex-col'>
        <ul>
          <li>
            Room Name : {roomdata.name}
          </li>
          <li>
            BirthDay : {roomdata.created_at}
          </li>
        </ul>
      </div>
    </div>
  )
}

export default RoomDetails
