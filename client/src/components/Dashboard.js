import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import AddInternshipModal from './AddInternshipModal';
import DetailedView from './DetailedView';
import { Calendar, Clock, MapPin, Briefcase, Edit, Trash2, PlusCircle, Search } from 'lucide-react';
import { FirebaseService } from '../services/FirebaseService';
import { useAuth } from '../AuthContext';

const Dashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchInternships = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userInternships = await FirebaseService.getUserInternships(currentUser.uid);
        setInternships(userInternships);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching internships:", err);
        setError("Failed to load internships. Please try again later.");
        setLoading(false);
      }
    };

    fetchInternships();
  }, [currentUser]);

  useEffect(() => {
    if (!internships) return;
    
    let results = [...internships];
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(
        internship => (
          (internship.companyName && internship.companyName.toLowerCase().includes(searchLower)) ||
          (internship.positionTitle && internship.positionTitle.toLowerCase().includes(searchLower)) ||
          (internship.location && internship.location.toLowerCase().includes(searchLower))
        )
      );
    }
    
    if (filter !== 'all') {
      results = results.filter(internship => 
        internship.progress && internship.progress.toLowerCase().replace(/\s+/g, '') === filter
      );
    }
    
    results.sort((a, b) => {
      switch (sortBy) {
        case 'date': {
          const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000) : new Date(0);
          return dateB - dateA;
        }
        case 'company':
          return (a.companyName || '').localeCompare(b.companyName || '');
        case 'status': {
          const statusOrder = {
            'planningtoapply': 1,
            'applying': 2,
            'applied': 3,
            'phonecall': 4,
            'onlineassessment': 5,
            'interview': 6,
            'offer': 7,
            'accepted': 8,
            'rejected': 9,
            'turneddown': 10,
            'all': 11
          };
          
          const statusA = a.progress ? a.progress.toLowerCase().replace(/\s+/g, '') : 'all';
          const statusB = b.progress ? b.progress.toLowerCase().replace(/\s+/g, '') : 'all';
          
          return (statusOrder[statusA] || 99) - (statusOrder[statusB] || 99);
        }
        default:
          return 0;
      }
    });
    
    setFilteredInternships(results);
  }, [internships, searchTerm, filter, sortBy]);

  const handleOpenAddModal = () => {
    setSelectedInternship(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (internship) => {
    setSelectedInternship(internship);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleAddInternship = async (internshipData) => {
    try {
      const newInternship = await FirebaseService.addInternship(currentUser.uid, internshipData);
      
      if (!newInternship.id) {
        console.error("Added internship is missing ID:", newInternship);
        alert("Error: Failed to add internship properly. Please try again.");
        return;
      }
      
      console.log("Successfully added internship with ID:", newInternship.id);
      
      setInternships(prev => [newInternship, ...prev]);
      handleCloseAddModal();
    } catch (err) {
      console.error("Error adding internship:", err);
      alert("Failed to add internship. Please try again.");
    }
  };

  const handleUpdateInternship = async (updatedData) => {
    try {
      if (!selectedInternship || !selectedInternship.id) {
        console.error("No internship selected for update or missing ID");
        alert("Failed to update internship: No internship selected.");
        return;
      }
      
      const updated = await FirebaseService.updateInternship(selectedInternship.id, updatedData);
      setInternships(prev => 
        prev.map(item => item.id === selectedInternship.id ? updated : item)
      );
      handleCloseEditModal();
    } catch (err) {
      console.error("Error updating internship:", err);
      alert("Failed to update internship. Please try again.");
    }
  };

  const handleDeleteInternship = async (internshipId) => {
    if (!internshipId) {
      console.error('No internship ID provided for deletion');
      alert('Error: Cannot delete this internship. ID is missing.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this internship?')) {
      try {
        console.log('Attempting to delete internship with ID:', internshipId);
        await FirebaseService.deleteInternship(internshipId);
        
        console.log('Delete successful, updating local state...');
        
        setInternships(prevInternships => {
          return prevInternships.filter(item => item.id !== internshipId);
        });
        
        if (selectedInternship && selectedInternship.id === internshipId) {
          setSelectedInternship(null);
        }
      } catch (err) {
        console.error("Error deleting internship:", err);
        alert("Failed to delete internship. Please try again.");
      }
    }
  };

  const handleUpdateProgress = async (internshipId, progress) => {
    try {
      if (!internshipId) {
        console.error("No internship ID provided for progress update");
        return;
      }
      
      await FirebaseService.updateInternshipProgress(internshipId, progress);
      setInternships(prev => 
        prev.map(item => item.id === internshipId ? {...item, progress} : item)
      );
    } catch (err) {
      console.error("Error updating progress:", err);
      alert("Failed to update progress. Please try again.");
    }
  };

  const StatusBadge = ({ status }) => {
    const statusDisplayNames = {
      all: "All Statuses",
      planningtoapply: "Planning to Apply",
      applying: "Applying",
      applied: "Applied",
      phonecall: "Phone Call",
      onlineassessment: "Online Assessment",
      interview: "Interview",
      offer: "Offer",
      accepted: "Accepted",
      rejected: "Rejected",
      turneddown: "Turned Down"
    };
    
    const statusStyles = {
      planningtoapply: "bg-gray-50 text-gray-800",
      applying: "bg-blue-50 text-blue-800",
      applied: "bg-blue-100 text-blue-800",
      onlineassessment: "bg-purple-50 text-purple-800",
      phonecall: "bg-purple-50 text-purple-800",
      interview: "bg-yellow-50 text-yellow-800",
      offer: "bg-green-50 text-green-800",
      rejected: "bg-red-50 text-red-800",
      accepted: "bg-green-100 text-green-900",
      turneddown: "bg-orange-50 text-orange-800",
      all: "bg-gray-100 text-gray-800"
    };
    
    const normalizedStatus = status ? status.toLowerCase().replace(/\s+/g, '') : 'all';
    const displayName = statusDisplayNames[normalizedStatus] || status;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[normalizedStatus] || "bg-gray-100 text-gray-800"}`}>
        {displayName}
      </span>
    );
  };

  const handleSelectInternship = (internship) => {
    setSelectedInternship(internship);
  };

  const handleCloseDetailedView = () => {
    setSelectedInternship(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading your internships...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-red-50 p-6 rounded-lg shadow-sm max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Data</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onOpenAddModal={handleOpenAddModal} />
      
      {selectedInternship && (
        <DetailedView 
          internship={selectedInternship} 
          onClose={handleCloseDetailedView}
          onUpdateProgress={handleUpdateProgress}
        />
      )}
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Your Internship Dashboard</h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Internship
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search internships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="planningtoapply">Planning to Apply</option>
                <option value="applying">Applying</option>
                <option value="applied">Applied</option>
                <option value="phonecall">Phone Call</option>
                <option value="onlineassessment">Online Assessment</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="turneddown">Turned Down</option>
              </select>
              
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date">Sort by Date Added</option>
                <option value="company">Sort by Company</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
          </div>

          {internships.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-1">No internships added yet</h3>
              <p className="text-gray-500 mb-4">Get started by adding your first internship application</p>
              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Add Your First Internship
              </button>
            </div>
          ) : filteredInternships.length === 0 ? (
            <div className="text-center py-12">
              <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-1">No matching internships found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInternships.map((internship) => (
                <div key={internship.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div 
                    className="p-5 cursor-pointer"
                    onClick={() => handleSelectInternship(internship)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{internship.positionTitle}</h3>
                      <StatusBadge status={internship.progress} />
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-1">
                      <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4" />
                      <span className="text-sm">{internship.companyName}</span>
                    </div>
                    
                    {internship.location && (
                      <div className="flex items-center text-gray-600 mb-1">
                        <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        <span className="text-sm">{internship.location}</span>
                      </div>
                    )}
                    
                    {internship.dateApplied && (
                      <div className="flex items-center text-gray-600 mb-1">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        <span className="text-sm">Applied: {new Date(internship.dateApplied).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {internship.pay && (
                      <div className="flex items-center text-gray-600 mb-1">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        <span className="text-sm">{internship.pay}</span>
                      </div>
                    )}
                    
                    {internship.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-600 line-clamp-2">{internship.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditModal(internship);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (internship && internship.id) {
                          console.log('Delete button clicked for internship ID:', internship.id);
                          handleDeleteInternship(internship.id);
                        } else {
                          console.error('Missing internship ID for deletion:', internship);
                          alert('Error: Cannot delete this internship. ID is missing.');
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddInternshipModal 
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAddInternship={handleAddInternship}
        isEditing={false}
      />

      {selectedInternship && (
        <AddInternshipModal 
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onAddInternship={handleUpdateInternship}
          initialData={selectedInternship}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default Dashboard;