import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_URL } from '../api/client';

export default function useSocket() {
  const socketRef = useRef(null);
  const [onlineUserIds, setOnlineUserIds] = useState([]);
  const [typingFrom, setTypingFrom] = useState(null);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      const socket = io(SERVER_URL, { auth: { token } });
      socketRef.current = socket;

      socket.on('presence:update', ({ onlineUserIds }) => setOnlineUserIds(onlineUserIds));
      socket.on('typing:start', ({ from }) => setTypingFrom(from));
      socket.on('typing:stop', ({ from }) => setTypingFrom((prev) => (prev === from ? null : prev)));

      return () => socket.disconnect();
    })();
  }, []);

  return { socket: socketRef, onlineUserIds, typingFrom };
}
