const express = require('express');
const router = express.Router();
const tf = require('@tensorflow/tfjs');
const axios = require('axios');
const User = require('../models/User');
const Internship = require('../models/Internship');

// Create feature vector from user preferences and internship
function createFeatureVector(userPrefs, internship) {
  return [
    // Field match (one-hot encoding)
    userPrefs.fields.includes(internship.field) ? 1 : 0,
    // Location match
    userPrefs.locations.includes(internship.location) ? 1 : 0,
    // Experience level match
    userPrefs.experienceLevel === internship.experienceLevel ? 1 : 0,
    // Work type match
    userPrefs.workType.includes(internship.workType) ? 1 : 0,
    // Normalized stipend (if available)
    internship.stipend ? internship.stipend.amount / 10000 : 0,
    // Days until deadline (normalized)
    Math.max(0, (internship.deadline - new Date()) / (1000 * 60 * 60 * 24 * 30))
  ];
}

async function fetchInternships() {
  try {
    // Update with your specific RapidAPI endpoint and headers
    const response = await axios.get('https://internships-api.p.rapidapi.com/v1/internships', {
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPIKEY,
        'X-RapidAPI-Host': 'internships-api.p.rapidapi.com'
      },
      params: {
        // Add any query parameters needed by the API
        limit: 50,
        page: 1
      }
    });
    
    // Map the API response to match your internship model structure
    return response.data.internships.map(item => ({
      title: item.title,
      company: item.company.name,
      location: item.location,
      field: item.category,
      description: item.description,
      deadline: new Date(item.deadline || Date.now() + 30*24*60*60*1000),
      experienceLevel: item.experience_level || 'Entry Level',
      workType: item.job_type || 'Full-time',
      stipend: item.salary ? { amount: item.salary.value || 0 } : null,
      postedDate: new Date(item.posted_date),
      isActive: true,
      url: item.url
    }));
  } catch (error) {
    console.error('Error fetching internships from RapidAPI:', error.message);
    return [];
  }
}

// Add a new route to get internships from RapidAPI
router.get('/external', async (req, res) => {
  try {
    const externalInternships = await fetchInternships();
    
    // If user is authenticated, personalize results
    if (req.user && req.user.userId) {
      const user = await User.findById(req.user.userId);
      
      if (user && user.preferences) {
        // Simple filtering based on user preferences
        const filteredInternships = externalInternships.filter(internship => {
          // Match by field
          const fieldMatch = user.preferences.fields.some(field => 
            internship.field.toLowerCase().includes(field.toLowerCase()));
          
          // Match by location
          const locationMatch = user.preferences.locations.some(location => 
            internship.location.toLowerCase().includes(location.toLowerCase()));
            
          return fieldMatch || locationMatch;
        });
        
        return res.json(filteredInternships);
      }
    }
    
    // Return all internships if no user preferences
    res.json(externalInternships);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching external internships', 
      error: error.message 
    });
  }
});

// Get personalized recommendations
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('applications.internshipId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all active internships
    const internships = await Internship.find({ isActive: true });

    // Create training data from user's application history
    const trainingData = user.applications.map(app => ({
      features: createFeatureVector(user.preferences, app.internshipId),
      label: app.status === 'Applied' ? 1 : 0
    }));

    // Create and train a simple neural network
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [6], units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 4, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    // Convert training data to tensors
    const xs = tf.tensor2d(trainingData.map(d => d.features));
    const ys = tf.tensor2d(trainingData.map(d => d.label));

    // Train the model
    await model.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      shuffle: true,
      validationSplit: 0.2
    });

    // Generate recommendations
    const recommendations = await Promise.all(
      internships.map(async (internship) => {
        const features = createFeatureVector(user.preferences, internship);
        const prediction = await model.predict(tf.tensor2d([features])).data();
        
        return {
          internship,
          score: prediction[0]
        };
      })
    );

    // Sort by score and filter out already applied/saved internships
    const appliedIds = new Set(user.applications.map(app => app.internshipId._id.toString()));
    const sortedRecommendations = recommendations
      .filter(rec => !appliedIds.has(rec.internship._id.toString()))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    // Clean up tensors
    tf.dispose([xs, ys, model]);

    res.json(sortedRecommendations);
  } catch (error) {
    res.status(500).json({ message: 'Error generating recommendations', error: error.message });
  }
});

// Get similar internships
router.get('/similar/:id', async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    const similarInternships = await Internship.find({
      _id: { $ne: internship._id },
      field: internship.field,
      experienceLevel: internship.experienceLevel,
      isActive: true
    })
    .limit(5)
    .sort({ postedDate: -1 });

    res.json(similarInternships);
  } catch (error) {
    res.status(500).json({ message: 'Error finding similar internships', error: error.message });
  }
});

module.exports = router;