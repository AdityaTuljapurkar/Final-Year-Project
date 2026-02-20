import React , {useState} from "react";
import { Link } from "react-router";
import RoomDetails from "../pages/RoomDetails";


export default function Header() {
  const [toggleInfo, setToggleInfo] = useState(false)
  const handelToggle = () => (setToggleInfo((prev)=>!prev))

  return (
    <div className="bg-gray-800 text-[#ffff] flex w-screen py-2 font-bold ">
      <h2 className="text-lg px-2 font-medium">Logo</h2>
      <div><RoomDetails open = {toggleInfo} /></div>

    </div>
  );
}