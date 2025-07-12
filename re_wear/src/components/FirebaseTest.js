import React, { useState } from 'react';
import { signInWithGoogle, signOutUser, auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const FirebaseTest = () => {
  const [testResult, setTestResult] = useState('');
  const { user, isAuthenticated } = useAuth();

  const testGoogleAuth = async () => {
    try {
      setTestResult('Testing Google authentication...');
      const result = await signInWithGoogle();
      setTestResult(`✅ Google auth successful! User: ${result.user.email}`);
    } catch (error) {
      setTestResult(`❌ Google auth failed: ${error.message}`);
    }
  };

  const testSignOut = async () => {
    try {
      await signOutUser();
      setTestResult('✅ Sign out successful!');
    } catch (error) {
      setTestResult(`❌ Sign out failed: ${error.message}`);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Firebase Authentication Test</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Current Auth Status:</p>
          <p className="font-medium">
            {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
          </p>
        </div>
        
        {user && (
          <div>
            <p className="text-sm text-gray-600">User Info:</p>
            <p className="font-medium">{user.email}</p>
            <p className="text-sm">{user.provider || 'email'}</p>
          </div>
        )}
        
        <div className="space-y-2">
          <button
            onClick={testGoogleAuth}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Test Google Sign In
          </button>
          
          <button
            onClick={testSignOut}
            className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Test Sign Out
          </button>
        </div>
        
        {testResult && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <p className="text-sm">{testResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirebaseTest; 