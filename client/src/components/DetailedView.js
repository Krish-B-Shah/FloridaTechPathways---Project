import React, { useState } from 'react';
import { Calendar, Clock, MapPin, DollarSign, FileText } from 'lucide-react';

const DetailedView = ({ internship, onClose, onUpdateProgress }) => {
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  
  if (!internship) return null;

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Not specified";
      
      const date = new Date(dateString);
      
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

  const getProgressColor = () => {
    const progressMap = {
      'Applied': 'bg-blue-100 text-blue-800',
      'Phone Call': 'bg-purple-100 text-purple-800',
      'Online Assessment': 'bg-purple-100 text-purple-800',
      'Interview': 'bg-yellow-100 text-yellow-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Offer': 'bg-green-100 text-green-800',
      'Accepted': 'bg-green-200 text-green-900',
      'Turned Down': 'bg-orange-100 text-orange-800',
      'Planning to Apply': 'bg-gray-100 text-gray-800',
      'Applying': 'bg-blue-50 text-blue-800',
      'All Statuses': 'bg-gray-100 text-gray-800',
    };
    
    return progressMap[internship.progress] || 'bg-gray-100 text-gray-800';
  };
  
  const handleProgressChange = (e) => {
    const newProgress = e.target.value;
    onUpdateProgress(internship.id, newProgress);
    setIsEditingProgress(false);
  };

  return (
    <div className="fixed inset-0 z-40 overflow-auto bg-gray-900 bg-opacity-50">
      <div className="bg-white shadow-lg border-b border-gray-200 max-w-5xl mx-auto mt-16 rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{internship.companyName}</h1>
              <h2 className="text-xl text-gray-700 mb-2">{internship.positionTitle}</h2>
              
              <div className="flex flex-wrap items-center gap-4 mb-1">
                {internship.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-1" />
                    <span>{internship.location}</span>
                  </div>
                )}
                
                {internship.pay && (
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-5 h-5 mr-1" />
                    <span>{internship.pay}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mt-2">
                {internship.dateApplied && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-1" />
                    <span>Applied: {formatDate(internship.dateApplied)}</span>
                  </div>
                )}
                
                {internship.deadline && (
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-1" />
                    <span>Deadline: {formatDate(internship.deadline)}</span>
                  </div>
                )}
                
                <div className="mt-2">
                  {isEditingProgress ? (
                    <div className="relative">
                      <select
                        value={internship.progress}
                        onChange={handleProgressChange}
                        onBlur={() => setIsEditingProgress(false)}
                        autoFocus
                        className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
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
            
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          {internship.notes && (
            <div className="mt-8">
              <h3 className="flex items-center text-xl font-semibold text-gray-800 mb-3">
                <FileText className="w-5 h-5 mr-2" />
                Notes
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">{internship.notes}</p>
              </div>
            </div>
          )}
          
          {internship.wantsReminder && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-blue-700 text-sm">
                <span className="font-medium">Reminder enabled:</span> You'll receive email reminders about this application.
              </p>
            </div>
          )}
          
          <div className="mt-8 flex justify-end">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedView;