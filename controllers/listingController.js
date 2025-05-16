const { Listing, ListingImage } = require('../models');
const path = require('path');

exports.createListing = async (req, res) => {
  const {
    user_id,
    category_id,
    subcategory_id,
    location_id,
    title_en,
    title_am,
    description_en,
    description_am,
    price,
    status
  } = req.body;

  try {
    // 1. Create the listing
    const listing = await Listing.create({
      user_id,
      category_id,
      subcategory_id,
      location_id,
      title_en,
      title_am,
      description_en,
      description_am,
      price,
      status
    });

    // 2. Upload images
    const images = await Promise.all(
      req.files.map(file =>
        ListingImage.create({
          listing_id: listing.id,
          image_path: `/uploads/listings/${file.filename}`,
        })
      )
    );

    // 3. Respond
    res.status(201).json({
      message: 'Listing created successfully',
      listing,
      images
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ message: 'Error creating listing', error: error.message });
  }
};

