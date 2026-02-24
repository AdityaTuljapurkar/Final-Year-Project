import React from 'react';
import { useParams } from 'react-router';

function ChatRoom() {
  // useParams looks at the URL (e.g., /room/5) and grabs the "5" for us!
  const { roomId } = useParams();

  return (
    <div className='border-2 border-teal-500 bg-black text-cyan-50 w-full h-full p-4'>
      <h1 className='text-2xl text-[#ffc300]'>Welcome to Room {roomId}</h1>
      <p className='mt-4'>This is where we will build the real-time messaging interface next!</p>
    </div>
  )
}

export default ChatRoom;