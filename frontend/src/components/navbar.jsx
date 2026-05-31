import React from "react";
import { Link } from "react-router-dom";
import RoomList from "../pages/RoomLists"
import room from "../icons/round-table.png"
import AI from "../icons/generative copy.png"
import feedback from "../icons/feedback.png"
import register from "../icons/add.png"
import bedroom from '../icons/out-house_16500621.png'
import login from "../icons/5509636.png"

export default function Navbar({onToggleRoom}) {
  return (
    <div className="flex flex-col min-h-screen overflow-visible shrink-0 bg-teal-800 dark:bg-[#1A1A1A] text-amber-50 dark:text-obsidian-text border-r dark:border-obsidian-border transition-colors duration-300">
      <nav className="flex flex-col p-3 gap-3">
        {/* Rooms Toggle */}
        <div className="group relative">
          <button onClick={onToggleRoom} className="text-left px-1 py-3 rounded hover:bg-cyan-700 dark:hover:bg-white/5 cursor-pointer transition-all group/btn w-full">
            <img src={room} alt="Rooms" className="w-[35px] transition-all group-hover/btn:scale-110 group-hover/btn:icon-glow-teal" />
          </button>
          <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 dark:bg-black text-white text-[11px] rounded opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-50 translate-x-[-10px] group-hover:translate-x-0 shadow-2xl border border-white/10 dark:border-obsidian-border font-medium">
            Rooms
          </span>
        </div>

        {/* AI Chatbot */}
        {/* <div className="group relative">
          <Link to={"/AI"} className="block text-left px-1 py-3 rounded cursor-pointer transition-all group/btn">
            <img src={AI} alt="AI" className="w-[35px] transition-all group-hover/btn:scale-110 group-hover/btn:icon-glow-teal" />
          </Link>
          <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 dark:bg-black text-white text-[11px] rounded opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-50 translate-x-[-10px] group-hover:translate-x-0 shadow-2xl border border-white/10 dark:border-obsidian-border font-medium">
            AI Assistant
          </span>
        </div> */}

        {/* Feedback */}
        <div className="group relative">
          <Link to={"/feedback"} className="block text-left px-1 py-3 rounded cursor-pointer transition-all group/btn">
            <img src={feedback} alt="Feedback" className="w-[35px] transition-all group-hover/btn:scale-110 group-hover/btn:icon-glow-teal" />
          </Link>
          <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 dark:bg-black text-white text-[11px] rounded opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-50 translate-x-[-10px] group-hover:translate-x-0 shadow-2xl border border-white/10 dark:border-obsidian-border font-medium">
            Feedback
          </span>
        </div>
      </nav>

      <footer className="mt-auto flex flex-col gap-3 p-3">
        {/* Create Room */}
        <div className="group relative">
          <Link to={'/create_room'} className="block group/btn transition-all">
            <img src={bedroom} alt="Create" className="w-[35px] transition-all group-hover/btn:scale-110 group-hover/btn:icon-glow-teal" />
          </Link>
          <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 dark:bg-black text-white text-[11px] rounded opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-50 translate-x-[-10px] group-hover:translate-x-0 shadow-2xl border border-white/10 dark:border-obsidian-border font-medium">
            Create Room
          </span>
        </div>

        {/* Register */}
        <div className="group relative">
          <Link to={"/Register"} className="block group/btn transition-all">
            <img src={register} alt="Register" className="w-[35px] transition-all group-hover/btn:scale-110 group-hover/btn:icon-glow-teal" />
          </Link>
          <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 dark:bg-black text-white text-[11px] rounded opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-50 translate-x-[-10px] group-hover:translate-x-0 shadow-2xl border border-white/10 dark:border-obsidian-border font-medium">
            Register
          </span>
        </div>

        {/* Login */}
        <div className="group relative">
          <Link to={'/Login'} className="block group/btn transition-all">
            <img src={login} alt="Login" className="w-[35px] transition-all group-hover/btn:scale-110 group-hover/btn:icon-glow-teal" />
          </Link>
          <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 dark:bg-black text-white text-[11px] rounded opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-50 translate-x-[-10px] group-hover:translate-x-0 shadow-2xl border border-white/10 dark:border-obsidian-border font-medium">
            Login
          </span>
        </div>
      </footer>
    </div>
  );
}
