import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // Document will be automatically deleted when expired
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  userAgent: String,
  ipAddress: String
}, {
  timestamps: true
});

// Add compound index for faster queries
sessionSchema.index({ userId: 1, token: 1 });

// Update lastActivity on every access
sessionSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});

const Session = mongoose.model('Session', sessionSchema);

export default Session;
