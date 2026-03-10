const CollectionAction = require('../models/CollectionAction');
const collectionActionValidation = require('../validations/collectionAction');

// Create CollectionAction
exports.createCollectionAction = async (req, res) => {
  const { error } = collectionActionValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const action = new CollectionAction(req.body);
    await action.save();
    res.status(201).json(action);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all CollectionActions
exports.getCollectionActions = async (req, res) => {
  try {
    const actions = await CollectionAction.find().populate('agent client invoice');
    res.json(actions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get CollectionAction by ID
exports.getCollectionActionById = async (req, res) => {
  try {
    const action = await CollectionAction.findById(req.params.id).populate('agent client invoice');
    if (!action) return res.status(404).json({ error: 'CollectionAction not found' });
    res.json(action);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update CollectionAction
exports.updateCollectionAction = async (req, res) => {
  const { error } = collectionActionValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const action = await CollectionAction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!action) return res.status(404).json({ error: 'CollectionAction not found' });
    res.json(action);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete CollectionAction
exports.deleteCollectionAction = async (req, res) => {
  try {
    const action = await CollectionAction.findByIdAndDelete(req.params.id);
    if (!action) return res.status(404).json({ error: 'CollectionAction not found' });
    res.json({ message: 'CollectionAction deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
