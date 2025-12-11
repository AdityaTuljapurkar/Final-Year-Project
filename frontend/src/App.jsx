import React from "react";
import Navbar from "./components/navbar";
import Header from "./components/Header";
import Register from "./pages/Register";
export default function App() {
  return (
  
    <div className="flex h-screen bg-gray-400 ">
      <Navbar/>
      <div className="">

        <div className="flex flex-1  flex-col ">
          <div className="border-2 flex items-center">
            <Header />
          </div>
          
        </div>
        {/* ----------------------------------------------- */}
        <div className="flex flex-1 border-2 bg-gray-700 h-screen flex-overflow-auto p-4">
        <div>
          <Register/>
        </div>
        </div>
      </div>
    </div>

  );
}
