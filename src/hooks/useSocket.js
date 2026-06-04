import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = (userId) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;
    socketRef.current = io(import.meta.env.VITE_API_URL);
    socketRef.current.emit('join', userId);
    return () => socketRef.current?.disconnect();
  }, [userId]);

  return socketRef;
};

export default useSocket;