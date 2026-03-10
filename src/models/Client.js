const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  type: {
    type: String,
    enum: { values: ['particulier', 'entreprise'], message: 'Le type doit être: particulier ou entreprise' },
    default: 'entreprise'
  },
  companyName: {
    type: String,
    trim: true
  },
  siret: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Veuillez fournir un email valide']
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true, default: 'France' }
  },
  status: {
    type: String,
    enum: { values: ['actif', 'inactif', 'prospect', 'litigieux'], message: 'Statut invalide' },
    default: 'actif'
  },
  notes: {
    type: String,
    maxlength: [1000, 'Les notes ne peuvent pas dépasser 1000 caractères']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual: total amount owed across all invoices
clientSchema.virtual('invoices', {
  ref: 'Invoice',
  localField: '_id',
  foreignField: 'client'
});

// Index for faster searches
clientSchema.index({ name: 'text', email: 1, status: 1 });

module.exports = mongoose.model('Client', clientSchema);
