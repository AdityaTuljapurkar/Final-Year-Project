import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import RoomsSidebar from './components/RoomSidebar';
import Header from './components/Header';
import Register from './pages/Register';
import Login from './pages/Login';
import RoomDetails from './components/RoomDetails';
import CreateRoom from './pages/CreateRoom';
import VerifyRoom from './pages/VerifyRoom';
import Feedback from './pages/Feedback';
import userNameContext from './components/myContext';
import roomNameContext from './context/RoomName';
import Room from './pages/Room';

// Providers
import { LanguageProvider } from "./components/LanguageContext.jsx";
import { ThemeProvider } from "./components/ThemeContext.jsx";

export default function App() {
  const [room_Toggel, setroom_Toggel] = useState(false);
  const [userName_main, setUserName_main] = useState(localStorage.getItem('username') || '');
  const [roomname, setRoom_name] = useState('');

  return (
    <ThemeProvider>
      <LanguageProvider>
        <roomNameContext.Provider value={{ roomname, setRoom_name }} >
          <userNameContext.Provider value={{ userName_main, setUserName_main }}>
            <div className="flex h-screen overflow-hidden bg-gray-400 dark:bg-obsidian-bg transition-colors duration-300">
              <Navbar onToggleRoom={() => setroom_Toggel(!room_Toggel)} />
              <RoomsSidebar open={room_Toggel} />

              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="border-2 dark:border-obsidian-border flex items-center shrink-0">
                  <Header /> 
                </div>

                <div className="flex-1 flex border-2 dark:border-obsidian-border bg-[#37353E] dark:bg-obsidian-bg overflow-y-auto p-4 transition-colors duration-300">
                  <div className="w-full h-full p-3 ml-3.5 mt-0 mr-8">
                    <Routes>
                      <Route path="/Register" element={<Register />} />
                      <Route path="/Login" element={<Login />} />
                      <Route path="/room_details" element={<RoomDetails />} />
                      <Route path="/create_room" element={<CreateRoom />} />
                      <Route path="/verify_room/:roomId" element={<VerifyRoom />} />
                      <Route path="/room/:roomId" element={<Room />} />
                      <Route path="/feedback" element={<Feedback />} />
                    </Routes>
                  </div>
                </div>
              </div>    
            </div>
          </userNameContext.Provider>
        </roomNameContext.Provider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
