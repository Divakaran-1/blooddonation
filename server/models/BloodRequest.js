const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message: '{VALUE} is not a valid blood group'
      }
    },
    unitsRequired: {
      type: Number,
      required: [true, 'Units required is required'],
      min: [1, 'Minimum 1 unit of blood is required'],
      max: [20, 'Maximum allowed request at once is 20 units']
    },
    hospitalName: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    contactPerson: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone number is required'],
      trim: true
    },
    urgency: {
      type: String,
      enum: ['Critical', 'Urgent', 'Standard'],
      default: 'Standard'
    },
    neededDate: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // Default 24 hours from now
    },
    reason: {
      type: String,
      trim: true,
      default: 'Medical necessity'
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Fulfilled', 'Cancelled'],
      default: 'Pending'
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

bloodRequestSchema.index({ status: 1, bloodGroup: 1, urgency: 1 });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);

