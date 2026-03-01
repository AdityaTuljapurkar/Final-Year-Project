import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router"; // You can remove this if unused
import RoomDetails from "../pages/RoomDetails";
import { useLocation } from "react-router";
import userNameContext from "./myContext";
import roomNameContext from "../context/RoomName";
import { getRoomDetails } from "../api/rooms"; 

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

  useEffect(() => {
    if (popUp && room_id) {
      getRoomDetails(room_id)
        .then((res) => {
          setButtonName(res.data.name || res.data.room_name);
        })
        .catch((err) => {
          console.log("Header fetch error:", err);
          setButtonName("Room " + room_id);
        });
    }
  }, [popUp, room_id]); 

  return (
    <div className="bg-gray-800 text-[#ffff] flex justify-between items-center w-screen py-2 px-4 font-bold border-b border-gray-700">
      
      {/* LEFT SIDE: Logo and Room Button */}
      <div className="flex gap-4 items-center">
        <h2 className="text-lg px-2 font-medium">Logo</h2> 
        
        {popUp && (
          <div className="relative">
            <button 
              onClick={handelToggle}
              className="text-[#ffc300] bg-transparent px-4 py-1 rounded-full hover:bg-gray-900 cursor-pointer"
            >
              {buttonName}
            </button> 
            
            {/* Dropdown popup (Adjusted to left-0 so it anchors to the button) */}
            {toggleInfo && (
              <div className=" absolute top-12 left-0 z-50">
                <RoomDetails room_id={room_id} open={popUp}></RoomDetails>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT SIDE: User Name */}
      <div className="pr-4">
        <h3 className="text-sm text-gray-400 font-normal mt-1"> 
          user: <span className="text-white">{userName_main || "Guest"}</span> 
        </h3>
      </div>

    </div>
  );
}