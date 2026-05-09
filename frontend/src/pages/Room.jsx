import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router';
import { getMessages } from '../api/message';
import userNameContext from '../components/myContext';
import { LanguageContext } from '../components/LanguageContext.jsx'; 

export default function Room() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  
  // NEW: State to hold translated texts and loading status
  const [translations, setTranslations] = useState({}); 
  const [translatingIndex, setTranslatingIndex] = useState(null);

  const messagesEndRef = useRef(null);
  const { userName_main } = useContext(userNameContext);
  const { userLanguage } = useContext(LanguageContext); // The language from your Header

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    getMessages(roomId).then((res) => setMessages(res.data));

    // Simple WebSocket connection (no more lang parameters!)
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomId}/`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };
    setSocket(ws);
    return () => ws.close();
  }, [roomId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.send(JSON.stringify({
      message: newMessage,
      sender_name: userName_main || "Guest"
    }));
    setNewMessage(""); 
  };

  // NEW: The function that runs when you click "See translation"
  const handleTranslateClick = async (index, text) => {
    setTranslatingIndex(index); // Show loading state
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/translate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text, target_lang: userLanguage })
      });
      
      const data = await response.json();
      // Save the translated text into our state object using the message index
      if (data.translated_text) {
        setTranslations(prev => ({ ...prev, [index]: data.translated_text }));
      }
    } catch (error) {
      console.error("Translation failed:", error);
    }
    
    setTranslatingIndex(null); // Remove loading state
  };

  return (
    <div className="flex flex-col h-full bg-teal-900/70 text-white w-full rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((msg, index) => (
          <div key={index} className="bg-teal-900 p-3 rounded-lg w-fit max-w-[70%] shadow-md">
            <span className="text-xs text-[#ffc300] font-bold block mb-1">
              {msg.sender_name || "User"}
            </span>
            
            {/* The Original Message */}
            <p className="text-sm">{msg.content}</p>
            
            {/* Instagram Style: "See translation" Button */}
            {!translations[index] && (
              <button 
                onClick={() => handleTranslateClick(index, msg.content)}
                className="text-[11px] text-gray-400 font-semibold mt-1 hover:text-white transition-colors cursor-pointer block text-left"
              >
                {translatingIndex === index ? "Translating..." : "See translation"}
              </button>
            )}

            {/* The Translated Message (Reveals after clicking) */}
            {translations[index] && (
              <div className="mt-2 pt-2 border-t border-teal-700/50">
                <p className="text-sm font-medium text-teal-200">{translations[index]}</p>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-900 border-t border-teal-700">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-transparent border border-teal-600 rounded-full px-4 py-2 text-white outline-none focus:border-[#ffc300]"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="bg-[#ffc300] text-black font-bold px-6 py-2 rounded-full cursor-pointer">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
