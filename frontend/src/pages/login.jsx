import React from 'react'

function Register() {
  return (
    <div className='border-2 border-amber-400 bg-black text-cyan-50'>
      <div>
        <form className='flex flex-col p-3'>
          <div className='flex justify-center'>
          <h1 className='text-[#ffc300] text-2xl items-center'></h1>
          </div>
          <ul>
            <li className='py-1'> Name :
              <input type='text' placeholder='' className='border-[#ffc300] border-b-2 hover:border-b' /></li>
            <li className='py-1'> Email:
              <input type='text' placeholder='' className='border-[#ffc300] border-b-2 hover:border-b' /></li>
            <li className='py-1'>Password :
              <input type='text' placeholder='' className='border-[#ffc300] border-b-2 hover:border-b' /></li>
            <li className='py-1'> Conform Password :
              <input type='text' placeholder='' className='border-[#ffc300] border-b-2 hover:border-b' /></li>
          </ul>
          <div className='flex justify-center mt-1'>
            <button type='submit' className='border-2 bg-amber-400 align-middle  text-black py-1.5 px-3 rounded-4xl hover:bg-amber-300 cursor-pointer'>submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
