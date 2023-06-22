const express = require('express');
const { authenticateUser, hasRole } = require('../middleware');
const Item = require('../models/item.model');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.query.owner) {
      query.owner = req.query.owner;
    }
    if (req.query.minPrice && req.query.maxPrice) {
      query.price = {
        $gte: req.query.minPrice,
        $lte: req.query.maxPrice,
      };
    }
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }
    const items = await Item.find(query);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateUser, hasRole('Admin'), async (req, res) => {
  try {
    const { name, price, description, image, owner, quantity } = req.body;
    const item = new Item({
      name,
      price,
      description,
      image,
      owner,
      quantity,
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', authenticateUser, hasRole('Admin'), async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(203).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', authenticateUser, hasRole('Admin'), async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
