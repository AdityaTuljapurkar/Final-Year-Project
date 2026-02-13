import React from 'react'

function CreateRoom() {
  return (
    <div className='border-2 border-[#468A9A] bg-black text-cyan-50'>
      <div>
        <form className='flex flex-col p-3'>
          <div className='flex justify-center'>
          <h1 className='text-[#468A9A]  text-2xl items-center'>Create Room</h1>
          </div>
          <ul>
            <li className='py-1'> Room Name:
              <input type='text' placeholder='' className='border-[#468A9A]  border-b-2 hover:border-b' /></li>
            <li className='py-1'>Password :
              <input type='text' placeholder='' className='border-[#468A9A]  border-b-2 hover:border-b' /></li>
            <li className='py-1'>comform Password :
              <input type='text' placeholder='' className='border-[#468A9A]  border-b-2 hover:border-b' /></li>
          </ul>
          <div className='flex justify-center mt-1'>
            <button type='submit' className='border-2 bg-[#468A9A]  align-middle  text-black py-1.5 px-3 rounded-4xl hover:bg-gray-500 cursor-pointer'>submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateRoom
