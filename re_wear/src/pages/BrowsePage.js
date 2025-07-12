import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, Eye, ShoppingBag, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { useAuth } from '../contexts/AuthContext';
import ActivityFeed from '../components/ActivityFeed';
import apiService from '../services/api';
import toast from 'react-hot-toast';

const BrowsePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { joinBrowseRoom, leaveBrowseRoom, emitUserActivity } = useSocket();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Use real-time data hook
  const { data: realTimeItems, updateData, refreshData } = useRealTimeData([], 'items');

  const categories = [
    'All Categories', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear', 'Accessories'
  ];

  const sizes = ['All Sizes', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const conditions = ['All Conditions', 'Like New', 'Excellent', 'Good', 'Fair'];

  // Fallback items for demo
  const demoItems = [
    {
      id: 1,
      title: "Vintage Denim Jacket",
      image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop",
      category: "Outerwear",
      size: "M",
      condition: "Excellent",
      points: 150,
      user: "Sarah J.",
      location: "New York, NY",
      likes: 24,
      views: 156
    },
    {
      id: 2,
      title: "Organic Cotton Dress",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop",
      category: "Dresses",
      size: "S",
      condition: "Like New",
      points: 200,
      user: "Mike C.",
      location: "Los Angeles, CA",
      likes: 18,
      views: 89
    },
    {
      id: 3,
      title: "Sustainable Sneakers",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
      category: "Footwear",
      size: "8",
      condition: "Good",
      points: 120,
      user: "Emma R.",
      location: "Chicago, IL",
      likes: 31,
      views: 203
    },
    {
      id: 4,
      title: "Handmade Wool Sweater",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      category: "Tops",
      size: "L",
      condition: "Excellent",
      points: 180,
      user: "David L.",
      location: "Miami, FL",
      likes: 42,
      views: 267
    },
    {
      id: 5,
      title: "Vintage Silk Blouse",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
      category: "Tops",
      size: "M",
      condition: "Good",
      points: 90,
      user: "Lisa K.",
      location: "Seattle, WA",
      likes: 15,
      views: 78
    },
    {
      id: 6,
      title: "Eco-Friendly Jeans",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
      category: "Bottoms",
      size: "30",
      condition: "Like New",
      points: 160,
      user: "Alex M.",
      location: "Austin, TX",
      likes: 28,
      views: 134
    }
  ];

  // Use real-time items if available, otherwise use demo items
  const items = realTimeItems.length > 0 ? realTimeItems : demoItems;

  // Join browse room for real-time updates
  useEffect(() => {
    joinBrowseRoom();
    emitUserActivity('started browsing items');
    
    return () => {
      leaveBrowseRoom();
    };
  }, [joinBrowseRoom, leaveBrowseRoom, emitUserActivity]);

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const items = await apiService.getRealTimeItems();
        updateData(items);
      } catch (error) {
        console.log('Using demo items - API not available');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [updateData]);

  // Handle view item
  const handleViewItem = (item) => {
    navigate(`/item/${item.id}`);
  };

  // Handle request swap
  const handleRequestSwap = async (item) => {
    if (!isAuthenticated) {
      toast.error('Please login to request swaps');
      return;
    }

    // Navigate to the swap request form
    navigate(`/swap-request/${item.id}`);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSize = selectedSize === 'all' || item.size === selectedSize;
    const matchesCondition = selectedCondition === 'all' || item.condition === selectedCondition;
    
    return matchesSearch && matchesCategory && matchesSize && matchesCondition;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.id - a.id;
      case 'oldest':
        return a.id - b.id;
      case 'points-low':
        return a.points - b.points;
      case 'points-high':
        return b.points - a.points;
      case 'popular':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-earth-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-earth-900 mb-2">Browse Items</h1>
          <p className="text-earth-600">Discover amazing sustainable fashion pieces from our community</p>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-earth-400" />
              </div>
              <input
                type="text"
                placeholder="Search items, categories, or users..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sort Dropdown */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="points-low">Points: Low to High</option>
                <option value="points-high">Points: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Filter Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {categories.map(category => (
                  <option key={category} value={category === 'All Categories' ? 'all' : category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">Size</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="input-field"
              >
                {sizes.map(size => (
                  <option key={size} value={size === 'All Sizes' ? 'all' : size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">Condition</label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="input-field"
              >
                {conditions.map(condition => (
                  <option key={condition} value={condition === 'All Conditions' ? 'all' : condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-earth-600">
            Showing {sortedItems.length} of {items.length} items
          </p>
          <button className="btn-outline flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </button>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedItems.map((item) => (
            <div key={item.id} className="card group flex flex-col h-full">
              <div className="relative overflow-hidden rounded-t-xl">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {item.points} pts
                </div>
                <button className="absolute top-2 left-2 p-2 bg-white rounded-full shadow-md hover:bg-earth-50 transition-colors">
                  <Heart className="w-4 h-4 text-earth-600" />
                </button>
              </div>
              
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-earth-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                
                <div className="flex items-center justify-between text-sm text-earth-600 mb-3">
                  <span>{item.category}</span>
                  <span className="text-primary-600 font-medium">{item.condition}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-earth-500 mb-3">
                  <span>Size: {item.size}</span>
                  <span>{item.location}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-earth-500 mb-4">
                  <span>by {item.user}</span>
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <Heart className="w-3 h-3 mr-1" />
                      {item.likes}
                    </span>
                    <span className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {item.views}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons - Contained within card */}
                <div className="mt-auto pt-3 border-t border-earth-100">
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleViewItem(item)}
                      className="w-full inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-1 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-xs"
                    >
                      <ShoppingBag className="w-3 h-3 mr-1" />
                      View
                    </button>
                    <button 
                      onClick={() => handleRequestSwap(item)}
                      className="w-full inline-flex items-center justify-center bg-transparent hover:bg-primary-50 text-primary-600 border border-primary-600 font-medium py-2 px-1 rounded-lg transition-all duration-200 transform hover:scale-105 text-xs"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Swap
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {sortedItems.length > 0 && (
          <div className="text-center mt-8">
            <button className="btn-outline">
              Load More Items
            </button>
          </div>
        )}

        {/* No Results */}
        {sortedItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-earth-400" />
            </div>
            <h3 className="text-lg font-semibold text-earth-900 mb-2">No items found</h3>
            <p className="text-earth-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedSize('all');
                setSelectedCondition('all');
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowsePage; 