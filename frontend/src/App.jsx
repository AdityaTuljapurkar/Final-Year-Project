import React , {useState} from "react";
import Navbar from "./components/navbar";
import Header from "./components/Header";
import Register from "./pages/Register";
import { Routes , Route } from "react-router";
import CreateRooms from "./pages/CreateRoom";
import Login from "./pages/Login";
import RoomDetails from "./pages/RoomDetails";
import RoomsSidebar from "./components/RoomSidebar";

export default function App() {

const [room_Toggel, setroom_Toggel] = useState(false)
const dispRoom =()=>{setroom_Toggel((prev)=>!prev)}
  return (
  
    <div className="flex    min-h-screen overflow-hidden bg-gray-400 ">
      <Navbar onToggleRoom = {dispRoom}/>
        <RoomsSidebar open = {room_Toggel}/>
      <div className="">

        <div className="flex flex-1  flex-col ">
          <div className="border-2 flex items-center">
            <Header />
          </div>
        
        </div>
        {/* ----------------------------------------------- */}
        <div className="flex flex-1 border-2 bg-[#37353E] h-screen overflow-y-auto p-4">
        <div>
         < Routes>
         {/* <Route path="/RoomList" element = {<RoomsSidebar/> }   / > */}
         <Route path="/Register" element = {<Register/>}/>
         <Route path="/Login" element = {<Login/>} />
         <Route path="/room_details" element = {<RoomDetails/>}/>
         <Route path="/create_room" element ={<CreateRooms/>} />
         </Routes>
        </div>
        </div>
      </div>
    </div>

  );
}
