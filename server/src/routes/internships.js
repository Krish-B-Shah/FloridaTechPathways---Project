const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const User = require('../models/User');

// Get all internships with filters
router.get('/', async (req, res) => {
  try {
    const {
      field,
      location,
      workType,
      experienceLevel,
      search,
      page = 1,
      limit = 10
    } = req.query;

    const query = { isActive: true };

    // Apply filters
    if (field) query.field = field;
    if (location) query.location = location;
    if (workType) query.workType = workType;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (search) {
      query.$text = { $search: search };
    }

    const internships = await Internship.find(query)
      .sort({ postedDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Internship.countDocuments(query);

    res.json({
      internships,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching internships', error: error.message });
  }
});

// Get internship by ID
router.get('/:id', async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    res.json(internship);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching internship', error: error.message });
  }
});

// Save internship to user's applications
router.post('/:id/save', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Check if already saved
    const existingApplication = user.applications.find(
      app => app.internshipId.toString() === req.params.id
    );

    if (existingApplication) {
      return res.status(400).json({ message: 'Internship already saved' });
    }

    // Add to applications
    user.applications.push({
      internshipId: internship._id,
      status: 'Saved',
      deadline: internship.deadline
    });

    await user.save();

    res.json({ message: 'Internship saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving internship', error: error.message });
  }
});

// Update application status
router.put('/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const user = await User.findById(req.user.userId);

    const application = user.applications.find(
      app => app.internshipId.toString() === req.params.id
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    if (notes) application.notes = notes;
    if (status === 'Applied') {
      application.appliedDate = new Date();
    }

    await user.save();

    res.json({ message: 'Application status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating application status', error: error.message });
  }
});

// Get user's saved internships
router.get('/user/saved', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('applications.internshipId');

    const savedInternships = user.applications.filter(
      app => app.status === 'Saved'
    );

    res.json(savedInternships);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching saved internships', error: error.message });
  }
});

// Get user's applications
router.get('/user/applications', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('applications.internshipId');

    res.json(user.applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

module.exports = router; 