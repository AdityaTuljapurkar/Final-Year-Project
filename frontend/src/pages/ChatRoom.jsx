import React from 'react';
import { useParams, useLocation } from 'react-router';

function ChatRoom() {
  const { roomId } = useParams();
  const location = useLocation();
  

  const roomName = location.state?.roomName || `Room ${roomId}`;

  return (
    <div className='border-2 border-[#468A9A] bg-black text-cyan-50 w-full h-full p-4 flex flex-col'>
      {/* Display the actual room name here */}
      <h1 className='text-2xl text-[#ffc300]'>Welcome to {roomName}</h1>
      <p className='mt-4'>This is where we will build the real-time messaging interface next!</p>
    </div>
  )
}

export default ChatRoom;