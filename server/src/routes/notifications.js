const express = require('express');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Get user's notifications
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('applications.internshipId');

    // Get upcoming deadlines
    const upcomingDeadlines = user.applications
      .filter(app => {
        const daysUntilDeadline = Math.ceil(
          (app.deadline - new Date()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilDeadline <= 7 && daysUntilDeadline > 0;
      })
      .map(app => ({
        type: 'deadline',
        internship: app.internshipId,
        daysUntilDeadline: Math.ceil(
          (app.deadline - new Date()) / (1000 * 60 * 60 * 24)
        )
      }));

    // Get status updates
    const statusUpdates = user.applications
      .filter(app => app.status === 'Interviewing' || app.status === 'Offered')
      .map(app => ({
        type: 'status',
        internship: app.internshipId,
        status: app.status
      }));

    res.json({
      upcomingDeadlines,
      statusUpdates
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
});

// Send email notification
router.post('/send-email', async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
});

// Update notification preferences
router.put('/preferences', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.preferences.notificationPreferences = {
      ...user.preferences.notificationPreferences,
      ...req.body
    };

    await user.save();
    res.json(user.preferences.notificationPreferences);
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification preferences', error: error.message });
  }
});

// Schedule notifications for upcoming deadlines
router.post('/schedule-deadline-notifications', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('applications.internshipId');

    const upcomingDeadlines = user.applications
      .filter(app => {
        const daysUntilDeadline = Math.ceil(
          (app.deadline - new Date()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilDeadline <= 7 && daysUntilDeadline > 0;
      });

    for (const app of upcomingDeadlines) {
      const daysUntilDeadline = Math.ceil(
        (app.deadline - new Date()) / (1000 * 60 * 60 * 24)
      );

      if (user.preferences.notificationPreferences.email) {
        const subject = `Reminder: ${app.internshipId.title} Application Deadline`;
        const text = `The application deadline for ${app.internshipId.title} at ${app.internshipId.company} is in ${daysUntilDeadline} days.`;
        const html = `
          <h2>Application Deadline Reminder</h2>
          <p>The application deadline for <strong>${app.internshipId.title}</strong> at <strong>${app.internshipId.company}</strong> is in <strong>${daysUntilDeadline} days</strong>.</p>
          <p>Don't forget to submit your application!</p>
        `;

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject,
          text,
          html
        });
      }
    }

    res.json({ message: 'Deadline notifications scheduled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error scheduling notifications', error: error.message });
  }
});

module.exports = router; 