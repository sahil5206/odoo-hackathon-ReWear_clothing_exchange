import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, X, User } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';

const ChatSystem = ({ isOpen, onClose, swapData }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { socket, isConnected, user } = useSocket();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket || !isConnected || !swapData) return;

    // Join swap chat room
    socket.emit('join-swap-chat', {
      swapId: swapData.id,
      participants: [swapData.fromUserId, swapData.toUserId]
    });

    // Listen for new messages
    socket.on('swap-message', (messageData) => {
      if (messageData.swapId === swapData.id) {
        setMessages(prev => [...prev, messageData]);
      }
    });

    // Listen for typing indicators
    socket.on('swap-typing', (typingData) => {
      if (typingData.swapId === swapData.id && typingData.userId !== user?._id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    return () => {
      socket.emit('leave-swap-chat', swapData.id);
      socket.off('swap-message');
      socket.off('swap-typing');
    };
  }, [socket, isConnected, swapData, user]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socket || !swapData) return;

    const messageData = {
      swapId: swapData.id,
      senderId: user?._id,
      senderName: user ? `${user.firstName} ${user.lastName}` : 'Anonymous',
      message: newMessage.trim(),
      timestamp: new Date()
    };

    socket.emit('swap-message', messageData);
    setNewMessage('');
  };

  const handleTyping = () => {
    if (socket && swapData) {
      socket.emit('swap-typing', {
        swapId: swapData.id,
        userId: user?._id
      });
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-2xl border border-earth-200 z-[9997]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-earth-200 bg-earth-50 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-primary-600" />
            <div>
              <h3 className="font-semibold text-earth-900">Swap Chat</h3>
              <p className="text-xs text-earth-600">
                {swapData?.itemTitle || 'Item Discussion'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-earth-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-earth-600" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 h-64 overflow-y-auto space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-8 h-8 text-earth-400 mx-auto mb-2" />
              <p className="text-sm text-earth-600">No messages yet</p>
              <p className="text-xs text-earth-500">Start the conversation!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs px-3 py-2 rounded-lg ${
                  message.senderId === user?._id
                    ? 'bg-primary-600 text-white'
                    : 'bg-earth-100 text-earth-900'
                }`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <User className="w-3 h-3" />
                    <span className="text-xs font-medium">
                      {message.senderName}
                    </span>
                  </div>
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.senderId === user?._id ? 'text-primary-100' : 'text-earth-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))
          )}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-earth-100 text-earth-900 px-3 py-2 rounded-lg">
                <p className="text-sm text-earth-600">Typing...</p>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-earth-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                } else {
                  handleTyping();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 input-field text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="btn-primary p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatSystem; 