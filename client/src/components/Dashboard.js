import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Modal from './Modal';
import { Calendar, Clock, MapPin, Briefcase, Edit, Trash2, PlusCircle, Search } from 'lucide-react';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [internships, setInternships] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    duration: '',
    status: 'applied',
    notes: ''
  });

  // Load data from localStorage when component mounts
  useEffect(() => {
    const savedInternships = localStorage.getItem('internships');
    if (savedInternships) {
      setInternships(JSON.parse(savedInternships));
    }
  }, []);

  // Save to localStorage whenever internships change
  useEffect(() => {
    localStorage.setItem('internships', JSON.stringify(internships));
  }, [internships]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme); // Save theme to localStorage
  }, [theme]);

  const handleOpenAddModal = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      startDate: '',
      duration: '',
      status: 'applied',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenEditModal = (index) => {
    setEditIndex(index);
    setFormData(internships[index]);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditIndex(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddInternship = () => {
    if (formData.title.trim() && formData.company.trim()) {
      const newInternship = {
        ...formData,
        createdAt: new Date().toISOString()
      };
      setInternships([...internships, newInternship]);
      handleCloseAddModal();
    }
  };

  const handleUpdateInternship = () => {
    if (formData.title.trim() && formData.company.trim() && editIndex !== null) {
      const updatedInternships = [...internships];
      updatedInternships[editIndex] = { ...formData };
      setInternships(updatedInternships);
      handleCloseEditModal();
    }
  };

  const handleDeleteInternship = (index) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      const filteredInternships = internships.filter((_, i) => i !== index);
      setInternships(filteredInternships);
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Filter and sort internships
  const filteredInternships = internships
    .filter(internship => {
      // First apply status filter
      if (filter !== 'all' && internship.status !== filter) return false;
      
      // Then apply search
      const searchLower = searchTerm.toLowerCase();
      return (
        internship.title.toLowerCase().includes(searchLower) ||
        internship.company.toLowerCase().includes(searchLower) ||
        internship.location.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'company':
          return a.company.localeCompare(b.company);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      applied: "bg-blue-100 text-blue-800",
      interviewing: "bg-purple-100 text-purple-800",
      offered: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      accepted: "bg-emerald-100 text-emerald-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
      <Navbar onOpenAddModal={handleOpenAddModal} theme={theme} toggleTheme={toggleTheme} />
      
      <div
        className="w-full py-4 px-6"
        style={{
          // backgroundColor: 'var(--navbar-bg)',
          color: 'var(--text-color)',
        }}
      >
        <h1 className="text-xl font-bold">Trackship</h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className={`text-3xl font-bold mb-4 md:mb-0 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Your Internship Dashboard</h1>
          
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

        {/* Remove the theme toggle button from here */}

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
                className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-white border-gray-600' 
                    : 'bg-white text-gray-800 border-gray-300'
                }`}
              >
                <option value="all">All Statuses</option>
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offered">Offered</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-white border-gray-600' 
                    : 'bg-white text-gray-800 border-gray-300'
                }`}
              >
                <option value="date">Sort by Date</option>
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
              {filteredInternships.map((internship, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{internship.title}</h3>
                      <StatusBadge status={internship.status} />
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-1">
                      <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4" />
                      <span className="text-sm">{internship.company}</span>
                    </div>
                    
                    {internship.location && (
                      <div className="flex items-center text-gray-600 mb-1">
                        <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        <span className="text-sm">{internship.location}</span>
                      </div>
                    )}
                    
                    {internship.startDate && (
                      <div className="flex items-center text-gray-600 mb-1">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        <span className="text-sm">{internship.startDate}</span>
                      </div>
                    )}
                    
                    {internship.duration && (
                      <div className="flex items-center text-gray-600 mb-1">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                        <span className="text-sm">{internship.duration}</span>
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
                      onClick={() => handleOpenEditModal(internships.indexOf(internship))}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteInternship(internships.indexOf(internship))}
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

      {/* Add Internship Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseAddModal}>
        <div className={`p-6 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
          <h2 className="text-xl font-bold mb-4">Add New Internship</h2>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Position Title*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Software Engineer Intern"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  theme === 'dark' ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'
                }`}
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Company*</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Company Name"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  theme === 'dark' ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'
                }`}
                required
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, State or Remote"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  theme === 'dark' ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'
                }`}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Start Date</label>
                <input
                  type="text"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  placeholder="June 2025"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    theme === 'dark' ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="3 months"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    theme === 'dark' ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offered">Offered</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional details about the application..."
                rows="3"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  theme === 'dark' ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'
                }`}
              ></textarea>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleCloseAddModal}
              className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleAddInternship}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Internship
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Internship Modal */}
      <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Edit Internship</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position Title*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company*</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="text"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offered">Offered</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleCloseEditModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateInternship}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Update Internship
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;