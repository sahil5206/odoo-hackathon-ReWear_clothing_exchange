import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const BackButton = ({ 
  className = "", 
  text = "Back", 
  onClick, 
  variant = "default",
  size = "default",
  position = "fixed" // "fixed" or "relative"
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  const baseClasses = "flex items-center space-x-2 font-medium transition-all duration-200";
  
  const variants = {
    default: "text-navy-600 hover:text-navy-800 hover:bg-navy-50 px-4 py-2 rounded-lg",
    outline: "text-navy-600 border border-navy-200 hover:bg-navy-50 px-4 py-2 rounded-lg",
    solid: "bg-navy-600 text-white hover:bg-navy-700 px-4 py-2 rounded-lg",
    ghost: "text-navy-600 hover:text-navy-800 px-2 py-1 rounded"
  };

  const sizes = {
    small: "text-sm",
    default: "text-base",
    large: "text-lg"
  };

  const positionClasses = {
    fixed: "fixed top-20 left-4 z-40", // Below navbar
    relative: "relative"
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${positionClasses[position]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <ArrowLeft className="w-4 h-4" />
      <span>{text}</span>
    </motion.button>
  );
};

export default BackButton; 