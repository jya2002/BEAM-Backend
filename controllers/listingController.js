const { Listing, ListingImage } = require('../models');
const fs = require('fs');
const path = require('path');

exports.createListing = async (req, res) => {
  const {
    title_am,
    title_en,
    description_am,
    description_en,
    price,
    user_id,
    category_id,
    location_id,
    status,
  } = req.body;

  if (!title_am || !title_en || !description_am || !description_en || !price || !user_id || !status) {
    return res.status(400).json({
      error: 'Missing required fields: title_am, title_en, description_am, description_en, price, user_id, or status',
    });
  }

  try {
    const listing = await Listing.create({
      title_am,
      title_en,
      description_am,
      description_en,
      price,
      user_id,
      category_id: category_id || null,
      location_id: location_id || null,
      status,
    });

    if (req.files && req.files.length > 0) {
      const images = req.files.map((file) => ({
        listing_id: listing.id,
        image_path: `/uploads/listings/${file.filename}`,
      }));

      await ListingImage.bulkCreate(images);
    }

    res.status(201).json({ message: 'Listing created successfully', listing });
  } catch (err) {
    console.error('Create Listing Error:', err);
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        details: err.errors.map((e) => e.message),
      });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllListings = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const whereClause = categoryId ? { category_id: categoryId } : {};
    const listings = await Listing.findAll({ where: whereClause });
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id, {
      include: [ListingImage],
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const {
      title_am,
      title_en,
      description_am,
      description_en,
      price,
      status,
    } = req.body;

    await listing.update({
      title_am,
      title_en,
      description_am,
      description_en,
      price,
      status,
    });

    if (req.file) {
      const image_path = `/uploads/listings/${req.file.filename}`;
      await ListingImage.create({
        listing_id: listing.id,
        image_path,
      });
    }

    res.status(200).json({ message: 'Listing updated successfully', listing });
  } catch (err) {
    console.error('Update Listing Error:', err);
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        details: err.errors.map((e) => e.message),
      });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id, {
      include: [ListingImage],
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    for (const image of listing.ListingImages || []) {
      const filePath = path.join(__dirname, '..', image.image_path);
      fs.unlink(filePath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error(`Failed to delete image file: ${filePath}`, err);
        }
      });
    }

    await listing.destroy();
    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

