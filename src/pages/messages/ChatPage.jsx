import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import ChatWindow from '../../components/ChatWindow';
import { getChatPartnersApi } from '../../api/messageApi';
import { useAuth } from '../../context/AuthContext';
import useSocket from '../../hooks/useSocket';

const ChatPage = () => {
  const { user } = useAuth();
  const [partners, setPartners] = useState([]);
  const [selected, setSelected] = useState(null);
  const socket = useSocket(user?._id);

  useEffect(() => {
    getChatPartnersApi().then(({ data }) => setPartners(data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
        <aside className="w-72 bg-white border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-800 text-lg">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {partners.length === 0
              ? <p className="text-center text-gray-400 text-sm py-8">No conversations yet.</p>
              : partners.map(p => (
                <button key={p.user._id} onClick={() => setSelected(p.user)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b text-left transition-colors ${selected?._id === p.user._id ? 'bg-sky-50' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-sky-500 flex-shrink-0 flex items-center justify-center text-white font-bold">{p.user.name?.[0]}</div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{p.user.name}</p>
                    <p className="text-gray-400 text-xs truncate">{p.lastMessage?.content}</p>
                  </div>
                </button>
              ))
            }
          </div>
        </aside>
        <div className="flex-1 flex flex-col">
          <ChatWindow partner={selected} socket={socket} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;