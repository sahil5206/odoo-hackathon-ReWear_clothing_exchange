import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Plus, Tag, Package, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import toast from 'react-hot-toast';

const AddItemPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    size: '',
    condition: '',
    tags: [],
    points: 0
  });
  const [images, setImages] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const categories = [
    'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear', 'Accessories'
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

  const conditions = ['Like New', 'Excellent', 'Good', 'Fair'];

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 5
  });

  const removeImage = (index) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      return newImages;
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.size) newErrors.size = 'Size is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (formData.points < 0) newErrors.points = 'Points must be positive';
    if (images.length === 0) newErrors.images = 'At least one image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Convert images to base64 for demo (in real app, upload to cloud storage)
      const imageUrls = images.map(img => img.preview);
      
      const itemData = {
        ...formData,
        images: imageUrls,
        points: parseInt(formData.points)
      };

      const response = await apiService.createItem(itemData);
      toast.success('Item listed successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to create item');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-earth-900 mb-2">List a New Item</h1>
          <p className="text-earth-600">Share your sustainable fashion pieces with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Photos</h2>
            <p className="text-earth-600 mb-4">Upload up to 5 photos of your item</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upload Area */}
              <div>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-primary-400 bg-primary-50'
                      : 'border-earth-300 hover:border-primary-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 text-earth-400 mx-auto mb-4" />
                  {isDragActive ? (
                    <p className="text-primary-600">Drop the files here...</p>
                  ) : (
                    <div>
                      <p className="text-earth-600 mb-2">
                        Drag & drop images here, or click to select
                      </p>
                      <p className="text-sm text-earth-500">
                        PNG, JPG, WEBP up to 5MB each
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview Area */}
              <div>
                <h3 className="text-sm font-medium text-earth-700 mb-3">Preview</h3>
                <div className="grid grid-cols-2 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Item Details */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Item Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-earth-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="input-field"
                  placeholder="e.g., Vintage Denim Jacket"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-earth-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="input-field"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="size" className="block text-sm font-medium text-earth-700 mb-2">
                  Size *
                </label>
                <select
                  id="size"
                  name="size"
                  required
                  className="input-field"
                  value={formData.size}
                  onChange={handleChange}
                >
                  <option value="">Select size</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-earth-700 mb-2">
                  Condition *
                </label>
                <select
                  id="condition"
                  name="condition"
                  required
                  className="input-field"
                  value={formData.condition}
                  onChange={handleChange}
                >
                  <option value="">Select condition</option>
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-earth-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                className="input-field"
                placeholder="Describe your item in detail..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="mt-6">
              <label htmlFor="points" className="block text-sm font-medium text-earth-700 mb-2">
                Points Value *
              </label>
              <input
                type="number"
                id="points"
                name="points"
                required
                min="0"
                className="input-field"
                placeholder="Enter points value"
                value={formData.points}
                onChange={handleChange}
              />
              <p className="text-sm text-earth-500 mt-1">
                Suggested: 50-300 points based on item value and condition
              </p>
            </div>
          </div>

          {/* Tags Section */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-earth-900 mb-4">Tags</h2>
            <p className="text-earth-600 mb-4">Add tags to help others find your item</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 hover:text-primary-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="input-field flex-1"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="btn-primary ml-2 px-4"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="btn-outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || images.length === 0}
              className="btn-primary flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 mr-2" />
                  List Item
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemPage; 