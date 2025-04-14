import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Pagination,
  Stack,
} from '@mui/material';
import {
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  AccessTime as TimeIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Internship {
  _id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  workType: string;
  field: string;
  experienceLevel: string;
  durationValue: number;
  durationUnit: 'days' | 'weeks' | 'months';
  // duration: string;
  stipend: {
    amount: number;
    currency: string;
  };
  deadline: string;
  applicationUrl: string;
  requirements: string[];
}

const Internships: React.FC = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    field: '',
    location: '',
    workType: '',
    experienceLevel: '',
  });
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [savedInternships, setSavedInternships] = useState<string[]>([]);

  useEffect(() => {
    fetchInternships();
    fetchSavedInternships();
  }, [page, filters]);

  const fetchInternships = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/internships`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          limit: 12,
          ...filters,
        },
      });

      setInternships(response.data.internships);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching internships:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedInternships = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/internships/user/saved`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSavedInternships(response.data.map((app: any) => app.internshipId._id));
    } catch (error) {
      console.error('Error fetching saved internships:', error);
    }
  };

  const handleSaveInternship = async (internshipId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/internships/${internshipId}/save`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSavedInternships(prev => [...prev, internshipId]);
    } catch (error) {
      console.error('Error saving internship:', error);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const InternshipCard: React.FC<{ internship: Internship }> = ({ internship }) => {
    const isSaved = savedInternships.includes(internship._id);
    const daysUntilDeadline = Math.ceil(
      (new Date(internship.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h6" component="div" gutterBottom>
              {internship.title}
            </Typography>
            <IconButton
              onClick={() => handleSaveInternship(internship._id)}
              color={isSaved ? 'primary' : 'default'}
            >
              {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Box>
          <Typography color="text.secondary" gutterBottom>
            {internship.company}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip
              icon={<LocationIcon />}
              label={internship.location}
              size="small"
              variant="outlined"
            />
            <Chip
              icon={<WorkIcon />}
              label={internship.workType}
              size="small"
              variant="outlined"
            />
            <Chip
              icon={<SchoolIcon />}
              label={internship.experienceLevel}
              size="small"
              variant="outlined"
            />
            <Chip
              icon={<TimeIcon />}
              label={internship.duration}
              size="small"
              variant="outlined"
            />
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            {internship.description.substring(0, 150)}...
          </Typography>
          <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Deadline: {new Date(internship.deadline).toLocaleDateString()}
            </Typography>
            <Chip
              label={`${daysUntilDeadline} days left`}
              color={daysUntilDeadline <= 7 ? 'error' : 'primary'}
              size="small"
            />
          </Box>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Internship Opportunities
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Search"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Field</InputLabel>
            <Select
              value={filters.field}
              label="Field"
              onChange={(e) => handleFilterChange('field', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Software Engineering">Software Engineering</MenuItem>
              <MenuItem value="Data Science">Data Science</MenuItem>
              <MenuItem value="Product Management">Product Management</MenuItem>
              <MenuItem value="UX Design">UX Design</MenuItem>
              <MenuItem value="Marketing">Marketing</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Location</InputLabel>
            <Select
              value={filters.location}
              label="Location"
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Remote">Remote</MenuItem>
              <MenuItem value="On-site">On-site</MenuItem>
              <MenuItem value="Hybrid">Hybrid</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Experience Level</InputLabel>
            <Select
              value={filters.experienceLevel}
              label="Experience Level"
              onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Entry Level">Entry Level</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {internships.map((internship) => (
          <Grid item xs={12} sm={6} md={4} key={internship._id}>
            <InternshipCard internship={internship} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default Internships; 