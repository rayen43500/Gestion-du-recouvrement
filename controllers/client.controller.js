const Client = require('../models/Client');
const Invoice = require('../models/Invoice');
const ApiResponse = require('../utils/apiResponse');
const AppError = require('../utils/appError');

// @desc    Create a new client
// @route   POST /api/clients
// @access  Private
exports.createClient = async (req, res, next) => {
  try {
    const client = await Client.create({
      ...req.body,
      createdBy: req.user._id
    });
    res.status(201).json(ApiResponse.success({ client }, 'Client créé avec succès', 201));
  } catch (error) {
    next(error);
  }
};

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
exports.getAllClients = async (req, res, next) => {
  try {
    const { status, type, search, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (search) filter.$text = { $search: search };

    const skip = (page - 1) * limit;
    const [clients, total] = await Promise.all([
      Client.find(filter)
        .populate('assignedTo', 'firstName lastName email')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Client.countDocuments(filter)
    ]);

    res.status(200).json(ApiResponse.success({
      clients,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    }, 'Clients récupérés avec succès'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get single client by ID
// @route   GET /api/clients/:id
// @access  Private
exports.getClientById = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('assignedTo', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName');
    if (!client) throw new AppError('Client non trouvé', 404);
    res.status(200).json(ApiResponse.success({ client }, 'Client récupéré avec succès'));
  } catch (error) {
    next(error);
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
exports.updateClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!client) throw new AppError('Client non trouvé', 404);
    res.status(200).json(ApiResponse.success({ client }, 'Client mis à jour avec succès'));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private (Admin, Manager)
exports.deleteClient = async (req, res, next) => {
  try {
    const invoiceCount = await Invoice.countDocuments({ client: req.params.id });
    if (invoiceCount > 0) {
      throw new AppError('Impossible de supprimer un client avec des factures associées', 400);
    }
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) throw new AppError('Client non trouvé', 404);
    res.status(200).json(ApiResponse.success(null, 'Client supprimé avec succès'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get client invoices summary
// @route   GET /api/clients/:id/summary
// @access  Private
exports.getClientSummary = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) throw new AppError('Client non trouvé', 404);

    const invoices = await Invoice.find({ client: req.params.id });
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
    const overdueInvoices = invoices.filter(inv => inv.dueDate < new Date() && inv.status !== 'paye' && inv.status !== 'annule');

    res.status(200).json(ApiResponse.success({
      client,
      summary: {
        totalInvoices: invoices.length,
        totalAmount,
        totalPaid,
        totalBalance: totalAmount - totalPaid,
        overdueCount: overdueInvoices.length,
        overdueAmount: overdueInvoices.reduce((sum, inv) => sum + (inv.amount - inv.amountPaid), 0)
      }
    }, 'Résumé client récupéré avec succès'));
  } catch (error) {
    next(error);
  }
};
