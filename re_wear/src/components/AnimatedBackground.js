import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none select-none overflow-hidden">
      {/* Fashion-themed Wave Pattern */}
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 2 }}
        style={{ minHeight: '100vh' }}
      >
        <motion.path
          d="M0,300 Q360,400 720,300 T1440,300 V900 H0 Z"
          fill="url(#fashionWave1)"
          animate={{
            d: [
              'M0,300 Q360,400 720,300 T1440,300 V900 H0 Z',
              'M0,320 Q360,380 720,320 T1440,340 V900 H0 Z',
              'M0,280 Q360,420 720,280 T1440,260 V900 H0 Z',
              'M0,300 Q360,400 720,300 T1440,300 V900 H0 Z',
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: 'easeInOut',
          }}
        />
        <defs>
          <linearGradient id="fashionWave1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Secondary Accent Wave */}
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2, delay: 1 }}
      >
        <motion.path
          d="M0,500 Q480,450 960,500 T1440,500 V900 H0 Z"
          fill="url(#fashionWave2)"
          animate={{
            d: [
              'M0,500 Q480,450 960,500 T1440,500 V900 H0 Z',
              'M0,480 Q480,470 960,480 T1440,520 V900 H0 Z',
              'M0,520 Q480,430 960,520 T1440,480 V900 H0 Z',
              'M0,500 Q480,450 960,500 T1440,500 V900 H0 Z',
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: 25,
            ease: 'easeInOut',
          }}
        />
        <defs>
          <linearGradient id="fashionWave2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Floating T-Shirts */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`tshirt-${i}`}
          className="absolute text-white opacity-85"
          style={{
            left: `${20 + i * 20}%`,
            top: `${15 + i * 10}%`,
          }}
          animate={{
            y: [0, -40, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <path d="M20 8v6"/>
            <path d="M23 11h-6"/>
          </svg>
        </motion.div>
      ))}

      {/* Floating Shoes */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`shoe-${i}`}
          className="absolute text-blue-400 opacity-90"
          style={{
            left: `${70 + i * 15}%`,
            top: `${25 + i * 15}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, -10, 10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        >
          <svg width="35" height="35" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 9V5a2 2 0 0 1 2-2h2"/>
            <path d="M20 9V5a2 2 0 0 0-2-2h-2"/>
            <path d="M4 22v-7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7"/>
            <path d="M18 16v-2a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"/>
          </svg>
        </motion.div>
      ))}

      {/* Floating Bags */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`bag-${i}`}
          className="absolute text-slate-200 opacity-95"
          style={{
            left: `${10 + i * 25}%`,
            top: `${60 + i * 8}%`,
          }}
          animate={{
            y: [0, -50, 0],
            rotate: [0, 15, -15, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.2,
          }}
        >
          <svg width="45" height="45" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </motion.div>
      ))}

      {/* Floating Hats */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={`hat-${i}`}
          className="absolute text-white opacity-90"
          style={{
            left: `${80 + i * 10}%`,
            top: `${45 + i * 20}%`,
          }}
          animate={{
            y: [0, -35, 0],
            rotate: [0, -8, 8, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 9 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.6,
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </motion.div>
      ))}

      {/* Floating Sunglasses */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={`sunglasses-${i}`}
          className="absolute text-blue-300 opacity-95"
          style={{
            left: `${30 + i * 40}%`,
            top: `${75 + i * 10}%`,
          }}
          animate={{
            y: [0, -45, 0],
            rotate: [0, 12, -12, 0],
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: 11 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.9,
          }}
        >
          <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="6" cy="6" r="3"/>
            <circle cx="18" cy="6" r="3"/>
            <path d="M6 9v3a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9"/>
            <path d="M9 12h6"/>
          </svg>
        </motion.div>
      ))}

      {/* Floating Jewelry */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`jewelry-${i}`}
          className="absolute text-yellow-300 opacity-95"
          style={{
            left: `${5 + i * 22}%`,
            top: `${35 + i * 12}%`,
          }}
          animate={{
            y: [0, -25, 0],
            rotate: [0, 360],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 6 + i * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        >
          <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </motion.div>
      ))}

      {/* Floating Scarves */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={`scarf-${i}`}
          className="absolute text-red-300 opacity-90"
          style={{
            left: `${60 + i * 30}%`,
            top: `${20 + i * 25}%`,
          }}
          animate={{
            y: [0, -60, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
        >
          <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </motion.div>
      ))}

      {/* Fashion Grid Pattern */}
      <motion.div
        className="absolute inset-0 opacity-12"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
        animate={{
          x: [0, 60, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Pulsing Fashion Icons */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`pulse-${i}`}
          className="absolute bg-gradient-to-r from-slate-600 to-blue-600 rounded-full"
          style={{
            width: `${15 + i * 5}px`,
            height: `${15 + i * 5}px`,
            left: `${15 + i * 12}%`,
            top: `${80 + i * 3}%`,
          }}
          animate={{
            scale: [1, 2.5, 1],
            opacity: [0.6, 1, 0.6],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 4 + i * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.6,
          }}
        />
      ))}

      {/* Enhanced Mesh Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-mesh opacity-20"
        animate={{
          opacity: [0.2, 0.35, 0.2],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default AnimatedBackground; 