const Invoice = require('../models/Invoice');
const Client = require('../models/Client');
const ApiResponse = require('../utils/apiResponse');
const AppError = require('../utils/appError');

// @desc    Create invoice
// @route   POST /api/invoices
// @access  Private
exports.createInvoice = async (req, res, next) => {
  try {
    const client = await Client.findById(req.body.client);
    if (!client) throw new AppError('Client non trouvé', 404);

    const invoice = await Invoice.create({
      ...req.body,
      createdBy: req.user._id
    });
    await invoice.populate('client', 'name email');
    res.status(201).json(ApiResponse.success({ invoice }, 'Facture créée avec succès', 201));
  } catch (error) {
    next(error);
  }
};

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
exports.getAllInvoices = async (req, res, next) => {
  try {
    const { status, client, assignedTo, overdue, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (client) filter.client = client;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (overdue === 'true') {
      filter.dueDate = { $lt: new Date() };
      filter.status = { $nin: ['paye', 'annule'] };
    }

    const skip = (page - 1) * limit;
    const [invoices, total] = await Promise.all([
      Invoice.find(filter)
        .populate('client', 'name email phone')
        .populate('assignedTo', 'firstName lastName')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ dueDate: 1 }),
      Invoice.countDocuments(filter)
    ]);

    res.status(200).json(ApiResponse.success({
      invoices,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    }, 'Factures récupérées avec succès'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get invoice by ID
// @route   GET /api/invoices/:id
// @access  Private
exports.getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('client', 'name email phone address')
      .populate('assignedTo', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName');
    if (!invoice) throw new AppError('Facture non trouvée', 404);
    res.status(200).json(ApiResponse.success({ invoice }, 'Facture récupérée avec succès'));
  } catch (error) {
    next(error);
  }
};

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Private
exports.updateInvoice = async (req, res, next) => {
  try {
    const { amountPaid, ...updateData } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('client', 'name email');
    if (!invoice) throw new AppError('Facture non trouvée', 404);
    res.status(200).json(ApiResponse.success({ invoice }, 'Facture mise à jour avec succès'));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private (Admin)
exports.deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) throw new AppError('Facture non trouvée', 404);
    if (invoice.amountPaid > 0) {
      throw new AppError('Impossible de supprimer une facture avec des paiements enregistrés', 400);
    }
    await invoice.deleteOne();
    res.status(200).json(ApiResponse.success(null, 'Facture supprimée avec succès'));
  } catch (error) {
    next(error);
  }
};
