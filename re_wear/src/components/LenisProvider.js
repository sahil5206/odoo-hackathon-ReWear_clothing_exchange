import React, { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

const LenisProvider = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis with optimized settings
    lenisRef.current = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 0.8,
      smoothTouch: true,
      touchMultiplier: 1.5,
      infinite: false,
      lerp: 0.1,
      syncTouch: true,
      syncTouchLerp: 0.1,
      touchInertiaMultiplier: 30,
    });

    // RAF for Lenis with better performance
    function raf(time) {
      lenisRef.current.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Expose lenis to window for debugging
    window.lenis = lenisRef.current;

    // Cleanup
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  return <>{children}</>;
};

export default LenisProvider; 