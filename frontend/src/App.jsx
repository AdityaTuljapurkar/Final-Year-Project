import React, { useState } from "react";
import Navbar from "./components/navbar";
import Header from "./components/Header";
import Register from "./pages/Register";
import { Routes, Route } from "react-router";
import CreateRooms from "./pages/CreateRoom";
import Login from "./pages/Login";
import RoomDetails from "./pages/RoomDetails";
import RoomsSidebar from "./components/RoomSidebar";
import ChatRoom from "./pages/ChatRoom";
import VerifyRoom from "./pages/VerifyRoom";
import userNameContext from "./components/myContext";
import roomNameContext from "./context/RoomName";

export default function App() {
  const [room_Toggel, setroom_Toggel] = useState(false);
  const [userName_main, setUserName_main] = useState(''); // This stays here
  const [roomname, setRoom_name] = useState('')

  return (
    <roomNameContext.Provider value={{roomname , setRoom_name}} >
    <userNameContext.Provider value={{ userName_main, setUserName_main }}>
      <div className="flex h-screen overflow-hidden bg-gray-400">
        <Navbar onToggleRoom={() => setroom_Toggel(!room_Toggel)} />
        <RoomsSidebar open={room_Toggel} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-2 flex items-center shrink-0">
            <Header /> {/* Now Header can access userName_main! */}
          </div>

          <div className="flex-1 flex border-2 bg-[#37353E] overflow-y-auto p-4">
            <div className="w-full h-full p-3 ml-3.5 mt-3.5 mr-8">
              <Routes>
                <Route path="/Register" element={<Register />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/room_details" element={<RoomDetails />} />
                <Route path="/create_room" element={<CreateRooms />} />
                <Route path="/room/:roomId" element={<ChatRoom />} />
                <Route path="/verify_room/:roomId" element={<VerifyRoom />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </userNameContext.Provider>
    </roomNameContext.Provider>
  );
}