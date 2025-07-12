import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ArrowRight, 
  Heart, 
  Package, 
  TrendingUp, 
  Shield, 
  Globe,
  Star,
  Zap,
  Sparkles
} from 'lucide-react';

const LandingPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const features = [
    {
      icon: Package,
      title: "Smart Swapping",
      description: "AI-powered matching system connects you with the perfect clothing exchanges.",
      color: "from-navy-500 to-navy-600"
    },
    {
      icon: TrendingUp,
      title: "Earn Points",
      description: "Gain rewards for sustainable choices and community participation.",
      color: "from-accent-500 to-accent-600"
    },
    {
      icon: Shield,
      title: "Verified Quality",
      description: "All items are carefully vetted to ensure premium condition.",
      color: "from-navy-600 to-accent-600"
    },
    {
      icon: Globe,
      title: "Eco Impact",
      description: "Track your environmental footprint and contribution to sustainability.",
      color: "from-accent-600 to-navy-600"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users", icon: Users },
    { number: "50K+", label: "Items Swapped", icon: Package },
    { number: "95%", label: "Satisfaction Rate", icon: Star },
    { number: "2.5K", label: "Tons CO₂ Saved", icon: Globe }
  ];

  return (
    <div className="min-h-screen" ref={containerRef}>
      {/* Hero Section with Parallax */}
      <section className="gradient-bg py-20 lg:py-32 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-10"
          style={{ y }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-navy-200 to-accent-200 transform rotate-12 scale-150"></div>
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Sparkles className="w-5 h-5 text-accent-600" />
              <span className="text-sm font-medium text-navy-700">Revolutionizing Sustainable Fashion</span>
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-navy-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Swap. Save.{" "}
              <span className="text-gradient-animation">Sustain.</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-navy-600 mb-8 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Join our community of sustainable fashion enthusiasts. Exchange clothes, 
              earn points, and make a positive impact on the planet with every swap.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link to="/signup" className="btn-accent group text-lg px-8 py-4">
                <Users className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/how-it-works" className="btn-secondary group text-lg px-8 py-4">
                <Heart className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                Learn More
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Stats Section */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-accent-600 mr-2" />
                    <span className="text-2xl md:text-3xl font-bold text-navy-900">{stat.number}</span>
                  </div>
                  <p className="text-sm text-navy-600 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
              Why Choose <span className="text-gradient">ReWear</span>?
            </h2>
            <p className="text-xl text-navy-600 max-w-3xl mx-auto">
              Experience the future of sustainable fashion with our innovative platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card-hover p-8 text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-4">{feature.title}</h3>
                <p className="text-navy-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg-dark py-20 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-navy-800/50 to-accent-800/50"
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your <span className="text-gradient-accent">Sustainable Journey</span>?
            </h2>
            <p className="text-xl text-navy-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already making a difference. 
              Start swapping today and earn rewards while saving the planet.
            </p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link to="/signup" className="btn-accent group text-lg px-8 py-4">
                <Zap className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                Join ReWear Today
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/browse" className="btn-outline group text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-navy-900">
                <Package className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                Browse Items
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 