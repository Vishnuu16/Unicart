import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData);
      toast.success('Message sent successfully!');
      
      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } else {
      toast.error('Please enter value');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Get In Touch</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We'd love to hear from you! Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Contact Info */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="flex items-start">
            <div className="bg-primary text-white rounded-full p-3 mr-4 flex-shrink-0">
              <FaEnvelope className="text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Email</h3>
              <p className="text-gray-600">unicart@gmail.com</p>
              <p className="text-gray-600">unicartsupport@gmail.com</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-primary text-white rounded-full p-3 mr-4 flex-shrink-0">
              <FaPhone className="text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Phone</h3>
              <p className="text-gray-600">+1 (123) 456-7890</p>
              <p className="text-gray-600">+1 (987) 654-3210</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-primary text-white rounded-full p-3 mr-4 flex-shrink-0">
              <FaMapMarkerAlt className="text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Address</h3>
              <p className="text-gray-600">123 Business Avenue</p>
              <p className="text-gray-600">Chennai, TN 600001</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form 
          onSubmit={handleSubmit}
          className="w-full lg:w-1/2 bg-gray-50 p-8 rounded-lg shadow-md"
          noValidate
        >
          <div className="mb-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              required
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>
          <div className="mb-6">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>
          <div className="mb-6">
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="mb-6">
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              required
            ></textarea>
            {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dull text-white px-6 py-3 rounded-md transition duration-300 flex items-center justify-center gap-2"
          >
            <FaPaperPlane /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;