import React from 'react'
import { getRooms } from '../api/rooms'
function RoomLists() {
  const [Lists, setLists] = useState('')
  const roomList=(e)=>{
    e.preventDefault()
    getRooms()
    .then((res)=>{setLists(res.data)
      localStorage.setLists(res.data)
    })
    .theb((res)=>console.log(res.data)
    )
    .catch((err)=>{
      console.log(err)
    })
    
  }

  return (
    <div>
{RoomLists}
{Lists}

    </div>
  )
}

export default RoomLists
