import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import { getMessages } from '../api/message';
import userNameContext from '../components/myContext';

export default function Room() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  
  // Grab the username to send along with the message
  const { userName_main } = useContext(userNameContext);

  useEffect(() => {
    // 1. Fetch old messages first (Now formatted correctly by the serializer!)
    getMessages(roomId)
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {
        console.log("Error fetching messages:", err);
      });

    // 2. Open the WebSocket connection
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomId}/`);
    
    ws.onopen = () => console.log("Connected to the chat room!");
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Instantly add the incoming message to the screen
      setMessages((prev) => [...prev, data]);
    };

    setSocket(ws);

    // Clean up the connection when leaving the room
    return () => {
      ws.close();
    };
  }, [roomId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    // Send the message through the WebSocket
    socket.send(JSON.stringify({
      message: newMessage,
      sender_name: userName_main || "Guest"
    }));
    
    setNewMessage(""); 
  };

  return (
    <div className="flex flex-col h-full bg-teal-900/70 text-white w-full rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 ? (
          <p className="text-center text-teal-400 mt-10">No messages yet. Be the first to say hi!</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="bg-teal-900 p-3 rounded-lg w-fit max-w-[70%] shadow-md">
              <span className="text-xs text-[#ffc300] font-bold block mb-1">
                {/* Both HTTP and WebSocket now provide sender_name */}
                {msg.sender_name || "User"}
              </span>
              {/* Both HTTP and WebSocket now provide content */}
              <p className="text-sm">{msg.content}</p>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-gray-900 border-t border-teal-700">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-transparent border border-teal-600 rounded-full px-4 py-2 text-white outline-none focus:border-[#ffc300]"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className="bg-[#ffc300] text-black font-bold px-6 py-2 rounded-full hover:bg-amber-300 cursor-pointer transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}