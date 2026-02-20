import React, { useState } from 'react'
import { getRoomDetails } from "../api/rooms"
function RoomDetails({open}) {
  if (open == false) {return null}
  const [room_id, setRoom_id] = useState('')
  const [data, setdata] = useState('')
  const getData = (e)=>{
    e.preventDefault()
    getRoomDetails (room_id)
    .then((res)=>{
      setdata(res.data)
      console.log(res)
    })
    .catch((err)=>console.log(err))
  }
  
  return (
    <div>
      {/* {getData} */}
      <div className='flex border-red-500 border-2  flex-col'>
        <ul>
          <li>
            Room Name : {data.room_name}
          </li>
          <li>
            BirthDay : {data.created_at}
          </li>
        </ul>
      </div>
    </div>
  )
}

export default RoomDetails
