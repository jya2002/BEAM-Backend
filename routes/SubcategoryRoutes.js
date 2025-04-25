const express = require('express');
const router = express.Router();
const { Subcategory, Category } = require('../models');

// Ensure Subcategory and Category models are properly imported
console.log('Subcategory Model:', Subcategory);

// Get all subcategories
router.get('/subcategories', async (req, res) => {
  try {
    const subcategories = await Subcategory.findAll({
      where: { is_deleted: false },
      include: [
        {
          model: Category,
          as: 'category', // Specify the alias
          attributes: ['name_am', 'name_en'], // Include specific fields
        },
      ],
    });
    res.json(subcategories);
  } catch (err) {
    console.error('Error fetching subcategories:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get a single subcategory by ID
router.get('/subcategories/:id', async (req, res) => {
  try {
    const subcategory = await Subcategory.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: 'category', // Specify the alias
          attributes: ['name_am', 'name_en'], // Include specific fields
        },
      ],
    });
    if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
    res.json(subcategory);
  } catch (err) {
    console.error('Error fetching subcategory:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get subcategories for a specific category
router.get('/subcategories/by-category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Find subcategories for the given category_id
    const subcategories = await Subcategory.findAll({
      where: { category_id: categoryId, is_deleted: false },
      include: [
        {
          model: Category,
          as: 'category', // Specify alias
          attributes: ['name_am', 'name_en'], // Include specific fields
        },
      ],
    });

    if (subcategories.length === 0) {
      return res.status(404).json({ message: 'No subcategories found for the given category.' });
    }

    res.json(subcategories);
  } catch (err) {
    console.error('Error fetching subcategories for category:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create a new subcategory
router.post('/subcategories', async (req, res) => {
  const { name_am, name_en, description_am, description_en, category_id, parent_id } = req.body;
  console.log('Request body:', { name_am, name_en, description_am, description_en, category_id, parent_id });

  try {
    const subcategory = await Subcategory.create({
      name_am,
      name_en,
      description_am,
      description_en,
      category_id,
      parent_id,
    });
    res.status(201).json(subcategory);
  } catch (err) {
    console.error('Error creating subcategory:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update a subcategory
router.put('/subcategories/:id', async (req, res) => {
  const { name_am, name_en, description_am, description_en, category_id, parent_id, is_deleted } = req.body;
  try {
    const subcategory = await Subcategory.findByPk(req.params.id);
    if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });

    await subcategory.update({ name_am, name_en, description_am, description_en, category_id, parent_id, is_deleted });
    res.json(subcategory);
  } catch (err) {
    console.error('Error updating subcategory:', err);
    res.status(400).json({ error: err.message });
  }
});

// Delete subcategories by category ID
router.delete('/subcategories/by-category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Permanently delete subcategories with the given category_id
    const deletedCount = await Subcategory.destroy({
      where: { category_id: categoryId },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'No subcategories found for the given category_id' });
    }

    res.status(200).json({ message: `Deleted ${deletedCount} subcategories.` });
  } catch (err) {
    console.error('Error deleting subcategories:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
