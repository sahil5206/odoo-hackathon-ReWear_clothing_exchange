import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-earth-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">ReWear</span>
            </div>
            <p className="text-earth-300 mb-6 max-w-md">
              Join our community of sustainable fashion enthusiasts. Swap, save, and sustain 
              the planet one garment at a time.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-earth-300 hover:text-primary-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-earth-300 hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-earth-300 hover:text-primary-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-earth-300 hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-earth-300 hover:text-primary-400 transition-colors">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link to="/add-item" className="text-earth-300 hover:text-primary-400 transition-colors">
                  List an Item
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-earth-300 hover:text-primary-400 transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary-400" />
                <span className="text-earth-300">hello@rewear.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary-400" />
                <span className="text-earth-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-primary-400 mt-1" />
                <span className="text-earth-300">
                  123 Sustainable St.<br />
                  Green City, GC 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-earth-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-earth-400 text-sm">
              © {currentYear} ReWear. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-earth-400 hover:text-primary-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-earth-400 hover:text-primary-400 text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 