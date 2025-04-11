import React, { useState, useEffect } from 'react';
import InternshipGrid from './components/InternshipGrid';
import DetailedView from './components/DetailedView';
import AddInternshipModal from './components/AddInternshipModal';
import Navbar from './components/Navbar';

// Sample initial data - in a real app, this would come from an API or local storage
const initialInternships = [
  {
    id: 1,
    companyName: 'Google',
    positionTitle: 'Software Engineering Intern',
    location: 'Mountain View, CA',
    pay: '$45/hour',
    dateApplied: '2024-01-15',
    deadline: '2024-02-15',
    progress: 'Accepted',
    notes: 'Worked on the Google Maps team. Implemented new features for the mobile app.',
    logoUrl: '/api/placeholder/200/200'
  },
  {
    id: 2,
    companyName: 'Microsoft',
    positionTitle: 'Product Management Intern',
    location: 'Redmond, WA',
    pay: '$42/hour',
    dateApplied: '2023-07-01',
    deadline: '2023-08-01',
    progress: 'Offer',
    notes: 'Contributed to the Office 365 product suite. Led a project on user engagement.',
    logoUrl: '/api/placeholder/200/200'
  },
  {
    id: 3,
    companyName: 'Amazon',
    positionTitle: 'Data Science Intern',
    location: 'Seattle, WA',
    pay: '$40/hour',
    dateApplied: '2022-11-10',
    deadline: '2022-12-10',
    progress: 'Rejected',
    notes: 'Analyzed customer purchasing patterns. Built predictive models for product recommendations.',
    logoUrl: '/api/placeholder/200/200'
  },
  {
    id: 4,
    companyName: 'Apple',
    positionTitle: 'UX Design Intern',
    location: 'Cupertino, CA',
    pay: '$43/hour',
    dateApplied: '2022-04-01',
    deadline: '2022-05-01',
    progress: 'Interview',
    notes: 'Redesigned components of the Apple Music interface. Conducted user research and testing.',
    logoUrl: '/api/placeholder/200/200'
  }
];

function App() {
  // State management
  const [internships, setInternships] = useState(() => {
    try {
      // Try to load from localStorage first
      const savedInternships = localStorage.getItem('internships');
      
      if (savedInternships) {
        // Parse saved data
        const parsedData = JSON.parse(savedInternships);
        
        // Check if we need to migrate old data format to new format
        const migratedData = parsedData.map(internship => {
          const newInternship = { ...internship };
          
          // If we have old field names but not new ones, migrate the data
          if ((internship.startDate || internship.endDate) && 
              (!internship.dateApplied || !internship.deadline)) {
            newInternship.dateApplied = internship.startDate;
            newInternship.deadline = internship.endDate;
          }
          
          return newInternship;
        });
        
        return migratedData;
      }
      
      return initialInternships;
    } catch (error) {
      console.error("Error loading internships from localStorage:", error);
      return initialInternships;
    }
  });
  
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Save to localStorage whenever internships change
  useEffect(() => {
    localStorage.setItem('internships', JSON.stringify(internships));
  }, [internships]);

  // Handler for selecting an internship to view details
  const handleSelectInternship = (internship) => {
    setSelectedInternship(internship);
    // Scroll to top to show the detailed view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler for adding a new internship
  const handleAddInternship = (newInternship) => {
    const newId = internships.length > 0 
      ? Math.max(...internships.map(i => i.id)) + 1 
      : 1;
    
    // Process the logo file if it exists
    let logoUrl = '/internship.png'; // Default image
    
    if (newInternship.logoUrl) {
      // In a real app, you would upload this to a server and get back a URL
      // For this demo, we'll use the FileReader result directly
      // In production, you'd want to store the file somewhere and use a permanent URL
      try {
        const reader = new FileReader();
        reader.readAsDataURL(newInternship.logoUrl);
        reader.onloadend = () => {
          const base64data = reader.result;
          
          // Create updated internship with the image data
          const internshipWithImage = {
            ...newInternship,
            id: newId,
            logoUrl: base64data,
          };
          
          // Update state with the image
          setInternships(prevInternships => [...prevInternships, internshipWithImage]);
          
          // If this is the first internship added, select it
          if (internships.length === 0) {
            setSelectedInternship(internshipWithImage);
          }
        };
      } catch (error) {
        console.error("Error processing image:", error);
        // Continue with default image if there's an error
        const internshipWithId = {
          ...newInternship,
          id: newId,
          logoUrl: logoUrl, // Default image
        };
        
        setInternships(prevInternships => [...prevInternships, internshipWithId]);
      }
    } else {
      // No custom image, use default
      const internshipWithId = {
        ...newInternship,
        id: newId,
        logoUrl: logoUrl, // Default image
      };
      
      setInternships([...internships, internshipWithId]);
      setSelectedInternship(internshipWithId);
    }
    
    setIsAddModalOpen(false);
  };
  
  // Handler for updating internship progress
  const handleUpdateProgress = (internshipId, newProgress) => {
    const updatedInternships = internships.map(internship => 
      internship.id === internshipId 
        ? { ...internship, progress: newProgress } 
        : internship
    );
    
    setInternships(updatedInternships);
    
    // Update the selected internship if it's the one being modified
    if (selectedInternship && selectedInternship.id === internshipId) {
      setSelectedInternship({ ...selectedInternship, progress: newProgress });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />
      
      {selectedInternship && (
        <DetailedView 
          internship={selectedInternship} 
          onClose={() => setSelectedInternship(null)} 
          onUpdateProgress={handleUpdateProgress}
        />
      )}
      
      <div className="container mx-auto px-4 py-8">
        <InternshipGrid 
          internships={internships} 
          onSelectInternship={handleSelectInternship} 
        />
      </div>
      
      {isAddModalOpen && (
        <AddInternshipModal 
          onClose={() => setIsAddModalOpen(false)} 
          onAddInternship={handleAddInternship} 
        />
      )}
    </div>
  );
}

export default App;