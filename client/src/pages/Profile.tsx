import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  Alert,
  Divider,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface ProfileData {
  name: string;
  email: string;
  preferences: {
    fields: string[];
    locations: string[];
    experienceLevel: string;
    workType: string[];
    notificationPreferences: {
      email: boolean;
      push: boolean;
      reminderFrequency: string;
    };
  };
}

const Profile: React.FC = () => {
  const { user, updatePreferences } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    preferences: {
      fields: [],
      locations: [],
      experienceLevel: '',
      workType: [],
      notificationPreferences: {
        email: true,
        push: true,
        reminderFrequency: 'Daily',
      },
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        preferences: user.preferences,
      });
    }
    setLoading(false);
  }, [user]);

  const handleFieldChange = (field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await updatePreferences(profileData.preferences);
      setSuccess('Profile updated successfully');
    } catch (error) {
      setError('Error updating profile');
      console.error('Error updating profile:', error);
    }
  };

  const availableFields = [
    'Software Engineering',
    'Data Science',
    'Product Management',
    'UX Design',
    'Marketing',
    'Finance',
  ];

  const availableLocations = ['Remote', 'On-site', 'Hybrid'];
  const availableWorkTypes = ['Remote', 'On-site', 'Hybrid'];
  const experienceLevels = ['Entry Level', 'Intermediate', 'Advanced'];

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                value={profileData.name}
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                value={profileData.email}
                disabled
                sx={{ mb: 2 }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Preferences
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Experience Level</InputLabel>
                <Select
                  value={profileData.preferences.experienceLevel}
                  label="Experience Level"
                  onChange={(e) => handleFieldChange('experienceLevel', e.target.value)}
                >
                  {experienceLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Fields of Interest</InputLabel>
                <Select
                  multiple
                  value={profileData.preferences.fields}
                  label="Fields of Interest"
                  onChange={(e) => handleFieldChange('fields', e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {availableFields.map((field) => (
                    <MenuItem key={field} value={field}>
                      {field}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Preferred Work Types</InputLabel>
                <Select
                  multiple
                  value={profileData.preferences.workType}
                  label="Preferred Work Types"
                  onChange={(e) => handleFieldChange('workType', e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {availableWorkTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Preferred Locations</InputLabel>
                <Select
                  multiple
                  value={profileData.preferences.locations}
                  label="Preferred Locations"
                  onChange={(e) => handleFieldChange('locations', e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {availableLocations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Save Preferences
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile; 