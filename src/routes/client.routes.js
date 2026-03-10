const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const protect = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createClientSchema, updateClientSchema } = require('../validations/index');

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Client management endpoints
 */

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Obtenir tous les clients
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [actif, inactif, prospect, litigieux]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [particulier, entreprise]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
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
 *         description: Liste des clients
 *   post:
 *     summary: Créer un client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [particulier, entreprise]
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               companyName:
 *                 type: string
 *               siret:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [actif, inactif, prospect, litigieux]
 *     responses:
 *       201:
 *         description: Client créé
 */
router.route('/')
  .get(clientController.getAllClients)
  .post(validate(createClientSchema), clientController.createClient);

/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Obtenir un client par ID
 *     tags: [Clients]
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
 *         description: Client trouvé
 *       404:
 *         description: Client non trouvé
 *   put:
 *     summary: Mettre à jour un client
 *     tags: [Clients]
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
 *         description: Client mis à jour
 *   delete:
 *     summary: Supprimer un client
 *     tags: [Clients]
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
 *         description: Client supprimé
 */
router.route('/:id')
  .get(clientController.getClientById)
  .put(validate(updateClientSchema), clientController.updateClient)
  .delete(authorize('admin', 'manager'), clientController.deleteClient);

/**
 * @swagger
 * /api/clients/{id}/summary:
 *   get:
 *     summary: Obtenir le résumé financier d'un client
 *     tags: [Clients]
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
 *         description: Résumé financier du client
 */
router.get('/:id/summary', clientController.getClientSummary);

module.exports = router;
