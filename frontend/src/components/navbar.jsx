import React from "react";

export default function Navbar() {
  return (
    <div className="flex flex-col h-screen w-45 shrink-0 bg-teal-900 text-amber-50">
      <nav className="flex flex-col p-3 gap-3">
        <button className="text-left px-1 py-3 rounded hover:bg-cyan-700 cursor-pointer">Rooms</button>
        <button className="text-left px-1 py-3 rounded hover:bg-cyan-700 cursor-pointer">AI</button>
        <button className="text-left px-1 py-3 rounded hover:bg-cyan-700 cursor-pointer">feedback</button>
        <button className="text-left px-1 py-3 rounded hover:bg-cyan-700 cursor-pointer">settings</button>
      </nav>
      <footer className="border-2 mt-auto flex flex-col">
        <button className="p-3">signup</button>
      </footer>
    </div>
  );
}
