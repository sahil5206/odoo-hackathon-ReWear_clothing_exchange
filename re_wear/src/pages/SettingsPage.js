import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Bell, 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  Mail, 
  Smartphone,
  Globe,
  Download,
  Trash2,
  Key,
  CheckCircle,
  X,
  AlertTriangle,
  Info,
  ToggleLeft,
  ToggleRight,
  Save,
  RefreshCw,
  Database,
  Palette,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import apiService from '../services/api';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const { socket, isConnected, connect, disconnect } = useSocket();
  
  const [activeSection, setActiveSection] = useState('account');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  
  const [settings, setSettings] = useState({
    account: {
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || ''
    },
    notifications: {
      email: {
        newMessages: true,
        swapRequests: true,
        itemViews: true,
        achievements: true,
        weeklyDigest: false
      },
      push: {
        newMessages: true,
        swapRequests: true,
        itemViews: false,
        achievements: true,
        realTimeUpdates: true
      },
      inApp: {
        newMessages: true,
        swapRequests: true,
        itemViews: true,
        achievements: true,
        communityUpdates: true
      }
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      showLocation: true,
      allowMessages: true,
      allowProfileViews: true,
      dataSharing: false
    },
    security: {
      twoFactorAuth: false,
      loginNotifications: true,
      sessionTimeout: 30,
      passwordChangeRequired: false
    },
    preferences: {
      theme: 'auto',
      language: 'en',
      currency: 'USD',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY'
    },
    data: {
      autoBackup: true,
      backupFrequency: 'weekly',
      dataRetention: '1year',
      analytics: true
    }
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Demo connection status
  const [connectionStatus, setConnectionStatus] = useState({
    websocket: isConnected,
    api: true,
    database: true,
    notifications: true
  });

  useEffect(() => {
    // Simulate real-time connection monitoring
    const interval = setInterval(() => {
      setConnectionStatus({
        websocket: isConnected,
        api: Math.random() > 0.1, // 90% uptime
        database: Math.random() > 0.05, // 95% uptime
        notifications: Math.random() > 0.15 // 85% uptime
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleNestedSettingChange = (section, subsection, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [key]: value
        }
      }
    }));
  };

  const validatePasswordChange = () => {
    const errors = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = async () => {
    if (!validatePasswordChange()) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Password updated successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setValidationErrors({});
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await updateProfile(settings.account);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      // Simulate data export
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const data = {
        user: user,
        settings: settings,
        timestamp: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rewear-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully!');
      setShowExportConfirm(false);
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      // Simulate account deletion
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success('Account deleted successfully');
      // Redirect to logout
    } catch (error) {
      toast.error('Failed to delete account');
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-earth-900 mb-4">Account Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={settings.account.firstName}
              onChange={(e) => handleSettingChange('account', 'firstName', e.target.value)}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={settings.account.lastName}
              onChange={(e) => handleSettingChange('account', 'lastName', e.target.value)}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={settings.account.email}
              onChange={(e) => handleSettingChange('account', 'email', e.target.value)}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={settings.account.phone}
              onChange={(e) => handleSettingChange('account', 'phone', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-earth-900 mb-4">Change Password</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                className={`input-field pr-10 ${validationErrors.currentPassword ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-earth-400 hover:text-earth-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {validationErrors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.currentPassword}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                className={`input-field pr-10 ${validationErrors.newPassword ? 'border-red-500' : ''}`}
              />
            </div>
            {validationErrors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.newPassword}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                className={`input-field pr-10 ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-earth-400 hover:text-earth-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>
            )}
          </div>
          
          <button
            onClick={handlePasswordChange}
            disabled={isLoading}
            className="btn-primary flex items-center"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Key className="w-4 h-4 mr-2" />
                Update Password
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-earth-900 mb-4">Email Notifications</h3>
        
        <div className="space-y-4">
          {Object.entries(settings.notifications.email).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-earth-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-sm text-earth-600">
                  Receive email notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </p>
              </div>
              <button
                onClick={() => handleNestedSettingChange('notifications', 'email', key, !value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-primary-600' : 'bg-earth-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-earth-900 mb-4">Push Notifications</h3>
        
        <div className="space-y-4">
          {Object.entries(settings.notifications.push).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-earth-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-sm text-earth-600">
                  Receive push notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </p>
              </div>
              <button
                onClick={() => handleNestedSettingChange('notifications', 'push', key, !value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-primary-600' : 'bg-earth-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-earth-900 mb-4">In-App Notifications</h3>
        
        <div className="space-y-4">
          {Object.entries(settings.notifications.inApp).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-earth-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-sm text-earth-600">
                  Show in-app notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </p>
              </div>
              <button
                onClick={() => handleNestedSettingChange('notifications', 'inApp', key, !value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-primary-600' : 'bg-earth-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-earth-900 mb-4">Profile Privacy</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Profile Visibility
            </label>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
              className="input-field"
            >
              <option value="public">Public - Anyone can view</option>
              <option value="community">Community - Only members can view</option>
              <option value="private">Private - Only you can view</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {Object.entries(settings.privacy).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-earth-900 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-sm text-earth-600">
                    Allow others to see your {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </p>
                </div>
                <button
                  onClick={() => handleSettingChange('privacy', key, !value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-primary-600' : 'bg-earth-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-earth-900 mb-4">Security Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-earth-900">Two-Factor Authentication</p>
              <p className="text-sm text-earth-600">Add an extra layer of security to your account</p>
            </div>
            <button
              onClick={() => handleSettingChange('security', 'twoFactorAuth', !settings.security.twoFactorAuth)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.security.twoFactorAuth ? 'bg-primary-600' : 'bg-earth-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-earth-900">Login Notifications</p>
              <p className="text-sm text-earth-600">Get notified when someone logs into your account</p>
            </div>
            <button
              onClick={() => handleSettingChange('security', 'loginNotifications', !settings.security.loginNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.security.loginNotifications ? 'bg-primary-600' : 'bg-earth-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.security.loginNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Session Timeout (minutes)
            </label>
            <select
              value={settings.security.sessionTimeout}
              onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
              className="input-field"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-earth-900 mb-4">Data Management</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-earth-900">Auto Backup</p>
              <p className="text-sm text-earth-600">Automatically backup your data</p>
            </div>
            <button
              onClick={() => handleSettingChange('data', 'autoBackup', !settings.data.autoBackup)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.data.autoBackup ? 'bg-primary-600' : 'bg-earth-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.data.autoBackup ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-2">
              Backup Frequency
            </label>
            <select
              value={settings.data.backupFrequency}
              onChange={(e) => handleSettingChange('data', 'backupFrequency', e.target.value)}
              className="input-field"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-earth-900">Analytics</p>
              <p className="text-sm text-earth-600">Help improve ReWear by sharing usage data</p>
            </div>
            <button
              onClick={() => handleSettingChange('data', 'analytics', !settings.data.analytics)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.data.analytics ? 'bg-primary-600' : 'bg-earth-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.data.analytics ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setShowExportConfirm(true)}
              className="btn-outline flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </button>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-outline text-red-600 border-red-300 hover:bg-red-50 flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemStatus = () => (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-earth-900 mb-4">System Status</h3>
        
        <div className="space-y-4">
          {Object.entries(connectionStatus).map(([service, status]) => (
            <div key={service} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  status ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="font-medium text-earth-900 capitalize">
                  {service.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
              <span className={`text-sm ${
                status ? 'text-green-600' : 'text-red-600'
              }`}>
                {status ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const sections = [
    { id: 'account', name: 'Account', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'data', name: 'Data', icon: Database },
    { id: 'system', name: 'System', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return renderAccountSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'security':
        return renderSecuritySettings();
      case 'data':
        return renderDataSettings();
      case 'system':
        return renderSystemStatus();
      default:
        return renderAccountSettings();
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-earth-900 mb-2">Settings</h1>
          <p className="text-earth-600">Manage your account preferences and privacy settings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-earth-600 hover:bg-earth-100'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
                
                {activeSection !== 'system' && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSaveSettings}
                      disabled={isLoading}
                      className="btn-primary flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Export Confirmation Modal */}
        <AnimatePresence>
          {showExportConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              >
                <h3 className="text-lg font-semibold text-earth-900 mb-4">Export Data</h3>
                <p className="text-earth-600 mb-6">
                  This will download all your data including profile, items, and settings in JSON format.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={handleExportData}
                    disabled={isLoading}
                    className="btn-primary flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowExportConfirm(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-earth-900">Delete Account</h3>
                </div>
                <p className="text-earth-600 mb-6">
                  This action cannot be undone. All your data, items, and account information will be permanently deleted.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isLoading}
                    className="btn-outline text-red-600 border-red-300 hover:bg-red-50 flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SettingsPage; 