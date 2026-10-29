const Donor = require('../models/Donor');

// Blood compatibility table: For a given recipient blood group, which donor blood groups are compatible?
const COMPATIBLE_DONORS_FOR_RECIPIENT = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal Recipient
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'] // Universal Donor
};

// @desc    Register a new donor
// @route   POST /api/donors
exports.registerDonor = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      bloodGroup,
      age,
      gender,
      city,
      address,
      pincode,
      lastDonationDate,
      isAvailable,
      medicalNotes
    } = req.body;

    // Check if donor with same phone or email already exists
    const existing = await Donor.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }]
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A donor with this email address or phone number is already registered.'
      });
    }

    const donor = await Donor.create({
      fullName,
      email,
      phone,
      bloodGroup,
      age,
      gender,
      city,
      address,
      pincode,
      lastDonationDate: lastDonationDate || null,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      medicalNotes: medicalNotes || ''
    });

    res.status(201).json({
      success: true,
      message: 'Donor registered successfully!',
      data: donor
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to register donor'
    });
  }
};

// @desc    Get all donors with optional filters
// @route   GET /api/donors
exports.getAllDonors = async (req, res) => {
  try {
    const { bloodGroup, city, isAvailable, search } = req.query;
    const filter = {};

    if (bloodGroup && bloodGroup !== 'all') {
      filter.bloodGroup = bloodGroup;
    }

    if (city && city.trim() !== '') {
      filter.city = { $regex: city.trim(), $options: 'i' };
    }

    if (isAvailable !== undefined && isAvailable !== 'all') {
      filter.isAvailable = isAvailable === 'true';
    }

    if (search && search.trim() !== '') {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      filter.$or = [
        { fullName: searchRegex },
        { city: searchRegex },
        { phone: searchRegex },
        { email: searchRegex }
      ];
    }

    const donors = await Donor.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donors.length,
      data: donors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching donors'
    });
  }
};

// @desc    Find compatible donors for a specific blood group & city
// @route   GET /api/donors/compatible
exports.getCompatibleDonors = async (req, res) => {
  try {
    const { bloodGroup, city } = req.query;

    if (!bloodGroup) {
      return res.status(400).json({
        success: false,
        message: 'Blood group query parameter is required'
      });
    }

    const compatibleGroups = COMPATIBLE_DONORS_FOR_RECIPIENT[bloodGroup] || [bloodGroup];

    const filter = {
      bloodGroup: { $in: compatibleGroups },
      isAvailable: true
    };

    if (city && city.trim() !== '') {
      filter.city = { $regex: city.trim(), $options: 'i' };
    }

    const donors = await Donor.find(filter).sort({ bloodGroup: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      recipientGroup: bloodGroup,
      compatibleGroups,
      count: donors.length,
      data: donors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error finding compatible donors'
    });
  }
};

// @desc    Get single donor by ID
// @route   GET /api/donors/:id
exports.getDonorById = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: donor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update donor details
// @route   PUT /api/donors/:id
exports.updateDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Donor updated successfully',
      data: donor
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Update failed'
    });
  }
};

// @desc    Toggle donor availability status
// @route   PATCH /api/donors/:id/availability
exports.toggleAvailability = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }

    donor.isAvailable = !donor.isAvailable;
    await donor.save();

    res.status(200).json({
      success: true,
      message: `Donor is now marked as ${donor.isAvailable ? 'Available' : 'Unavailable'}`,
      data: donor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to toggle availability'
    });
  }
};

// @desc    Delete donor
// @route   DELETE /api/donors/:id
exports.deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Donor deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting donor'
    });
  }
};

