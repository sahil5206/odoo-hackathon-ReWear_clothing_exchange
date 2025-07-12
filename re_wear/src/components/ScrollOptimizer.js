import React, { useEffect } from 'react';

const ScrollOptimizer = () => {
  useEffect(() => {
    // Optimize scroll performance
    const optimizeScroll = () => {
      // Disable scroll on body when modals are open
      const modals = document.querySelectorAll('[data-modal]');
      const hasOpenModal = Array.from(modals).some(modal => 
        modal.style.display !== 'none' && modal.style.visibility !== 'hidden'
      );

      if (hasOpenModal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    // Optimize scroll performance for fixed elements
    const handleScroll = () => {
      const fixedElements = document.querySelectorAll('.fixed, .sticky');
      fixedElements.forEach(element => {
        element.style.willChange = 'transform';
      });
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Run initial optimization
    optimizeScroll();
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null;
};

export default ScrollOptimizer; 