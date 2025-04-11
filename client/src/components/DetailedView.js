import React, { useState } from 'react';

const DetailedView = ({ internship, onClose, onUpdateProgress }) => {
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  
  // Return null early if no internship is provided, but after hooks
  if (!internship) return null;

  // Format date to show Month Day, Year with safe handling
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Not specified";
      
      const date = new Date(dateString);
      
      // Check for invalid date
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Date error";
    }
  };

  // Get background color based on progress status
  const getProgressColor = () => {
    switch (internship.progress) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800';
      case 'Phone Call':
        return 'bg-purple-100 text-purple-800';
      case 'Interview':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Offer':
        return 'bg-green-100 text-green-800';
      case 'Accepted':
        return 'bg-green-200 text-green-900';
      case 'Turned Down':
        return 'bg-orange-100 text-orange-800';
      // Maintain compatibility with old statuses
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Upcoming':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Handle progress change
  const handleProgressChange = (e) => {
    const newProgress = e.target.value;
    onUpdateProgress(internship.id, newProgress);
    setIsEditingProgress(false);
  };

  return (
    <div className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="w-20 h-20 mr-6 bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src={internship.logoUrl} 
                alt={`${internship.companyName} logo`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // If image fails to load, replace with default
                  e.target.onerror = null;
                  e.target.src = '/internship.png';
                }}
              />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{internship.companyName}</h1>
              <h2 className="text-xl text-gray-700 mb-2">{internship.positionTitle}</h2>
              
              <div className="flex items-center space-x-4 mb-1">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>{internship.location}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{internship.pay}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>
                    Applied: {formatDate(internship.dateApplied || internship.startDate)} | 
                    Deadline: {formatDate(internship.deadline || internship.endDate)}
                  </span>
                </div>
                
                {isEditingProgress ? (
                  <div className="relative">
                    <select
                      value={internship.progress}
                      onChange={handleProgressChange}
                      onBlur={() => setIsEditingProgress(false)}
                      autoFocus
                      className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
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
                ) : (
                  <span 
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getProgressColor()} cursor-pointer flex items-center`}
                    onClick={() => setIsEditingProgress(true)}
                  >
                    {internship.progress}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {internship.notes && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Notes</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line">{internship.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedView;