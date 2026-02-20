import React, { useState } from 'react'
import { loginUser } from '../api/auth'

import { data, useNavigate } from 'react-router'
function Login() {
  const [Username, setUsername] = useState('')
  const [Password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const handelLogin = (e)=>{
    e.preventDefault();
  loginUser({
    username : Username , 
    password : Password ,
  })
  .then((res)=>{
    console.log("Tokens: " ,res.data)
    localStorage.setItem('access', res.data.access)
    localStorage.setItem('refresh',res.data.refresh)
    navigate('/')
  })
  .catch((err)=>{console.log("The backends error : ",err.response.data)
    setError(err.response.data.detail)
  } , 
)
  }
  return (
    <div className='border-2 border-amber-400 bg-black text-cyan-50'>
      <div>
        <form className='flex flex-col p-3' onSubmit={handelLogin}>
          <div className='flex justify-center'>
          <h1 className='text-[#ffc300] text-2xl items-center'>Sign in to your account</h1>
          </div>
          <ul>
            <li className='py-1'> Username:
              <input type='text' placeholder='' className='border-[#ffc300] border-b-2 hover:border-b' 
              value={Username} 
              onChange={(e)=>setUsername(e.target.value)}
              /></li>
            <li className='py-1'>Password :
              <input type='password' placeholder='' className='border-[#ffc300] border-b-2 hover:border-b'
              value={Password}
              onChange={(e)=>setPassword(e.target.value)}
              /></li>
              {error &&(
                <p className='text-red-500 text-sm text-center'>
                  {error}
                </p>
              )}
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

