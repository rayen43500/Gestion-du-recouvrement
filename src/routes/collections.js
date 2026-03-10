const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');

router.post('/', collectionController.createCollectionAction);
router.get('/', collectionController.getCollectionActions);
router.get('/:id', collectionController.getCollectionActionById);
router.put('/:id', collectionController.updateCollectionAction);
router.delete('/:id', collectionController.deleteCollectionAction);

module.exports = router;
