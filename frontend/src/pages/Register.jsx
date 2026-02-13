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
      })
      .catch((err) => {
        console.log(err)
      })
 
      .finally(() => {
        setMessage("")
        setValid(true)
      })
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
              Email:
              {/* not wired earlier, kept same pattern */}
              <input
                type='text'
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
                
                              {!valid && (
                                <p className='text-red-500 text-sm'>{message}</p>
                              )}

            <li className='py-1'>
              Conform Password :
              <input
                type='password'
                value={conformPassword}
                onChange={(e) => setConformPassword(e.target.value)}
                className='border-[#ffc300] border-b-2 bg-transparent'
              />
            </li>

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
