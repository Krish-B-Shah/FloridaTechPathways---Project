const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [{
    type: String,
    required: true
  }],
  location: {
    type: String,
    required: true
  },
  workType: {
    type: String,
    enum: ['Remote', 'Hybrid', 'On-site'],
    required: true
  },
  field: {
    type: String,
    enum: ['Software Engineering', 'Data Science', 'Product Management', 'UX Design', 'Marketing', 'Finance'],
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['Entry Level', 'Intermediate', 'Advanced'],
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  stipend: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  applicationUrl: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  tags: [String],
  companyLogo: String,
  applicationCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Index for efficient searching
internshipSchema.index({ title: 'text', description: 'text', company: 'text' });
internshipSchema.index({ field: 1, location: 1, workType: 1, experienceLevel: 1 });
internshipSchema.index({ deadline: 1 });

const Internship = mongoose.model('Internship', internshipSchema);

module.exports = Internship; 