import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  ArrowLeft, 
  User, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  Image as ImageIcon,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import apiService from '../services/api';
import toast from 'react-hot-toast';

const SwapChatPage = () => {
  const { swapId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [swapDetails, setSwapDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [swapStatus, setSwapStatus] = useState('pending'); // pending, accepted, declined, completed

  // Demo swap details
  const demoSwapDetails = {
    id: swapId,
    item: {
      id: 1,
      title: "Vintage Denim Jacket",
      image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=300&h=300&fit=crop",
      points: 150,
      condition: "Excellent",
      size: "M"
    },
    requester: {
      id: 2,
      name: "Sarah Johnson",
      avatar: null
    },
    owner: {
      id: 1,
      name: "Mike Chen",
      avatar: null
    },
    status: "pending",
    createdAt: "2024-01-15T10:30:00Z",
    message: "I love this jacket! Would you be interested in swapping for my vintage leather jacket?"
  };

  // Demo messages
  const demoMessages = [
    {
      id: 1,
      senderId: 2,
      senderName: "Sarah Johnson",
      content: "Hi! I'm interested in your vintage denim jacket. Would you like to see what I have to offer?",
      timestamp: "2024-01-15T10:30:00Z",
      type: "text"
    },
    {
      id: 2,
      senderId: 1,
      senderName: "Mike Chen",
      content: "Hi Sarah! Thanks for your interest. I'd love to see what you have. Can you share some photos?",
      timestamp: "2024-01-15T10:32:00Z",
      type: "text"
    },
    {
      id: 3,
      senderId: 2,
      senderName: "Sarah Johnson",
      content: "Absolutely! Here are some photos of my vintage leather jacket. It's in excellent condition.",
      timestamp: "2024-01-15T10:35:00Z",
      type: "text"
    },
    {
      id: 4,
      senderId: 2,
      senderName: "Sarah Johnson",
      content: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop",
      timestamp: "2024-01-15T10:36:00Z",
      type: "image"
    },
    {
      id: 5,
      senderId: 1,
      senderName: "Mike Chen",
      content: "Wow, that's a beautiful jacket! I'm definitely interested. When would you like to meet up?",
      timestamp: "2024-01-15T10:38:00Z",
      type: "text"
    }
  ];

  useEffect(() => {
    // Load swap details and messages
    loadSwapData();
    
    // Join chat room
    if (socket && isConnected) {
      socket.emit('join-swap-chat', swapId);
      
      // Listen for new messages
      socket.on('new-message', (message) => {
        setMessages(prev => [...prev, message]);
      });
      
      // Listen for typing indicators
      socket.on('user-typing', (data) => {
        if (data.userId !== user?.id) {
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 3000);
        }
      });
      
      // Listen for swap status updates
      socket.on('swap-status-updated', (data) => {
        setSwapStatus(data.status);
        toast.success(`Swap ${data.status}!`);
      });
    }

    return () => {
      if (socket) {
        socket.emit('leave-swap-chat', swapId);
        socket.off('new-message');
        socket.off('user-typing');
        socket.off('swap-status-updated');
      }
    };
  }, [socket, isConnected, swapId]);

  const loadSwapData = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSwapDetails(demoSwapDetails);
      setMessages(demoMessages);
      setSwapStatus(demoSwapDetails.status);
      
    } catch (error) {
      toast.error('Failed to load chat data');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      id: Date.now(),
      senderId: user?.id,
      senderName: user?.firstName + ' ' + user?.lastName,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    try {
      // Send message via API
      await apiService.sendSwapMessage(swapId, messageData.content);
      
      // Add message to local state
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');
      
      // Emit typing stop
      if (socket) {
        socket.emit('stop-typing', { swapId, userId: user?.id });
      }
      
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleTyping = () => {
    if (socket) {
      socket.emit('typing', { swapId, userId: user?.id });
    }
  };

  const handleSwapAction = async (action) => {
    try {
      await apiService.updateSwapStatus(swapId, action);
      setSwapStatus(action);
      
      const actionMessage = {
        id: Date.now(),
        senderId: 'system',
        senderName: 'System',
        content: `Swap ${action} by ${user?.firstName} ${user?.lastName}`,
        timestamp: new Date().toISOString(),
        type: 'system'
      };
      
      setMessages(prev => [...prev, actionMessage]);
      toast.success(`Swap ${action}!`);
      
    } catch (error) {
      toast.error(`Failed to ${action} swap`);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload logic here
      toast.success('Image uploaded successfully!');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isOwnMessage = (message) => {
    return message.senderId === user?.id;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600 mx-auto mb-4"></div>
          <p className="text-navy-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-50">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-navy-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-navy-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-navy-600" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-navy-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-navy-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-navy-900">Swap Request</h2>
                  <p className="text-sm text-navy-600">{swapDetails?.item.title}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                swapStatus === 'accepted' ? 'bg-green-100 text-green-800' :
                swapStatus === 'declined' ? 'bg-red-100 text-red-800' :
                swapStatus === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {swapStatus.charAt(0).toUpperCase() + swapStatus.slice(1)}
              </span>
              
              {swapStatus === 'pending' && user?.id === swapDetails?.owner.id && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSwapAction('accepted')}
                    className="btn-primary text-sm px-3 py-1"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleSwapAction('declined')}
                    className="btn-outline text-sm px-3 py-1"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${
                  isOwnMessage(message) ? 'order-2' : 'order-1'
                }`}>
                  {message.type === 'system' ? (
                    <div className="text-center">
                      <div className="inline-block bg-navy-100 text-navy-700 px-4 py-2 rounded-lg text-sm">
                        {message.content}
                      </div>
                    </div>
                  ) : (
                    <div className={`flex ${isOwnMessage(message) ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isOwnMessage(message) ? 'bg-navy-600' : 'bg-accent-600'
                      }`}>
                        <User className="w-4 h-4 text-white" />
                      </div>
                      
                      <div className={`${
                        isOwnMessage(message) 
                          ? 'bg-navy-600 text-white' 
                          : 'bg-white border border-navy-200 text-navy-900'
                      } rounded-lg px-4 py-2 shadow-sm`}>
                        {message.type === 'image' ? (
                          <img 
                            src={message.content} 
                            alt="Shared image" 
                            className="rounded-lg max-w-full"
                          />
                        ) : (
                          <p className="text-sm">{message.content}</p>
                        )}
                        <p className={`text-xs mt-1 ${
                          isOwnMessage(message) ? 'text-navy-200' : 'text-navy-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-navy-200 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-navy-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-navy-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-navy-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-navy-200 p-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAttachments(!showAttachments)}
              className="p-2 hover:bg-navy-50 rounded-lg transition-colors"
            >
              <Paperclip className="w-5 h-5 text-navy-600" />
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="w-full px-4 py-2 border border-navy-200 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              />
              
              {showAttachments && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full left-0 mb-2 bg-white border border-navy-200 rounded-lg shadow-lg p-2"
                >
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 px-3 py-2 hover:bg-navy-50 rounded-lg text-sm"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Image</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </motion.div>
              )}
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapChatPage; 