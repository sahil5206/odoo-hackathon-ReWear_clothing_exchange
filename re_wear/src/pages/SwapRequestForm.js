import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Home, 
  Package, 
  MessageSquare, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import apiService from '../services/api';
import toast from 'react-hot-toast';

const SwapRequestForm = () => {
  const { itemId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [owner, setOwner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Receiver Details
    receiverName: '',
    receiverEmail: '',
    receiverPhone: '',
    
    // Address Details
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Additional Details
    preferredContactMethod: 'email',
    specialInstructions: '',
    preferredSwapDate: '',
    preferredSwapTime: '',
    
    // Item Details
    itemCondition: '',
    itemDescription: '',
    itemImages: []
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      setIsLoading(true);
      try {
        const data = await apiService.getItem(itemId);
        setItem(data.item);
        setOwner(data.owner);
      } catch (error) {
        // DEMO fallback data
        console.error('API error:', error);
        const demoItem = {
          id: itemId,
          title: 'Vintage Denim Jacket',
          description: 'A classic vintage denim jacket in excellent condition.',
          category: 'Outerwear',
          size: 'M',
          condition: 'Excellent',
          images: ['https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop'],
          owner: {
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.johnson@example.com'
          }
        };
        setItem(demoItem);
        setOwner(demoItem.owner);
        toast('Showing demo item (API unavailable)', { icon: 'ℹ️' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchItem();
  }, [itemId]);

  // Real-time socket events
  useEffect(() => {
    if (socket && isConnected) {
      // Listen for swap request status updates
      socket.on('swap-request-status-updated', (data) => {
        if (data.itemId === itemId) {
          toast.success(`Swap request ${data.status.toLowerCase()}`);
          if (data.status === 'Accepted') {
            setShowSuccess(true);
          }
        }
      });

      // Listen for new swap request notifications
      socket.on('new-swap-request', (data) => {
        if (data.itemId === itemId) {
          toast.success('Swap request submitted successfully!');
        }
      });

      return () => {
        socket.off('swap-request-status-updated');
        socket.off('new-swap-request');
      };
    }
  }, [socket, isConnected, itemId]);

  // Pre-fill form with user data if available
  useEffect(() => {
    if (user && isAuthenticated) {
      setFormData(prev => ({
        ...prev,
        receiverName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        receiverEmail: user.email || '',
        receiverPhone: user.phone || ''
      }));
    }
  }, [user, isAuthenticated]);

  // Refactored validation to be step-specific
  const validateForm = (step = null) => {
    const newErrors = {};
    // Step 1: Receiver Details
    if (!step || step === 1) {
      if (!formData.receiverName.trim()) newErrors.receiverName = 'Receiver name is required';
      if (!formData.receiverEmail.trim()) newErrors.receiverEmail = 'Receiver email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.receiverEmail)) newErrors.receiverEmail = 'Please enter a valid email address';
      if (!formData.receiverPhone.trim()) newErrors.receiverPhone = 'Receiver phone is required';
    }
    // Step 2: Address
    if (!step || step === 2) {
      if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
      else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode) && !/^\d{6}$/.test(formData.zipCode)) newErrors.zipCode = 'Please enter a valid ZIP or PIN code';
    }
    // Step 3: Item Details
    if (!step || step === 3) {
      if (!formData.itemCondition.trim()) newErrors.itemCondition = 'Item condition is required';
      if (!formData.itemDescription.trim()) newErrors.itemDescription = 'Item description is required';
    }
    // Step 4: Preferences (optional, so no required fields)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNextStep = () => {
    if (validateForm(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setSubmitError('');
    if (!validateForm()) {
      console.warn('[SwapRequestForm] Validation errors:', errors);
      toast.error('Please fix the errors before submitting');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to submit swap requests');
      return;
    }

    setIsSubmitting(true);
    try {
      const swapRequestData = {
        itemId,
        receiverDetails: {
          name: formData.receiverName,
          email: formData.receiverEmail,
          phone: formData.receiverPhone
        },
        address: {
          street: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        preferences: {
          contactMethod: formData.preferredContactMethod,
          specialInstructions: formData.specialInstructions,
          preferredDate: formData.preferredSwapDate,
          preferredTime: formData.preferredSwapTime
        },
        itemDetails: {
          condition: formData.itemCondition,
          description: formData.itemDescription,
          images: formData.itemImages
        }
      };

      const response = await apiService.submitSwapRequest(swapRequestData);
      console.log('[SwapRequest] Backend response:', response);
      // Emit real-time event
      if (socket && isConnected) {
        socket.emit('swap-request-submitted', {
          itemId,
          requesterId: user.id,
          requesterName: formData.receiverName,
          ownerId: owner?.id
        });
      }

      setShowSuccess(true);
      toast.success('Swap request submitted successfully!');
      setSubmitError('');
      // Navigate to chat after 2 seconds
      setTimeout(() => {
        navigate(`/swap-chat/${response.swapId || itemId}`);
      }, 2000);

    } catch (error) {
      // Try to parse backend validation errors
      let errorMsg = error.message || 'Failed to submit swap request. Please try again.';
      if (error.response) {
        try {
          const data = await error.response.json();
          if (data.errors && Array.isArray(data.errors)) {
            errorMsg = data.errors.map(e => e.msg).join(' | ');
          } else if (data.message) {
            errorMsg = data.message;
          }
          console.error('[SwapRequest] Backend error response:', data);
        } catch (parseErr) {
          // Ignore JSON parse errors
        }
      }
      setSubmitError(errorMsg);
      toast.error(errorMsg);
      console.error('Submit swap request error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { title: 'Receiver Details', icon: User },
    { title: 'Address Information', icon: MapPin },
    { title: 'Item Details', icon: Package },
    { title: 'Preferences', icon: MessageSquare }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-50">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-navy-600 mx-auto mb-4" />
          <p className="text-navy-600">Loading swap request form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-50 py-8">
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-navy-900 mb-2">Swap Request Submitted!</h2>
              <p className="text-navy-700 text-center mb-4">
                Your swap request for <span className="font-semibold">{item?.title}</span> has been sent to {owner?.firstName} {owner?.lastName}.
              </p>
              <div className="text-sm text-navy-500 text-center">
                You'll be redirected to the chat page shortly...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-navy-600 hover:text-navy-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-navy-900">Swap Request Form</h1>
              <p className="text-navy-600 mt-2">
                Requesting swap for: <span className="font-semibold">{item?.title}</span>
              </p>
            </div>
            
            {item && (
              <div className="flex items-center space-x-4">
                <img 
                  src={item.images?.[0]} 
                  alt={item.title} 
                  className="w-16 h-16 object-cover rounded-lg shadow"
                />
                <div>
                  <p className="font-semibold text-navy-900">{item.title}</p>
                  <p className="text-sm text-navy-500">Owner: {owner?.firstName} {owner?.lastName}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === index + 1;
              const isCompleted = currentStep > index + 1;
              
              return (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive 
                      ? 'border-primary-600 bg-primary-600 text-white' 
                      : isCompleted 
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-navy-200 bg-navy-100 text-navy-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-navy-400'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-navy-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {submitError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center font-medium">
              {submitError}
            </div>
          )}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-navy-900 mb-6 flex items-center">
                    <User className="w-6 h-6 mr-2 text-primary-600" />
                    Receiver Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.receiverName}
                        onChange={(e) => handleInputChange('receiverName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.receiverName ? 'border-red-500' : 'border-navy-200'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.receiverName && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.receiverName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.receiverEmail}
                        onChange={(e) => handleInputChange('receiverEmail', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.receiverEmail ? 'border-red-500' : 'border-navy-200'
                        }`}
                        placeholder="Enter your email address"
                      />
                      {errors.receiverEmail && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.receiverEmail}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.receiverPhone}
                        onChange={(e) => handleInputChange('receiverPhone', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.receiverPhone ? 'border-red-500' : 'border-navy-200'
                        }`}
                        placeholder="Enter your phone number"
                      />
                      {errors.receiverPhone && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.receiverPhone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-navy-900 mb-6 flex items-center">
                    <MapPin className="w-6 h-6 mr-2 text-primary-600" />
                    Address Information
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={formData.streetAddress}
                        onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.streetAddress ? 'border-red-500' : 'border-navy-200'
                        }`}
                        placeholder="Enter your street address"
                      />
                      {errors.streetAddress && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.streetAddress}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                            errors.city ? 'border-red-500' : 'border-navy-200'
                          }`}
                          placeholder="Enter city"
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                            errors.state ? 'border-red-500' : 'border-navy-200'
                          }`}
                          placeholder="Enter state"
                        />
                        {errors.state && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.state}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                            errors.zipCode ? 'border-red-500' : 'border-navy-200'
                          }`}
                          placeholder="Enter ZIP code"
                        />
                        {errors.zipCode && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.zipCode}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Country
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="India">India</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-navy-900 mb-6 flex items-center">
                    <Package className="w-6 h-6 mr-2 text-primary-600" />
                    Item Details
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Item Condition *
                      </label>
                      <select
                        value={formData.itemCondition}
                        onChange={(e) => handleInputChange('itemCondition', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.itemCondition ? 'border-red-500' : 'border-navy-200'
                        }`}
                      >
                        <option value="">Select condition</option>
                        <option value="Like New">Like New</option>
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                      </select>
                      {errors.itemCondition && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.itemCondition}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Item Description *
                      </label>
                      <textarea
                        value={formData.itemDescription}
                        onChange={(e) => handleInputChange('itemDescription', e.target.value)}
                        rows={4}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.itemDescription ? 'border-red-500' : 'border-navy-200'
                        }`}
                        placeholder="Describe the item you want to swap..."
                      />
                      {errors.itemDescription && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.itemDescription}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Item Images (Optional)
                      </label>
                      <div className="border-2 border-dashed border-navy-200 rounded-lg p-6 text-center">
                        <Package className="w-12 h-12 text-navy-400 mx-auto mb-4" />
                        <p className="text-navy-600 mb-2">Upload images of your item</p>
                        <p className="text-sm text-navy-500">Drag and drop or click to browse</p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            // Handle file upload logic here
                            console.log('Files selected:', files);
                          }}
                        />
                        <button className="mt-4 px-4 py-2 bg-navy-100 text-navy-700 rounded-lg hover:bg-navy-200">
                          Choose Files
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-navy-900 mb-6 flex items-center">
                    <MessageSquare className="w-6 h-6 mr-2 text-primary-600" />
                    Preferences & Additional Details
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Preferred Contact Method
                      </label>
                      <select
                        value={formData.preferredContactMethod}
                        onChange={(e) => handleInputChange('preferredContactMethod', e.target.value)}
                        className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="both">Both</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">
                          Preferred Swap Date
                        </label>
                        <input
                          type="date"
                          value={formData.preferredSwapDate}
                          onChange={(e) => handleInputChange('preferredSwapDate', e.target.value)}
                          className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">
                          Preferred Swap Time
                        </label>
                        <input
                          type="time"
                          value={formData.preferredSwapTime}
                          onChange={(e) => handleInputChange('preferredSwapTime', e.target.value)}
                          className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Special Instructions
                      </label>
                      <textarea
                        value={formData.specialInstructions}
                        onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Any special instructions or preferences for the swap..."
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-navy-200">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium ${
                currentStep === 1
                  ? 'bg-navy-100 text-navy-400 cursor-not-allowed'
                  : 'bg-navy-100 text-navy-700 hover:bg-navy-200'
              }`}
            >
              Previous
            </button>

            <div className="flex space-x-4">
              {currentStep < steps.length ? (
                <button
                  onClick={handleNextStep}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-lg font-medium flex items-center ${
                    isSubmitting
                      ? 'bg-navy-400 text-white cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Swap Request'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapRequestForm; 