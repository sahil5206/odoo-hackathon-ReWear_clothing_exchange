import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Join user room when user is available
  useEffect(() => {
    if (socket && user && isConnected) {
      socket.emit('join-user-room', user._id);
    }
  }, [socket, user, isConnected]);

  const joinBrowseRoom = () => {
    if (socket && isConnected) {
      socket.emit('join-browse-room');
    }
  };

  const leaveBrowseRoom = () => {
    if (socket && isConnected) {
      socket.emit('leave-browse-room');
    }
  };

  const emitUserActivity = (activity) => {
    if (socket && isConnected && user) {
      socket.emit('user-activity', {
        userId: user._id,
        userName: `${user.firstName} ${user.lastName}`,
        activity
      });
    }
  };

  const value = {
    socket,
    isConnected,
    user,
    setUser,
    joinBrowseRoom,
    leaveBrowseRoom,
    emitUserActivity
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 