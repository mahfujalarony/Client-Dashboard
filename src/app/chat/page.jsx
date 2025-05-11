"use client";
import { useState, useEffect, useRef } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! How can I help you today?", sender: "support", timestamp: new Date().toLocaleTimeString() },
    { id: 2, text: "I'm having issues with my account", sender: "user", timestamp: new Date().toLocaleTimeString() },
    { id: 3, text: "I'm sorry to hear that. Could you provide more details about the issue?", sender: "support", timestamp: new Date().toLocaleTimeString() },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, message]);
    setNewMessage("");

    setTimeout(() => {
      const autoReply = {
        id: messages.length + 2,
        text: "Thanks for your message! We're looking into it.",
        sender: "support",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, autoReply]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col p-2 md:p-4 bg-gray-100">
      <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col max-w-4xl w-full mx-auto">
        <h2 className="text-xl font-semibold p-4 text-center border-b">Support Chat</h2>
        
        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs md:max-w-md lg:max-w-lg ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p className="break-words">{msg.text}</p>
                <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <div className="border-t p-2 md:p-4 bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border rounded-lg p-2 md:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition whitespace-nowrap"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}