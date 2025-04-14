import React from 'react';

const InternshipCard = ({ internship, onClick }) => {
  const formatDateRange = () => {
    try {
      const dateAppliedStr = internship.dateApplied || internship.startDate || '';
      const deadlineStr = internship.deadline || internship.endDate || '';
      
      if (!dateAppliedStr || !deadlineStr) {
        return "Dates not specified";
      }
      
      const dateApplied = new Date(dateAppliedStr);
      const deadline = new Date(deadlineStr);
      
      if (isNaN(dateApplied.getTime()) || isNaN(deadline.getTime())) {
        return "Invalid date format";
      }
      
      const appliedMonth = dateApplied.toLocaleString('default', { month: 'short' });
      const appliedYear = dateApplied.getFullYear();
      
      const deadlineMonth = deadline.toLocaleString('default', { month: 'short' });
      const deadlineYear = deadline.getFullYear();
      
      return `${appliedMonth} ${appliedYear} | ${deadlineMonth} ${deadlineYear}`;
    } catch (e) {
      console.error("Error formatting dates:", e);
      return "Date error";
    }
  };

  const getProgressColor = () => {
    switch (internship.progress) {
      case 'All Statuses':
        return 'border-gray-200';
      case 'Planning to Apply':
        return 'border-gray-300';
      case 'Applying':
        return 'border-blue-500';
      case 'Applied':
        return 'border-blue-500';
      case 'Online Assessment':
        return 'border-purple-500'
      case 'Phone Call':
        return 'border-purple-500';
      case 'Interview':
        return 'border-yellow-500';
      case 'Rejected':
        return 'border-red-500';
      case 'Offer':
        return 'border-green-500';
      case 'Accepted':
        return 'border-green-700';
      case 'Turned Down':
        return 'border-orange-500';
      case 'Completed':
        return 'border-green-500';
      case 'In Progress':
        return 'border-blue-500';
      case 'Upcoming':
        return 'border-yellow-500';
      default:
        return 'border-gray-300';
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl border-t-4 ${getProgressColor()}`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="w-12 h-12 mr-3 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
            <img 
              src={internship.logoUrl} 
              alt={`${internship.companyName} logo`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/internship.png';
              }}
            />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{internship.companyName}</h3>
            <p className="text-sm text-gray-600 line-clamp-1">{internship.positionTitle}</p>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span className="truncate">{internship.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span>{formatDateRange()}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <span className="text-sm font-medium text-gray-700">{internship.pay}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            internship.progress === 'All Statuses' ? 'bg-gray-100 text-gray-800' :
            internship.progress === 'Planning to Apply' ? 'bg-gray-100 text-gray-800' :
            internship.progress === 'Applying' ? 'bg-blue-100 text-blue-800' :
            internship.progress === 'Applied' ? 'bg-blue-200 text-blue-900' :
            internship.progress === 'Phone Call' ? 'bg-purple-100 text-purple-800' :
            internship.progress === 'Online Assessment' ? 'bg-purple-100 text-purple-800' :
            internship.progress === 'Interviewing' ? 'bg-yellow-100 text-yellow-800' :
            internship.progress === 'Rejected' ? 'bg-red-100 text-red-800' :
            internship.progress === 'Offer' ? 'bg-green-100 text-green-800' :
            internship.progress === 'Accepted' ? 'bg-green-200 text-green-900' :
            internship.progress === 'Completed' ? 'bg-green-100 text-green-800' :
            internship.progress === 'In Progress' ? 'bg-blue-100 text-blue-800' :
            internship.progress === 'Upcoming' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {internship.progress}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InternshipCard;