import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';
import toast from 'react-hot-toast';
import { auth, signInWithGoogle, signOutUser, onAuthStateChange } from '../firebase';
// import { useNavigate } from 'react-router-dom'; // REMOVE

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenWarning, setTokenWarning] = useState('');
  // const navigate = useNavigate(); // REMOVE

  // Check if user is logged in on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check for Firebase auth state
        const unsubscribe = onAuthStateChange(async (firebaseUser) => {
          if (firebaseUser) {
            // User is signed in with Firebase
            const userData = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              firstName: firebaseUser.displayName?.split(' ')[0] || '',
              lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
              avatar: firebaseUser.photoURL,
              provider: 'google'
            };
            setUser(userData);
            setIsAuthenticated(true);
            // Try to sync with backend
            try {
              const backendResponse = await apiService.syncFirebaseUser(firebaseUser);
              localStorage.setItem('token', backendResponse.token);
              setTokenWarning('');
            } catch (error) {
              setTokenWarning('Could not sync with backend. Please log out and log in again.');
              localStorage.removeItem('token');
              setIsAuthenticated(false);
            }
          } else {
            // Check for traditional token-based auth
            const token = localStorage.getItem('token');
            if (token) {
              try {
                const userData = await apiService.getCurrentUser();
                setUser(userData.user);
                setIsAuthenticated(true);
                setTokenWarning('');
              } catch (error) {
                setTokenWarning('Your session has expired. Please log in again.');
                localStorage.removeItem('token');
                setUser(null);
                setIsAuthenticated(false);
              }
            } else {
              setUser(null);
              setIsAuthenticated(false);
              setTokenWarning('You are not logged in. Please log in to continue.');
            }
          }
          setLoading(false);
        });
        return () => unsubscribe();
      } catch (error) {
        setTokenWarning('Authentication error. Please log in again.');
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await apiService.login({ email, password });
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success('Welcome back!');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Google Login function
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithGoogle();
      const { user: firebaseUser } = result;
      
      // Sync with backend and get JWT
      let backendResponse;
      try {
        backendResponse = await apiService.syncFirebaseUser(firebaseUser);
        localStorage.setItem('token', backendResponse.token);
        console.log('[Auth] JWT token set after Google login:', backendResponse.token);
        setUser({
          id: backendResponse.user.id,
          email: backendResponse.user.email,
          firstName: backendResponse.user.firstName,
          lastName: backendResponse.user.lastName,
          avatar: backendResponse.user.avatar,
          provider: 'google'
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.log('Backend sync failed, using Firebase auth only');
        // Fallback to Firebase user only (not recommended)
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          firstName: firebaseUser.displayName?.split(' ')[0] || '',
          lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
          avatar: firebaseUser.photoURL,
          provider: 'google'
        });
        setIsAuthenticated(true);
      }
      // Warn if token is missing
      if (!localStorage.getItem('token')) {
        console.warn('[Auth] No JWT token found in localStorage after Google login!');
      }
      toast.success('Welcome back!');
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google login failed. Please try again.');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await apiService.register(userData);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Sign out from Firebase if user was signed in with Google
      if (user?.provider === 'google') {
        await signOutUser();
      } else {
        // Remove traditional token
        localStorage.removeItem('token');
      }
      
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      
      if (user?.provider === 'google') {
        // For Google users, update local state only
        setUser({ ...user, ...profileData });
        toast.success('Profile updated successfully!');
      } else {
        // For traditional users, update backend
        const response = await apiService.updateUserProfile(profileData);
        setUser(response.user);
        toast.success('Profile updated successfully!');
      }
      
      return { success: true };
    } catch (error) {
      toast.error(error.message || 'Profile update failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    loginWithGoogle,
    register,
    logout,
    updateProfile,
    tokenWarning
  };

  return (
    <AuthContext.Provider value={value}>
      {tokenWarning && !loading && (
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '1rem', textAlign: 'center', fontWeight: 'bold', zIndex: 1000 }}>
          {tokenWarning}
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
}; 