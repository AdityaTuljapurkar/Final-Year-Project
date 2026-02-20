import React from 'react'
import { useNavigate } from 'react-router'
import { createRoom } from '../api/rooms'
import { useState } from 'react' 

function CreateRoom() {
  const [room_name, setRoom_name] = useState('')
  const [password, setPassword] = useState('')
  const [conformPassword, setConformPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  
  const navigate = useNavigate()
  
  const handelCreate = (e) =>{
    e.preventDefault()

    if (password !== conformPassword){
      setError(true)
      setMessage("Your passwords don't match")
      return
    }

    createRoom({
      name: room_name, 
      password: password,
    })
    .then((res)=>{
      console.log('Room: ', res.data);
      setError(false)

      setTimeout(() => {
        navigate('/')
      }, 1500);
    }).catch((err)=>{
     
      setMessage(err.response.data.name|| "Something went wrong")
      setError(true)
    })
  }

  return (
    <div className='border-2 border-[#468A9A] bg-black text-cyan-50'>
      <div>
        {/* WE ADDED onSubmit HERE! */}
        <form className='flex flex-col p-3' onSubmit={handelCreate}>
          <div className='flex justify-center'>
            <h1 className='text-[#468A9A] text-2xl items-center'>Create Room</h1>
          </div>
          <ul>
            <li className='py-1'> Room Name:
              <input 
                type='text' 
                className='border-[#468A9A] border-b-2 hover:border-b bg-transparent'
                value={room_name}
                onChange={(e) => setRoom_name(e.target.value)}
                required
              />
            </li>
            <li className='py-1'>Password (Optional):
              <input 
                type='password' 
                className='border-[#468A9A] border-b-2 hover:border-b bg-transparent'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </li>
            <li className='py-1'>Confirm Password:
              <input 
                type='password' 
                className='border-[#468A9A] border-b-2 hover:border-b bg-transparent'
                value={conformPassword}
                onChange={(e) => setConformPassword(e.target.value)}
              />
            </li>
            
            {/* TYPO FIXED HERE! */}
            {error && (
              <p className='text-red-400 text-sm text-center mt-2'>
                {message}
              </p>
            )}
          </ul>
          
          <div className='flex justify-center mt-1'>
            <button type='submit' className='border-2 bg-[#468A9A] align-middle text-black py-1.5 px-3 rounded-4xl hover:bg-gray-500 cursor-pointer'>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateRoom