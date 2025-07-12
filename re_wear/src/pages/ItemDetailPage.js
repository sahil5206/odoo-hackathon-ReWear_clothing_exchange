import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye, RefreshCw, ShoppingBag, User, Mail, Phone, Calendar, Tag, Package, Star, Zap, ArrowLeft, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import apiService from '../services/api';
import toast from 'react-hot-toast';

const ItemDetailPage = () => {
  const { itemId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [owner, setOwner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const [swapChatId, setSwapChatId] = useState(null);

  // Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      setIsLoading(true);
      try {
        const data = await apiService.getItem(itemId);
        setItem(data.item);
        setOwner(data.owner);
        setLikes(data.item.likes || 0);
        setViews(data.item.views || 0);
        setIsLiked(data.item.isLiked || false);
      } catch (error) {
        // DEMO fallback data
        console.error('API error:', error);
        const demoItems = [
          {
            id: '1',
            title: 'Vintage Denim Jacket',
            description: 'A classic vintage denim jacket in excellent condition. Sustainable, stylish, and ready for a new home! Perfect for any casual outfit.',
            category: 'Outerwear',
            size: 'M',
            condition: 'Excellent',
            fabric: '100% Cotton',
            purchaseDate: '2023-03-15',
            images: [
              'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop'
            ],
            tags: ['vintage', 'denim', 'jacket'],
            likes: 24,
            views: 156,
            isLiked: false
          },
          {
            id: '2',
            title: 'Sustainable Cotton T-Shirt',
            description: 'Eco-friendly organic cotton t-shirt with a modern fit. Soft, breathable, and perfect for everyday wear.',
            category: 'Tops',
            size: 'L',
            condition: 'Like New',
            fabric: '100% Organic Cotton',
            purchaseDate: '2023-06-20',
            images: [
              'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop'
            ],
            tags: ['sustainable', 'organic', 'cotton'],
            likes: 18,
            views: 89,
            isLiked: false
          },
          {
            id: '3',
            title: 'Designer Silk Blouse',
            description: 'Elegant silk blouse with a sophisticated design. Perfect for professional settings or special occasions.',
            category: 'Tops',
            size: 'S',
            condition: 'Good',
            fabric: '100% Silk',
            purchaseDate: '2022-11-10',
            images: [
              'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop'
            ],
            tags: ['designer', 'silk', 'elegant'],
            likes: 32,
            views: 203,
            isLiked: false
          },
          {
            id: '4',
            title: 'Retro Wool Sweater',
            description: 'Cozy retro wool sweater with a timeless design. Warm, comfortable, and perfect for cold weather.',
            category: 'Sweaters',
            size: 'M',
            condition: 'Good',
            fabric: '80% Wool, 20% Acrylic',
            purchaseDate: '2022-12-05',
            images: [
              'https://images.unsplash.com/photo-1434389677669-e08b4c3b5dcc?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1434389677669-e08b4c3b5dcc?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1434389677669-e08b4c3b5dcc?w=400&h=400&fit=crop'
            ],
            tags: ['retro', 'wool', 'cozy'],
            likes: 15,
            views: 67,
            isLiked: false
          },
          {
            id: '5',
            title: 'Eco-Friendly Jeans',
            description: 'Sustainable denim jeans made from recycled materials. Comfortable fit with a modern silhouette.',
            category: 'Bottoms',
            size: '30x32',
            condition: 'Excellent',
            fabric: 'Recycled Denim',
            purchaseDate: '2023-01-15',
            images: [
              'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop'
            ],
            tags: ['eco-friendly', 'recycled', 'denim'],
            likes: 28,
            views: 134,
            isLiked: false
          }
        ];
        
        const demoItem = demoItems.find(item => item.id === itemId) || demoItems[0];
        const demoOwners = [
          {
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.johnson@example.com',
            phone: '+1 555-123-4567',
            avatar: null
          },
          {
            firstName: 'Michael',
            lastName: 'Chen',
            email: 'michael.chen@example.com',
            phone: '+1 555-234-5678',
            avatar: null
          },
          {
            firstName: 'Emma',
            lastName: 'Rodriguez',
            email: 'emma.rodriguez@example.com',
            phone: '+1 555-345-6789',
            avatar: null
          },
          {
            firstName: 'David',
            lastName: 'Thompson',
            email: 'david.thompson@example.com',
            phone: '+1 555-456-7890',
            avatar: null
          },
          {
            firstName: 'Lisa',
            lastName: 'Park',
            email: 'lisa.park@example.com',
            phone: '+1 555-567-8901',
            avatar: null
          }
        ];
        
        const demoOwner = demoOwners[parseInt(itemId, 10) % demoOwners.length] || demoOwners[0];
        setItem(demoItem);
        setOwner(demoOwner);
        setLikes(demoItem.likes);
        setViews(demoItem.views);
        setIsLiked(demoItem.isLiked);
        toast('Showing demo item details (API unavailable)', { icon: 'ℹ️' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchItem();
    // Real-time: emit view event
    if (socket && isConnected) {
      socket.emit('item-viewed', { itemId });
    }
  }, [itemId, socket, isConnected, navigate]);

  // Real-time updates for likes/views
  useEffect(() => {
    if (!socket) return;
    socket.on('item-likes-updated', ({ itemId: id, likes }) => {
      if (id === itemId) setLikes(likes);
    });
    socket.on('item-views-updated', ({ itemId: id, views }) => {
      if (id === itemId) setViews(views);
    });
    return () => {
      socket.off('item-likes-updated');
      socket.off('item-views-updated');
    };
  }, [socket, itemId]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like items');
      return;
    }
    try {
      setIsLiked((prev) => !prev);
      await apiService.likeItem(itemId);
      // Real-time update will come via socket
    } catch (error) {
      toast.error('Failed to like item');
    }
  };

  const handleRequestSwap = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to request swaps');
      return;
    }
    // Navigate to the swap request form
    navigate(`/swap-request/${itemId}`);
  };

  if (isLoading || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600 mx-auto mb-4"></div>
          <p className="text-navy-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-50 py-8">
      {/* Swap Success Modal */}
      <AnimatePresence>
        {swapModalOpen && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                className="absolute top-3 right-3 text-navy-400 hover:text-navy-700"
                onClick={() => setSwapModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
              <CheckCircle className="w-14 h-14 text-green-500 mb-2 animate-bounce" />
              <h2 className="text-2xl font-bold text-navy-900 mb-2">Swap Requested!</h2>
              <p className="text-navy-700 mb-4 text-center">Your request to swap for <span className="font-semibold">{item.title}</span> has been sent to <span className="font-semibold">{owner?.firstName} {owner?.lastName}</span>.</p>
              <img src={item.images[0]} alt={item.title} className="w-32 h-32 object-cover rounded-lg shadow mb-3" />
              <div className="flex flex-col items-center mb-4">
                <span className="text-navy-800 font-medium">Owner: {owner?.firstName} {owner?.lastName}</span>
                <span className="text-navy-500 text-sm">{owner?.email}</span>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  className="btn-primary flex-1"
                  onClick={() => { setSwapModalOpen(false); navigate(`/swap-chat/${swapChatId}`); }}
                >
                  Go to Swap Chat
                </button>
                <button
                  className="btn-outline flex-1"
                  onClick={() => { setSwapModalOpen(false); navigate('/dashboard'); }}
                >
                  View My Swaps
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* End Swap Success Modal */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-navy-600 hover:text-navy-800">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Browse
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <div>
            <div className="relative mb-4">
              {item.images && item.images.length > 0 && (
                <img
                  src={item.images[activeImage]}
                  alt={item.title}
                  className="w-full h-80 object-cover rounded-xl shadow-lg"
                />
              )}
              {item.images && item.images.length > 1 && (
                <div className="flex justify-center mt-2 space-x-2">
                  {item.images.map((img, idx) => (
                    <button
                      key={img}
                      className={`w-4 h-4 rounded-full border-2 ${activeImage === idx ? 'border-primary-600 bg-primary-600' : 'border-navy-200 bg-navy-100'}`}
                      onClick={() => setActiveImage(idx)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-navy-900 mb-2">{item.title}</h1>
              <div className="flex items-center space-x-3 mb-2">
                <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                  <Tag className="w-3 h-3 mr-1" /> {item.category}
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-navy-100 text-navy-700 rounded text-xs font-medium">
                  <Package className="w-3 h-3 mr-1" /> {item.condition}
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                  <Zap className="w-3 h-3 mr-1" /> Size: {item.size}
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                  <Calendar className="w-3 h-3 mr-1" /> Purchased: {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center space-x-4 mb-2">
                <span className="flex items-center text-navy-600 text-sm">
                  <Heart className="w-4 h-4 mr-1" /> {likes} Likes
                </span>
                <span className="flex items-center text-navy-600 text-sm">
                  <Eye className="w-4 h-4 mr-1" /> {views} Views
                </span>
              </div>
              <p className="text-navy-700 mb-4 text-base leading-relaxed">{item.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {item.fabric && (
                  <span className="inline-flex items-center px-2 py-1 bg-accent-100 text-accent-700 rounded text-xs font-medium">
                    <Star className="w-3 h-3 mr-1" /> Fabric: {item.fabric}
                  </span>
                )}
                {item.tags && item.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center px-2 py-1 bg-navy-50 text-navy-700 rounded text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Owner Details */}
            <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-navy-100 flex items-center justify-center overflow-hidden">
                {owner?.avatar ? (
                  <img src={owner.avatar} alt={owner.firstName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-navy-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-navy-900">{owner?.firstName} {owner?.lastName}</div>
                <div className="text-xs text-navy-500 flex items-center">
                  <Mail className="w-3 h-3 mr-1" /> {owner?.email || 'N/A'}
                </div>
                {owner?.phone && (
                  <div className="text-xs text-navy-500 flex items-center">
                    <Phone className="w-3 h-3 mr-1" /> {owner.phone}
                  </div>
                )}
              </div>
              <button
                onClick={handleRequestSwap}
                className={`btn-primary flex items-center px-4 py-2 text-sm ${swapLoading || swapSuccess ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={swapLoading || swapSuccess}
              >
                {swapLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {swapSuccess ? 'Swap Requested' : 'Request Swap'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage; 