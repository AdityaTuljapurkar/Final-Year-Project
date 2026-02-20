import React from "react";
import { Link } from "react-router";
import { Route, Router } from "react-router";
import RoomList from "../pages/RoomLists"
import room from "../icons/round-table.png"
import AI from "../icons/generative copy.png"
import feedback from "../icons/feedback.png"
import register from "../icons/add.png"
import bedroom from '../icons/out-house_16500621.png'
import { useState } from "react";
import login from "../icons/5509636.png"

export default function Navbar({onToggleRoom}) {


  return (


    <div className="flex flex-col min-h-screen overflow-hidden shrink-0 bg-teal-900 text-amber-50">
      <nav className="flex flex-col p-3 gap-3">
        <button onClick={onToggleRoom} className="text-left px-1 py-3 rounded hover:bg-cyan-700 cursor-pointer">
          <img src={room} alt="Home Logo" style={{ width: '35px' }} />
        </button >
        <Link to={"/AI"} className="text-left px-1 py-3 rounded hover:bg-cyan-700 cursor-pointer">
          <img src={AI} alt="Home Logo" style={{ width: '35px' }} /></Link >
        <Link to={"/feedback"} className="text-left px-1 py-3 rounded hover:bg-cyan-700 cursor-pointer">
          <img src={feedback} alt="Home Logo" style={{ width: '35px' }} /></Link >
        {/* <Link to={"/settings"} className="text-left px-1 py-3 rounded hover:bg-cyan-700 cursor-pointer">settings</Link > */}

      </nav>
      <footer className="mt-auto flex flex-col">
        <Link to={'/create_room'} className="p-3   ">
          <img src={bedroom} alt="create room" style={{ width: '35px' }} />
        </Link >
        <Link to={"/Register"} className="p-3   ">
          <img src={register} alt="Home Logo" style={{ width: '35px' }} /></Link >
        <Link to={'/Login'} className="p-3   ">
          <img src={login} alt="Home Logo" style={{ width: '35px' }} />
        </Link >

      </footer>
    </div>
  );
}   
