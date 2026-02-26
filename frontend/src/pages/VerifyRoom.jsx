import React, { useContext, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { verifyRoomPassword } from '../api/rooms';
import roomNameContext from '../context/RoomName';

function VerifyRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const roomName = location.state?.roomName || "this room";
  const {setRoom_name} = useContext(roomNameContext)
  setRoom_name(roomName)
  
  
  const [roomPassword, setRoomPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handelSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      // We pass the raw string state to our fixed api file
      const response = await verifyRoomPassword(roomId, roomPassword);
      
      if (response.status === 200) {
        console.log("Success! Entering room.");
        navigate(`/room/${roomId}`);
      }
    } catch (err) {
      console.log("Verification error:", err);
      setErrorMsg("Incorrect password. Please try again.");
    }
  }

  return (
    <div className='p-4 flex justify-center items-start pt-20 h-full w-full'>
      <div className='border-2 border-[#468A9A] p-6 rounded-lg w-full max-w-md bg-black shadow-lg shadow-teal-500/20'>
        <form className='flex flex-col' onSubmit={handelSubmit}>
          <div className='flex justify-center mb-4'>
            <h1 className='text-[#ffc300] text-xl'>Enter Password for <span className='text-[#468A9A]'>{roomName}</span></h1>
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