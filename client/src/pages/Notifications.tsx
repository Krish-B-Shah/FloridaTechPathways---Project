import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Switch,
  FormControlLabel,
  FormGroup,
  Divider,
  LinearProgress,
  Chip,
  Button,
  Grid,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  NotificationsActive as NotificationsActiveIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Notification {
  type: 'deadline' | 'status';
  internship: {
    title: string;
    company: string;
    deadline: string;
  };
  daysUntilDeadline?: number;
  status?: string;
  createdAt: string;
}

const Notifications: React.FC = () => {
  const { user, updatePreferences } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    reminderFrequency: 'Daily',
  });

  useEffect(() => {
    fetchNotifications();
    if (user?.preferences.notificationPreferences) {
      setPreferences(user.preferences.notificationPreferences);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(response.data.upcomingDeadlines);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = async (field: string, value: any) => {
    try {
      const newPreferences = {
        ...preferences,
        [field]: value,
      };
      setPreferences(newPreferences);
      await updatePreferences({
        notificationPreferences: newPreferences,
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const handleDeleteNotification = async (index: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/notifications/${notifications[index].internship._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <WarningIcon color="error" />;
      case 'status':
        return <CheckCircleIcon color="success" />;
      default:
        return <NotificationsIcon />;
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.email}
                    onChange={(e) => handlePreferenceChange('email', e.target.checked)}
                  />
                }
                label="Email Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.push}
                    onChange={(e) => handlePreferenceChange('push', e.target.checked)}
                  />
                }
                label="Push Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.reminderFrequency === 'Daily'}
                    onChange={(e) =>
                      handlePreferenceChange(
                        'reminderFrequency',
                        e.target.checked ? 'Daily' : 'Weekly'
                      )
                    }
                  />
                }
                label="Daily Reminders"
              />
            </FormGroup>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Notifications</Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setNotifications([])}
              >
                Clear All
              </Button>
            </Box>
            <List>
              {notifications.length === 0 ? (
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText primary="No notifications" />
                </ListItem>
              ) : (
                notifications.map((notification, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        {getNotificationIcon(notification.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          notification.type === 'deadline'
                            ? `Deadline Approaching: ${notification.internship.title}`
                            : `Status Update: ${notification.internship.title}`
                        }
                        secondary={
                          notification.type === 'deadline'
                            ? `${notification.internship.company} - ${notification.daysUntilDeadline} days left`
                            : `${notification.internship.company} - ${notification.status}`
                        }
                      />
                      {notification.type === 'deadline' && (
                        <Chip
                          label={`${notification.daysUntilDeadline} days`}
                          color="error"
                          size="small"
                          sx={{ mr: 1 }}
                        />
                      )}
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteNotification(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < notifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Notifications; 