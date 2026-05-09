import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router";
import RoomDetails from "./RoomDetails";
import userNameContext from "./myContext";
import roomNameContext from "../context/RoomName";
import { getRoomDetails } from "../api/rooms"; 
import profilePhoto from "../icons/profile.png";

// NEW: Import the Context
import { LanguageContext } from "./LanguageContext.jsx"; 

export default function Header() {
  const [toggleInfo, setToggleInfo] = useState(false);
  const handelToggle = () => (setToggleInfo((prev) => !prev));
  
  const Location = useLocation();  
  const path = Location.pathname.split('/');
  const popUp = path[1] === 'room';
  const room_id = path[2];

  const { userName_main } = useContext(userNameContext);
  const { roomname } = useContext(roomNameContext);
  const [buttonName, setButtonName] = useState(roomname || "Loading...");

  // NEW: Language State
  const { userLanguage, setUserLanguage } = useContext(LanguageContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'hi', label: 'Hindi' },
  ];

  useEffect(() => {
    if (popUp && room_id) {
      getRoomDetails(room_id)
        .then((res) => setButtonName(res.data.name || res.data.room_name))
        .catch((err) => {
          console.log("Header fetch error:", err);
          setButtonName("Room " + room_id);
        });
    }
  }, [popUp, room_id]); 

  return (
    <div className="bg-gray-800 text-[#ffff] flex justify-between items-center w-screen py-2 px-4 font-bold border-b border-gray-700">
      
      <div className="flex gap-4 items-center">
        <h2 className="text-lg px-2 font-medium">Logo</h2> 
        {popUp && (
          <div className="relative">
            <button onClick={handelToggle} className="text-[#ffc300] bg-transparent px-4 py-1 rounded-full hover:bg-gray-900 cursor-pointer">
              {buttonName}
            </button> 
            {toggleInfo && (
              <div className="absolute top-12 left-0 z-50">
                <RoomDetails room_id={room_id} open={popUp}></RoomDetails>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative pr-4 flex items-center gap-3">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 focus:outline-none cursor-pointer hover:opacity-80 transition-opacity text-left bg-transparent border-none"
        >
          <img src={profilePhoto} alt="User profile" className="h-9 w-9 rounded-full object-cover ring-2 ring-transparent hover:ring-teal-500 transition-all" />
          <h3 className="text-sm text-gray-400 font-normal mt-1 m-0">
            user: <span className="text-white">{userName_main || "Guest"}</span>
            <span className="ml-2 text-[10px] bg-teal-900 text-[#ffc300] px-1.5 py-0.5 rounded font-bold uppercase">{userLanguage || "EN"}</span>
          </h3>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full right-4 mt-2 w-48 bg-gray-900 rounded-md shadow-lg border border-teal-700 z-50 overflow-hidden">
            <div className="py-1">
              <p className="px-4 py-2 text-xs text-teal-400 uppercase tracking-wider font-bold border-b border-teal-800 m-0">Translate Chat To:</p>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setUserLanguage(lang.code);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-teal-800 transition-colors cursor-pointer border-none block ${userLanguage === lang.code ? 'text-[#ffc300] font-bold bg-teal-900' : 'text-gray-300 bg-transparent'}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
