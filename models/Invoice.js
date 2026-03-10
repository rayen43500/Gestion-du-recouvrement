const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: [true, 'Le numéro de facture est requis'],
    unique: true,
    trim: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Le client est requis']
  },
  amount: {
    type: Number,
    required: [true, 'Le montant est requis'],
    min: [0, 'Le montant ne peut pas être négatif']
  },
  amountPaid: {
    type: Number,
    default: 0,
    min: [0, 'Le montant payé ne peut pas être négatif']
  },
  issueDate: {
    type: Date,
    required: [true, 'La date d\'émission est requise'],
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: [true, 'La date d\'échéance est requise']
  },
  status: {
    type: String,
    enum: {
      values: ['en_attente', 'en_retard', 'partiellement_paye', 'paye', 'annule'],
      message: 'Statut invalide'
    },
    default: 'en_attente'
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
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

// Virtual: remaining balance
invoiceSchema.virtual('balance').get(function() {
  return this.amount - this.amountPaid;
});

// Virtual: is overdue
invoiceSchema.virtual('isOverdue').get(function() {
  return this.dueDate < new Date() && this.status !== 'paye' && this.status !== 'annule';
});

// Auto-update status based on payment
invoiceSchema.pre('save', function(next) {
  if (this.amountPaid >= this.amount) {
    this.status = 'paye';
  } else if (this.amountPaid > 0) {
    this.status = 'partiellement_paye';
  } else if (this.dueDate < new Date() && this.status === 'en_attente') {
    this.status = 'en_retard';
  }
  next();
});

invoiceSchema.index({ client: 1, status: 1, dueDate: 1 });

module.exports = mongoose.model('Invoice', invoiceSchema);
