const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const protect = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createInvoiceSchema, updateInvoiceSchema } = require('../validations/index');

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Invoice management endpoints
 */

/**
 * @swagger
 * /api/invoices:
 *   get:
 *     summary: Obtenir toutes les factures
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [en_attente, en_retard, partiellement_paye, paye, annule]
 *       - in: query
 *         name: client
 *         schema:
 *           type: string
 *       - in: query
 *         name: overdue
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Liste des factures
 *   post:
 *     summary: Créer une facture
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invoiceNumber
 *               - client
 *               - amount
 *               - dueDate
 *             properties:
 *               invoiceNumber:
 *                 type: string
 *               client:
 *                 type: string
 *               amount:
 *                 type: number
 *               dueDate:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Facture créée
 */
router.route('/')
  .get(invoiceController.getAllInvoices)
  .post(validate(createInvoiceSchema), invoiceController.createInvoice);

/**
 * @swagger
 * /api/invoices/{id}:
 *   get:
 *     summary: Obtenir une facture par ID
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Facture trouvée
 *       404:
 *         description: Facture non trouvée
 *   put:
 *     summary: Mettre à jour une facture
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Facture mise à jour
 *   delete:
 *     summary: Supprimer une facture
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Facture supprimée
 */
router.route('/:id')
  .get(invoiceController.getInvoiceById)
  .put(validate(updateInvoiceSchema), invoiceController.updateInvoice)
  .delete(authorize('admin'), invoiceController.deleteInvoice);

module.exports = router;
