const Payment = require('../models/Payment');
const CollectionAction = require('../models/CollectionAction');
const Invoice = require('../models/Invoice');

// Statistiques sur les paiements, factures, recouvrements
exports.getStats = async (req, res) => {
  try {
    // Total des paiements
    const totalPayments = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    // Statut des factures
    const invoiceStatus = await Invoice.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Actions de recouvrement par type
    const collectionActions = await CollectionAction.aggregate([
      { $group: { _id: '$actionType', count: { $sum: 1 } } }
    ]);

    res.json({
      payments: totalPayments[0] || { total: 0, count: 0 },
      invoices: invoiceStatus,
      collections: collectionActions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
