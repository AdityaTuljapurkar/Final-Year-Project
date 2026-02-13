import React, { useState } from 'react'
import { loginUser } from '../api/auth'


function Login() {
  const [Email, setEmail] = useState('')
  const [Password, setPassword] = useState('')
  const handelLogin = (e)=>{
    e.preventDefault();
  loginUser({
    username : Email , 
    password : Password ,
  })
  .then((res)=>{
    console.log("Tokens: " ,res.data)
    localStorage.setItem('access', res.data.access)
  })
  .catch((err)=>console.log(err))
  }
  return (
    <div className='border-2 border-amber-400 bg-black text-cyan-50'>
      <div>
        <form className='flex flex-col p-3' onSubmit={handelLogin}>
          <div className='flex justify-center'>
          <h1 className='text-[#ffc300] text-2xl items-center'>Sign in to your account</h1>
          </div>
          <ul>
            <li className='py-1'> Email:
              <input type='text' placeholder='' className='border-[#ffc300] border-b-2 hover:border-b' 
              value={Email} 
              onChange={(e)=>setEmail(e.target.value)}
              /></li>
            <li className='py-1'>Password :
              <input type='text' placeholder='' className='border-[#ffc300] border-b-2 hover:border-b'
              value={Password}
              onChange={(e)=>setPassword(e.target.value)}
              /></li>
          </ul>
          <div className='flex justify-center mt-1'>
            <button type='submit' className='border-2 bg-amber-400 align-middle  text-black py-1.5 px-3 rounded-4xl hover:bg-amber-300 cursor-pointer'>submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default Login 

