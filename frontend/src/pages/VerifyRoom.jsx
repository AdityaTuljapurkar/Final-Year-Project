import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { verifyRoomPassword } from '../api/rooms';

function VerifyRoom() {
  // useParams grabs the ID from the URL (e.g., /verify_room/3)
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // We grab the room name that we passed from RoomLists.jsx
  const roomName = location.state?.roomName || "this room";

  const [roomPassword, setRoomPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handelSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      // NOTE: We are using the "raw string" fix here so Django accepts it!
      const response = await verifyRoomPassword(roomId, roomPassword);
      
      if (response.status === 200) {
        console.log("Success! Entering room.");
        navigate(`/room/${roomId}`); // Go to the actual chat room!
      }
    } catch (err) {
      setErrorMsg("Incorrect password. Please try again.");
    }
  }

  return (
    // Styled exactly like your Login.jsx and Register.jsx wrappers
    <div className=' p-4 flex justify-center items-start pt-20'>
      <div className='border-2 border-[#468A9A] p-6 rounded-lg w-full max-w-md bg-teal-900'>
        <form className='flex flex-col' onSubmit={handelSubmit}>
          <div className='flex justify-center mb-4'>
            <h1 className='text-[#ffc300] text-xl'>Enter Password for {roomName}</h1>
          </div>
          
          <ul className='flex flex-col gap-4'>
            <li className='flex flex-col'>
              <input 
                type='password' 
                placeholder='Room Password'
                className='border-[#ffc300] border-b-2 hover:border-b bg-transparent outline-none p-1 text-white' 
                value={roomPassword} 
                onChange={(e) => setRoomPassword(e.target.value)}
                autoFocus
              />
            </li>
            
            {errorMsg && (
              <p className='text-red-400 text-sm text-center'>
                {errorMsg}
              </p>
            )}
          </ul>

          <div className='flex justify-center mt-6'>
            <button 
              type='submit' 
              className='border-2 bg-[#ffc300] text-black font-semibold py-1.5 px-6 rounded-4xl hover:bg-amber-300 cursor-pointer'
            >
              Enter Room
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VerifyRoom;