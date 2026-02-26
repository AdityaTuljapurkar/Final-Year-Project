import React , {useState} from "react";
import { Link } from "react-router";
import RoomDetails from "../pages/RoomDetails";
import { useLocation } from "react-router";
import userNameContext from "./myContext";
import { useContext } from "react";
import roomNameContext from "../context/RoomName";



export default function Header() {
  const [toggleInfo, setToggleInfo] = useState(false)
  const handelToggle = () => (setToggleInfo((prev)=>!prev))
  const Location = useLocation()  
  // const [popUp, setPopUp] = useState(false)
  const path = Location.pathname.split('/')
  // const [room_id, setRoom_id] = useState('')
  const popUp = path[1]==='room'
  const room_id = path[2]
const { userName_main } = useContext(userNameContext)
const {roomname} = useContext(roomNameContext)

  

  

  return (
    <div className="bg-gray-800 text-[#ffff]  w-screen py-2 font-bold ">
      <h2 className="text-lg px-2 font-medium">Logo</h2> 
      <h3> user : {userName_main || "Guest"} </h3>
      {
       popUp && (
        <div>
          <button onClick={handelToggle}>
          {roomname}
          </button> 
          {toggleInfo && (<RoomDetails  room_id={room_id} open={popUp}></RoomDetails>)}
          
           </div>
       )
      }

    </div>
  );
}