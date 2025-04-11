import React, { useState, useRef } from 'react';

const AddInternshipModal = ({ onClose, onAddInternship }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    positionTitle: '',
    location: '',
    pay: '',
    dateApplied: '',
    deadline: '',
    progress: 'Applied',
    notes: '',
    logoUrl: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store the file in the form data
      setFormData(prev => ({
        ...prev,
        logoUrl: file
      }));
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      logoUrl: null
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.positionTitle.trim()) {
      newErrors.positionTitle = 'Position title is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.dateApplied) {
      newErrors.dateApplied = 'Date applied is required';
    }
    
    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else if (formData.dateApplied && new Date(formData.deadline) < new Date(formData.dateApplied)) {
      newErrors.deadline = 'Deadline cannot be before date applied';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAddInternship(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add New Internship</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="companyName">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.companyName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g. Google"
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
                )}
              </div>
              
              {/* Position Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="positionTitle">
                  Position Title *
                </label>
                <input
                  type="text"
                  id="positionTitle"
                  name="positionTitle"
                  value={formData.positionTitle}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.positionTitle ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g. Software Engineering Intern"
                />
                {errors.positionTitle && (
                  <p className="mt-1 text-sm text-red-600">{errors.positionTitle}</p>
                )}
              </div>
              
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g. Mountain View, CA"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>
              
              {/* Pay */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="pay">
                  Pay
                </label>
                <input
                  type="text"
                  id="pay"
                  name="pay"
                  value={formData.pay}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. $25/hour or $5000/month"
                />
              </div>
              
              {/* Date Applied */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="dateApplied">
                  Date Applied *
                </label>
                <input
                  type="date"
                  id="dateApplied"
                  name="dateApplied"
                  value={formData.dateApplied}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.dateApplied ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.dateApplied && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateApplied}</p>
                )}
              </div>
              
              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="deadline">
                  Deadline *
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.deadline ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.deadline && (
                  <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
                )}
              </div>
              
              {/* Progress */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="progress">
                  Progress
                </label>
                <select
                  id="progress"
                  name="progress"
                  value={formData.progress}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Applied">Applied</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="Interview">Interview</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Offer">Offer</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Turned Down">Turned Down</option>
                </select>
              </div>
            </div>
            
            {/* Company Logo/Image */}
            <div className="col-span-2 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Logo (Optional)
              </label>
              
              <div className="flex items-start space-x-4">
                {/* Image Preview */}
                <div className="w-24 h-24 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Company logo preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                
                {/* Upload Controls */}
                <div className="flex-1">
                  <input
                    type="file"
                    id="logoUrl"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <div className="flex flex-col space-y-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Choose Image
                    </button>
                    
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Remove
                      </button>
                    )}
                    
                    <p className="text-xs text-gray-500">
                      Upload a company logo or relevant image. If none is provided, a default image will be used.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Notes */}
            <div className="col-span-2 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add any additional notes or details about this internship..."
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Internship
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddInternshipModal;