import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    required: true
  },
  website: {
    type: String
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Partner = mongoose.model('Partner', partnerSchema);

export default Partner;
