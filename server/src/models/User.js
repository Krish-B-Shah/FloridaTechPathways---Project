const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  preferences: {
    fields: [{
      type: String,
      enum: ['Software Engineering', 'Data Science', 'Product Management', 'UX Design', 'Marketing', 'Finance']
    }],
    locations: [String],
    experienceLevel: {
      type: String,
      enum: ['Entry Level', 'Intermediate', 'Advanced']
    },
    workType: [{
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site']
    }],
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      reminderFrequency: {
        type: String,
        enum: ['Daily', 'Weekly', 'Bi-weekly'],
        default: 'Daily'
      }
    }
  },
  applications: [{
    internshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship'
    },
    status: {
      type: String,
      enum: ['Saved', 'Applied', 'Interviewing', 'Offered', 'Rejected'],
      default: 'Saved'
    },
    appliedDate: Date,
    deadline: Date,
    notes: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 