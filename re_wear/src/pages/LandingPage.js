import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RefreshCw, Heart, Users, ShoppingBag, Star } from 'lucide-react';

const LandingPage = () => {
  const featuredItems = [
    {
      id: 1,
      title: "Vintage Denim Jacket",
      image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop",
      category: "Outerwear",
      condition: "Excellent",
      points: 150
    },
    {
      id: 2,
      title: "Organic Cotton Dress",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop",
      category: "Dresses",
      condition: "Like New",
      points: 200
    },
    {
      id: 3,
      title: "Sustainable Sneakers",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
      category: "Footwear",
      condition: "Good",
      points: 120
    },
    {
      id: 4,
      title: "Handmade Wool Sweater",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      category: "Sweaters",
      condition: "Excellent",
      points: 180
    }
  ];

  const howItWorks = [
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "List Your Items",
      description: "Upload photos and details of clothes you want to exchange or donate."
    },
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: "Browse & Swap",
      description: "Find items you love and request swaps or redeem with points."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Sustainable Fashion",
      description: "Give clothes a second life while reducing environmental impact."
    }
  ];

  const stats = [
    { number: "10K+", label: "Items Swapped" },
    { number: "5K+", label: "Happy Users" },
    { number: "50K+", label: "Pounds Saved" },
    { number: "99%", label: "Satisfaction Rate" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-earth-900 mb-6">
              Swap. Save. <span className="text-gradient">Sustain.</span>
            </h1>
            <p className="text-xl md:text-2xl text-earth-600 mb-8 max-w-3xl mx-auto">
              Join our community of sustainable fashion enthusiasts. Exchange clothes, 
              earn points, and make a positive impact on the planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/browse" className="btn-primary text-lg px-8 py-4">
                Start Browsing
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/add-item" className="btn-secondary text-lg px-8 py-4">
                List an Item
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-earth-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items Carousel */}
      <section className="py-16 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-earth-900 mb-4">
              Featured Items
            </h2>
            <p className="text-earth-600 text-lg">
              Discover amazing pieces from our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <div key={item.id} className="card group">
                <div className="relative overflow-hidden rounded-t-xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {item.points} pts
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-earth-900 mb-2">{item.title}</h3>
                  <div className="flex justify-between items-center text-sm text-earth-600">
                    <span>{item.category}</span>
                    <span className="text-primary-600 font-medium">{item.condition}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/browse" className="btn-outline">
              View All Items
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-earth-900 mb-4">
              How It Works
            </h2>
            <p className="text-earth-600 text-lg max-w-2xl mx-auto">
              Join thousands of users who are making sustainable fashion choices
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-earth-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-earth-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-earth-900 mb-6">
            Ready to Start Your Sustainable Fashion Journey?
          </h2>
          <p className="text-xl text-earth-600 mb-8">
            Join our community today and start swapping clothes for a better tomorrow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-primary text-lg px-8 py-4">
              Get Started Free
            </Link>
            <Link to="/how-it-works" className="btn-outline text-lg px-8 py-4">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 