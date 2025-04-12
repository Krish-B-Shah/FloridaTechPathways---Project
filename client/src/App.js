// src/App.js
import React, { useState, useEffect } from 'react';
import SignUp from './components/SignUp';
import InternshipGrid from './components/InternshipGrid';
import DetailedView from './components/DetailedView';
import AddInternshipModal from './components/AddInternshipModal';
import Navbar from './components/Navbar';
import './App.css';

// Sample initial data
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
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [internships, setInternships] = useState(() => {
    try {
      const saved = localStorage.getItem('internships');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map(i => ({
          ...i,
          dateApplied: i.dateApplied || i.startDate,
          deadline: i.deadline || i.endDate,
        }));
      }
      return initialInternships;
    } catch (err) {
      console.error("Error loading internships:", err);
      return initialInternships;
    }
  });

  const [selectedInternship, setSelectedInternship] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('internships', JSON.stringify(internships));
  }, [internships]);

  const handleSelectInternship = (internship) => {
    setSelectedInternship(internship);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddInternship = (newInternship) => {
    const newId = internships.length ? Math.max(...internships.map(i => i.id)) + 1 : 1;
    let logoUrl = '/internship.png';

    if (newInternship.logoUrl) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(newInternship.logoUrl);
        reader.onloadend = () => {
          const internshipWithImage = {
            ...newInternship,
            id: newId,
            logoUrl: reader.result,
          };
          setInternships(prev => [...prev, internshipWithImage]);
          if (!internships.length) setSelectedInternship(internshipWithImage);
        };
      } catch (err) {
        console.error("Error with image:", err);
        setInternships(prev => [...prev, {
          ...newInternship,
          id: newId,
          logoUrl
        }]);
      }
    } else {
      const internshipWithId = {
        ...newInternship,
        id: newId,
        logoUrl
      };
      setInternships(prev => [...prev, internshipWithId]);
      setSelectedInternship(internshipWithId);
    }

    setIsAddModalOpen(false);
  };

  const handleUpdateProgress = (id, newProgress) => {
    const updated = internships.map(i =>
      i.id === id ? { ...i, progress: newProgress } : i
    );
    setInternships(updated);
    if (selectedInternship?.id === id) {
      setSelectedInternship({ ...selectedInternship, progress: newProgress });
    }
  };

  if (!isSignedUp) {
    return <SignUp onSubmit={() => setIsSignedUp(true)} />;
  }

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
