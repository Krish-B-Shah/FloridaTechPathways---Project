import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Work as WorkIcon,
  Event as EventIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { format, isSameDay, isWithinInterval, parseISO } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Application {
  internshipId: {
    _id: string;
    title: string;
    company: string;
    deadline: string;
  };
  status: string;
  appliedDate?: string;
  deadline: string;
}

const Calendar: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/internships/user/applications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getApplicationsForDate = (date: Date) => {
    return applications.filter((app) => {
      const deadline = parseISO(app.deadline);
      return isSameDay(deadline, date);
    });
  };

  const getUpcomingDeadlines = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return applications
      .filter((app) => {
        const deadline = parseISO(app.deadline);
        return isWithinInterval(deadline, { start: today, end: nextWeek });
      })
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  };

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

  if (loading) {
    return <LinearProgress />;
  }

  const upcomingDeadlines = getUpcomingDeadlines();
  const selectedDateApplications = getApplicationsForDate(selectedDate);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Application Calendar
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <DateCalendar
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
              sx={{ width: '100%' }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Deadlines
            </Typography>
            <List>
              {upcomingDeadlines.map((app, index) => (
                <React.Fragment key={app.internshipId._id}>
                  <ListItem>
                    <ListItemIcon>
                      <WarningIcon color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary={app.internshipId.title}
                      secondary={`${app.internshipId.company} - ${format(
                        parseISO(app.deadline),
                        'MMM d, yyyy'
                      )}`}
                    />
                    <Chip
                      label={format(parseISO(app.deadline), 'MMM d')}
                      color="error"
                      size="small"
                    />
                  </ListItem>
                  {index < upcomingDeadlines.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Applications for {format(selectedDate, 'MMMM d, yyyy')}
            </Typography>
            <List>
              {selectedDateApplications.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No applications for this date" />
                </ListItem>
              ) : (
                selectedDateApplications.map((app, index) => (
                  <React.Fragment key={app.internshipId._id}>
                    <ListItem>
                      <ListItemIcon>
                        <WorkIcon color={getStatusColor(app.status)} />
                      </ListItemIcon>
                      <ListItemText
                        primary={app.internshipId.title}
                        secondary={`${app.internshipId.company} - ${app.status}`}
                      />
                      <Chip
                        label={app.status}
                        color={getStatusColor(app.status)}
                        size="small"
                      />
                    </ListItem>
                    {index < selectedDateApplications.length - 1 && <Divider />}
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

export default Calendar; 