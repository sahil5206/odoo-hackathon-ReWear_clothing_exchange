import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import BrowsePage from './pages/BrowsePage';
import AddItemPage from './pages/AddItemPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Navbar />
              <LandingPage />
              <Footer />
            </>
          } />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          <Route path="/browse" element={
            <>
              <Navbar />
              <BrowsePage />
              <Footer />
            </>
          } />
          
          <Route path="/add-item" element={
            <>
              <Navbar />
              <AddItemPage />
              <Footer />
            </>
          } />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Catch all route */}
          <Route path="*" element={
            <>
              <Navbar />
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-earth-900 mb-4">404</h1>
                  <p className="text-earth-600 mb-8">Page not found</p>
                  <a href="/" className="btn-primary">Go Home</a>
                </div>
              </div>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
