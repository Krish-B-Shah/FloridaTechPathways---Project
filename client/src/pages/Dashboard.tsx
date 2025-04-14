import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
} from '@mui/material';
import {
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Warning as WarningIcon,
  Event as EventIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface ApplicationStats {
  total: number;
  applied: number;
  interviewing: number;
  offered: number;
  saved: number;
}

interface UpcomingDeadline {
  internship: {
    title: string;
    company: string;
    deadline: string;
  };
  daysUntilDeadline: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ApplicationStats>({
    total: 0,
    applied: 0,
    interviewing: 0,
    offered: 0,
    saved: 0,
  });
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<UpcomingDeadline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [applicationsResponse, notificationsResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/internships/user/applications`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/api/notifications`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const applications = applicationsResponse.data;
        const notifications = notificationsResponse.data;

        // Calculate stats
        const newStats = {
          total: applications.length,
          applied: applications.filter((app: any) => app.status === 'Applied').length,
          interviewing: applications.filter((app: any) => app.status === 'Interviewing').length,
          offered: applications.filter((app: any) => app.status === 'Offered').length,
          saved: applications.filter((app: any) => app.status === 'Saved').length,
        };
        setStats(newStats);

        // Set upcoming deadlines
        setUpcomingDeadlines(notifications.upcomingDeadlines);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'primary';
      case 'Interviewing':
        return 'warning';
      case 'Offered':
        return 'success';
      case 'Saved':
        return 'info';
      default:
        return 'default';
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ color, mr: 1 }}>{icon}</Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(value / stats.total) * 100}
          sx={{ mt: 1, height: 8, borderRadius: 4 }}
        />
      </CardContent>
    </Card>
  );

  // Mock data - replace with actual data from API
  const mockStats = {
    totalApplications: 12,
    upcomingDeadlines: 3,
    newNotifications: 2,
  };

  const recentApplications = [
    { id: 1, company: 'Google', position: 'Software Engineering Intern', status: 'Applied' },
    { id: 2, company: 'Microsoft', position: 'Full Stack Developer Intern', status: 'Interviewing' },
    { id: 3, company: 'Amazon', position: 'Frontend Developer Intern', status: 'Saved' },
  ];

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name}!
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <WorkIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Applications
                  </Typography>
                  <Typography variant="h4">{mockStats.totalApplications}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <EventIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Upcoming Deadlines
                  </Typography>
                  <Typography variant="h4">{mockStats.upcomingDeadlines}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <NotificationsIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    New Notifications
                  </Typography>
                  <Typography variant="h4">{mockStats.newNotifications}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Applications */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Applications
            </Typography>
            <List>
              {recentApplications.map((application) => (
                <ListItem key={application.id}>
                  <ListItemIcon>
                    <WorkIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={application.position}
                    secondary={`${application.company} - ${application.status}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 