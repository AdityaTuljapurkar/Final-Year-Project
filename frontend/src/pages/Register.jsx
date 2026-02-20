import React, { useState } from 'react'
// ❌ useState was missing earlier. React does not auto-import hooks.

import { registerUser } from "../api/auth"

function Register() {

  // state declarations are fine, names kept as-is
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [conformPassword, setConformPassword] = useState("")
  const [valid, setValid] = useState(true)
  const [message, setMessage] = useState("")

  const handelRegister = (e) => {
    e.preventDefault()

    if (password !== conformPassword) {
      setValid(false)
      setMessage("your password doesn't match")
      return
    }



    registerUser({
      username: username,
      password: password,
    })
      .then((res) => {
        console.log(res.data)
        localStorage.setItem("user", JSON.stringify(res.data))
        setMessage("Registration sucessful !")
        setValid(true)
      })
      .catch((err) => {
        if(err.response.data.password){ 
          setMessage(err.response.data.password[0]);
        }
        else if (err.response.data.username){
          setMessage(err.response.data.username[0]);
        }
        else {
          setMessage('Something went wrong !')
        }
        setValid(false)
      })
.then((res)=>{
  console.log('Sucess : ', res.data);
  localStorage.setItem('access', res.data.access)
  localStorage.setItem('refresh',res.data.refresh)
  setMessage("registration is sucessful !")
  setValid(true)
})
      // .finally(() => {
      //   setMessage("")
      //   setValid(true)
      // })
  }

  return (
    <div className='border-2 border-amber-400 bg-black text-cyan-50'>
      <div>

        <form className='flex flex-col p-3' onSubmit={handelRegister}>

          <div className='flex justify-center'>
            <h1 className='text-[#ffc300] text-2xl'>
              Register Your Account
            </h1>
           </div>
           <h3 className='text-cyan-400'>NOTE : If the user ID or Password is lost it cant be recovered</h3>

          <ul>

            <li className='py-1'>
              Name :

              <input
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='border-[#ffc300] border-b-2 bg-transparent'
              />
            </li>

            <li className='py-1'>
              Password :
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='border-[#ffc300] border-b-2 bg-transparent'
              />
            </li>


            <li className='py-1'>
              Conform Password :
              <input
                type='password'
                value={conformPassword}
                onChange={(e) => setConformPassword(e.target.value)}
                className='border-[#ffc300] border-b-2 bg-transparent'
                />
            </li>

                {!valid && (
                  <p className='text-red-500 text-sm'>{message}</p>
                )}
          </ul>

          <div className='flex justify-center mt-1'>
            <button
              type='submit'
              className='border-2 bg-amber-400 text-black py-1.5 px-3 rounded-4xl hover:bg-amber-300 cursor-pointer'
            >
              submit
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Register
