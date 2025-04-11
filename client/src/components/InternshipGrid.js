import React from 'react';
import InternshipCard from './InternshipCard';

const InternshipGrid = ({ internships, onSelectInternship }) => {
  if (internships.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">No internships found</h2>
        <p className="text-gray-500">
          You haven't added any internships yet. Click on "Add Internship" to get started!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Internships</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {internships.map((internship) => (
          <InternshipCard 
            key={internship.id} 
            internship={internship} 
            onClick={() => onSelectInternship(internship)}
          />
        ))}
      </div>
    </div>
  );
};

export default InternshipGrid;