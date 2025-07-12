import React, { useState } from 'react';
import { 
  Home, 
  Package, 
  MessageSquare, 
  Coins, 
  User, 
  Settings, 
  Plus,
  Bell,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(3);

  const userStats = {
    totalItems: 12,
    activeSwaps: 3,
    points: 450,
    completedSwaps: 8
  };

  const userItems = [
    {
      id: 1,
      title: "Vintage Denim Jacket",
      image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=300&h=300&fit=crop",
      status: "Active",
      views: 24,
      requests: 3,
      points: 150
    },
    {
      id: 2,
      title: "Organic Cotton Dress",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop",
      status: "Pending",
      views: 12,
      requests: 1,
      points: 200
    },
    {
      id: 3,
      title: "Sustainable Sneakers",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
      status: "Swapped",
      views: 45,
      requests: 5,
      points: 120
    }
  ];

  const swapRequests = [
    {
      id: 1,
      fromUser: "Sarah Johnson",
      item: "Handmade Wool Sweater",
      status: "Pending",
      date: "2 hours ago"
    },
    {
      id: 2,
      fromUser: "Mike Chen",
      item: "Vintage Denim Jacket",
      status: "Accepted",
      date: "1 day ago"
    }
  ];

  const navigation = [
    { name: 'Overview', icon: Home, id: 'overview' },
    { name: 'My Items', icon: Package, id: 'items' },
    { name: 'Swap Requests', icon: MessageSquare, id: 'requests' },
    { name: 'Points', icon: Coins, id: 'points' },
    { name: 'Profile', icon: User, id: 'profile' },
    { name: 'Settings', icon: Settings, id: 'settings' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-earth-600">Total Items</p>
              <p className="text-2xl font-bold text-earth-900">{userStats.totalItems}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-earth-600">Active Swaps</p>
              <p className="text-2xl font-bold text-earth-900">{userStats.activeSwaps}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Coins className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-earth-600">Points Balance</p>
              <p className="text-2xl font-bold text-earth-900">{userStats.points}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Home className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-earth-600">Completed Swaps</p>
              <p className="text-2xl font-bold text-earth-900">{userStats.completedSwaps}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-earth-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-earth-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-earth-900">New swap request for "Vintage Denim Jacket"</p>
                <p className="text-xs text-earth-600">2 hours ago</p>
              </div>
            </div>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-earth-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-earth-900">Item "Organic Cotton Dress" approved</p>
                <p className="text-xs text-earth-600">1 day ago</p>
              </div>
            </div>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderItems = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-earth-900">My Items</h3>
        <button className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userItems.map((item) => (
          <div key={item.id} className="card">
            <div className="relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'Active' ? 'bg-green-100 text-green-800' :
                  item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-earth-900 mb-2">{item.title}</h4>
              <div className="flex justify-between items-center text-sm text-earth-600 mb-3">
                <span>{item.views} views</span>
                <span>{item.requests} requests</span>
                <span>{item.points} pts</span>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 btn-outline py-2 text-sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                <button className="flex-1 btn-outline py-2 text-sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button className="flex-1 btn-outline py-2 text-sm text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-earth-900">Swap Requests</h3>
      <div className="card">
        <div className="p-6">
          {swapRequests.map((request) => (
            <div key={request.id} className="flex items-center justify-between py-4 border-b border-earth-200 last:border-b-0">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-earth-900">{request.fromUser}</p>
                  <p className="text-sm text-earth-600">Wants to swap: {request.item}</p>
                  <p className="text-xs text-earth-500">{request.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {request.status}
                </span>
                {request.status === 'Pending' && (
                  <>
                    <button className="btn-primary py-1 px-3 text-sm">Accept</button>
                    <button className="btn-outline py-1 px-3 text-sm">Decline</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'items':
        return renderItems();
      case 'requests':
        return renderRequests();
      case 'points':
        return <div className="card p-6"><h3>Points Management</h3></div>;
      case 'profile':
        return <div className="card p-6"><h3>Profile Settings</h3></div>;
      case 'settings':
        return <div className="card p-6"><h3>Account Settings</h3></div>;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-earth-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gradient">ReWear</span>
            </div>

            <nav className="space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-earth-600 hover:bg-earth-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-earth-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h1 className="text-2xl font-bold text-earth-900">
                    {navigation.find(nav => nav.id === activeTab)?.name}
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="relative p-2 text-earth-600 hover:text-primary-600 transition-colors">
                    <Bell className="w-5 h-5" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notifications}
                      </span>
                    )}
                  </button>
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 