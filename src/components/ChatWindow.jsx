import React, { useState, useEffect, useRef } from 'react';
import { getMessagesApi, sendMessageApi } from '../api/messageApi';
import { useAuth } from '../context/AuthContext';

const ChatWindow = ({ partner, socket }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!partner?._id) return;
    getMessagesApi(partner._id).then(({ data }) => setMessages(data));
  }, [partner]);

  useEffect(() => {
    if (!socket?.current) return;
    socket.current.on('receiveMessage', (msg) => {
      if (msg.sender === partner?._id) setMessages(prev => [...prev, msg]);
    });
    socket.current.on('typing', () => setIsTyping(true));
    socket.current.on('stopTyping', () => setIsTyping(false));
    return () => {
      socket.current?.off('receiveMessage');
      socket.current?.off('typing');
      socket.current?.off('stopTyping');
    };
  }, [socket, partner]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      const formData = new FormData();
      formData.append('receiverId', partner._id);
      formData.append('content', input);
      const { data } = await sendMessageApi(formData);
      setMessages(prev => [...prev, data]);
      socket?.current?.emit('sendMessage', { ...data, receiverId: partner._id });
      socket?.current?.emit('stopTyping', { receiverId: partner._id });
      setInput('');
    } catch {}
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    socket?.current?.emit('typing', { receiverId: partner._id });
    setTimeout(() => socket?.current?.emit('stopTyping', { receiverId: partner._id }), 1500);
  };

  if (!partner) return <div className="flex-1 flex items-center justify-center text-gray-400">Select a conversation</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold">{partner.name?.[0]}</div>
        <span className="font-semibold text-gray-800">{partner.name}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender?._id === user._id || msg.sender === user._id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${msg.sender?._id === user._id || msg.sender === user._id ? 'bg-sky-500 text-white' : 'bg-white border text-gray-800'}`}>
              {msg.content}
              <p className={`text-xs mt-1 ${msg.sender?._id === user._id || msg.sender === user._id ? 'text-sky-200' : 'text-gray-400'}`}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && <p className="text-gray-400 text-xs italic">typing...</p>}
        <div ref={bottomRef} />
      </div>
      <div className="bg-white border-t p-3 flex gap-2">
        <input
          value={input}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-sky-400"
        />
        <button onClick={handleSend} className="bg-sky-500 text-white px-4 py-2 rounded-full text-sm hover:bg-sky-600">Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;