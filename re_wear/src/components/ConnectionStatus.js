import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';

const ConnectionStatus = () => {
  const { isConnected } = useSocket();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`fixed bottom-4 left-4 z-[9998] flex items-center space-x-2 px-3 py-2 rounded-full shadow-lg glass-effect ${
        isConnected 
          ? 'text-accent-600 border border-accent-200' 
          : 'text-red-600 border border-red-200'
      }`}
    >
      <motion.div
        animate={{ 
          scale: isConnected ? [1, 1.2, 1] : 1,
          opacity: isConnected ? [0.7, 1, 0.7] : 0.7
        }}
        transition={{ 
          duration: 2, 
          repeat: isConnected ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        {isConnected ? (
          <Wifi className="w-4 h-4" />
        ) : (
          <WifiOff className="w-4 h-4" />
        )}
      </motion.div>
      <span className="text-xs font-medium">
        {isConnected ? 'Live' : 'Offline'}
      </span>
    </motion.div>
  );
};

export default ConnectionStatus; 