import React, { useState, useEffect } from 'react';

const AddInternshipModal = ({ isOpen, onClose, onAddInternship, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    positionTitle: '',
    location: '',
    pay: '',
    dateApplied: '',
    deadline: '',
    progress: 'All Statuses',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [showDeadlineFields, setShowDeadlineFields] = useState(false);
  const [wantsReminder, setWantsReminder] = useState(false);

  useEffect(() => {
    if (isOpen && !isEditing) {
      setFormData({
        companyName: '',
        positionTitle: '',
        location: '',
        pay: '',
        dateApplied: '',
        deadline: '',
        progress: 'All Statuses',
        notes: ''
      });
      setShowDeadlineFields(false);
      setWantsReminder(false);
      setErrors({});
    }
    else if (isOpen && isEditing && initialData) {
      setFormData({
        companyName: initialData.companyName || '',
        positionTitle: initialData.positionTitle || '',
        location: initialData.location || '',
        pay: initialData.pay || '',
        dateApplied: initialData.dateApplied || '',
        deadline: initialData.deadline || '',
        progress: initialData.progress || 'All Statuses',
        notes: initialData.notes || ''
      });
      
      if (initialData.progress === 'Planning to Apply' || initialData.progress === 'Applying') {
        setShowDeadlineFields(true);
        setWantsReminder(initialData.wantsReminder || false);
      } else {
        setShowDeadlineFields(false);
        setWantsReminder(false);
      }
    }
  }, [isOpen, isEditing, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'progress') {
      if (value === 'Planning to Apply' || value === 'Applying') {
        setShowDeadlineFields(true);
      } else {
        setShowDeadlineFields(false);
        setWantsReminder(false);
      }
    }
  
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
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
    
    if (showDeadlineFields) {
      if (!formData.deadline) {
        newErrors.deadline = 'Deadline is required';
      } else if (formData.dateApplied && new Date(formData.deadline) < new Date(formData.dateApplied)) {
        newErrors.deadline = 'Deadline cannot be before date applied';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAddInternship({ 
        ...formData, 
        wantsReminder,
        id: isEditing && initialData ? initialData.id : null
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditing ? 'Edit Internship' : 'Add New Internship'}
            </h2>
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="dateApplied">
                  Date Applied
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
                    <option value="All Statuses">All Statuses</option>
                    <option value="Planning to Apply">Planning to Apply</option>
                    <option value="Applying">Applying</option>
                    <option value="Applied">Applied</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="Online Assessment">Online Assessment</option>
                    <option value="Interview">Interview</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Offer">Offer</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Turned Down">Turned Down</option>
                  </select>
                </div>

                {showDeadlineFields && (
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="deadline">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    disabled={!showDeadlineFields}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${showDeadlineFields ? 'border-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                    `}
                  />
                  {errors.deadline && (
                    <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
                  )}
                
                  <div className="flex items-center mt-3">
                    <input
                      type="checkbox"
                      id="wantsReminder"
                      checked={wantsReminder}
                      onChange={(e) => setWantsReminder(e.target.checked)}
                      disabled={!showDeadlineFields}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="wantsReminder" className={`ml-2 text-sm ${showDeadlineFields ? 'text-gray-700' : 'text-gray-400'}`}>
                      Send me email reminders
                    </label>
                  </div>
                </div>
                )}
              </div>
            
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
                {isEditing ? 'Update Internship' : 'Add Internship'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddInternshipModal;