const mongoose = require("mongoose");

const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true
  },
  mission: {
    type: String,
    required: true
  },
  rocket: {
    type: Date,
    required: true
  },
  launchDate: {
    type: String,
    required: true
  },
  target: {
    type: String,
    ref: 'Planet'
  },
  customer: [String],
  upcoming: {
    type: Boolean,
    required: true
  },
  success: {
    type: Boolean,
    required: true,
    default: true
  },
});
