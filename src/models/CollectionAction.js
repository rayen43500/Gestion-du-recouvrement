const mongoose = require('mongoose');

const collectionActionSchema = new mongoose.Schema({
  actionType: {
    type: String,
    enum: ['call', 'email', 'letter', 'visit', 'legal', 'other'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  note: {
    type: String
  }
});

module.exports = mongoose.model('CollectionAction', collectionActionSchema);
