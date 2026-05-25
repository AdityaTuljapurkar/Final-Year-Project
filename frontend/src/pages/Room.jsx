import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useLocation } from 'react-router';
import { getMessages } from '../api/message';
import { getRoomDetails } from '../api/rooms';
import { deriveKeyFromPassword, encryptMessage, decryptMessage } from '../utils/crypto';
import userNameContext from '../components/myContext';
import { LanguageContext } from '../components/LanguageContext.jsx'; 

export default function Room() {
  const { roomId } = useParams();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // E2EE State
  const [roomKey, setRoomKey] = useState(null);
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  // Auto-derive key if password was passed from VerifyRoom page
  useEffect(() => {
    const passedPassword = location.state?.roomPassword;
    if (passedPassword && !roomKey) {
      deriveKeyFromPassword(passedPassword, roomId).then(key => {
        setRoomKey(key);
      });
    }
  }, [location.state, roomId]);

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
    // Check if room is encrypted
    getRoomDetails(roomId).then((res) => {
      if (res.data.has_password) {
        setIsPasswordRequired(true);
      }
    });

    const loadAndDecryptMessages = async () => {
      const res = await getMessages(roomId);
      const rawMessages = res.data;
      
      // If we have a key, decrypt the historical messages
      if (roomKey) {
        const decrypted = await Promise.all(rawMessages.map(async (msg) => {
          if (msg.is_encrypted && msg.iv) {
            const decryptedContent = await decryptMessage(msg.content, msg.iv, roomKey);
            return { ...msg, content: decryptedContent || "[Decryption Failed]" };
          }
          return msg;
        }));
        setMessages(decrypted);
      } else {
        setMessages(rawMessages);
      }
    };

    loadAndDecryptMessages();

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomId}/`);
    
    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    ws.onerror = () => setIsConnected(false);

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket Message Received:", data);
      
      let finalMessage = { ...data };
      
      // Ensure 'content' exists for the UI to render
      if (!finalMessage.content && finalMessage.message) {
        finalMessage.content = finalMessage.message;
      }

      // Decrypt if incoming message is encrypted and we have a key
      if (finalMessage.is_encrypted && finalMessage.iv && roomKey) {
        try {
          const decryptedContent = await decryptMessage(finalMessage.content, finalMessage.iv, roomKey);
          if (decryptedContent) {
            finalMessage.content = decryptedContent;
            // Update the 'message' field too for consistency with handleSendMessage
            finalMessage.message = decryptedContent;
          } else {
            finalMessage.content = "[Decryption Failed]";
          }
        } catch (err) {
          console.error("Real-time decryption error:", err);
          finalMessage.content = "[Decryption Error]";
        }
      }

      setMessages((prev) => [...prev, finalMessage]);
    };
    setSocket(ws);
    return () => ws.close();
  }, [roomId, roomKey]);

  const handleUnlockRoom = async (e) => {
    e.preventDefault();
    try {
      const key = await deriveKeyFromPassword(passwordInput, roomId);
      setRoomKey(key);
    } catch (err) {
      console.error("Encryption error:", err);
      alert("Error generating encryption key.");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || socket.readyState !== WebSocket.OPEN) return;

    let messageData = {
      message: newMessage,
      sender_name: userName_main || "Guest",
      is_encrypted: false
    };

    // If we have a key, encrypt the message!
    if (roomKey) {
      const { encryptedData, iv } = await encryptMessage(newMessage, roomKey);
      messageData.message = encryptedData;
      messageData.iv = iv;
      messageData.is_encrypted = true;
    }

    socket.send(JSON.stringify(messageData));
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
    <div className="flex flex-col h-full bg-teal-900/70 dark:bg-obsidian-bg text-white dark:text-obsidian-text w-full rounded-lg overflow-hidden transition-colors duration-300 relative">
      
      {/* Password Overlay */}
      {isPasswordRequired && !roomKey && (
        <div className="absolute inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-gray-900 border border-teal-500 p-8 rounded-2xl shadow-2xl max-w-sm w-full">
            <h2 className="text-2xl text-[#ffc300] font-bold mb-2">Encrypted Room</h2>
            <p className="mb-6 text-gray-400 text-sm">This room is protected by End-to-End Encryption. Please enter the password to unlock.</p>
            <form onSubmit={handleUnlockRoom} className="flex flex-col gap-4">
              <input 
                type="password" 
                className="bg-black/50 border border-teal-600 rounded-xl px-4 py-3 text-white outline-none focus:border-[#ffc300] transition-all"
                placeholder="Room Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
              />
              <button type="submit" className="bg-[#ffc300] text-black font-bold py-3 rounded-xl hover:bg-amber-400 transition-colors shadow-lg active:scale-95">
                Unlock Room
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Connection Status Indicator */}
      {!isConnected && (
        <div className="absolute top-0 left-0 w-full bg-red-500/80 text-[10px] text-center py-1 z-10 animate-pulse">
          Disconnected. Trying to reconnect...
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((msg, index) => (
          <div key={index} className="bg-teal-900 dark:bg-gray-900 p-3 rounded-lg w-fit max-w-[70%] shadow-md border dark:border-obsidian-border">
            <span className="text-xs text-[#ffc300] font-bold block mb-1">
              {msg.sender_name || "User"}
            </span>
            
            {/* The Original Message */}
            <p className="text-sm dark:text-obsidian-text">{msg.content}</p>
            
            {/* Instagram Style: "See translation" Button */}
            {!translations[index] && (
              <button 
                onClick={() => handleTranslateClick(index, msg.content)}
                className="text-[11px] text-gray-400 dark:text-obsidian-secondary font-semibold mt-1 hover:text-white dark:hover:text-obsidian-text transition-colors cursor-pointer block text-left"
              >
                {translatingIndex === index ? "Translating..." : "See translation"}
              </button>
            )}

            {/* The Translated Message (Reveals after clicking) */}
            {translations[index] && (
              <div className="mt-2 pt-2 border-t border-teal-700/50 dark:border-obsidian-border">
                <p className="text-sm font-medium text-teal-200 dark:text-[#ffc300]">{translations[index]}</p>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-900 dark:bg-obsidian-bg border-t border-teal-700 dark:border-obsidian-border">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-transparent border border-teal-600 dark:border-obsidian-border rounded-full px-4 py-2 text-white dark:text-obsidian-text outline-none focus:border-[#ffc300] dark:focus:border-teal-500 transition-colors disabled:opacity-50"
            placeholder={isConnected ? "Type your message..." : "Connecting..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!isConnected}
          />
          <button 
            type="submit" 
            className="bg-[#ffc300] text-black font-bold px-6 py-2 rounded-full cursor-pointer hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isConnected || !newMessage.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
