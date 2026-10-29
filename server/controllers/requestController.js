const BloodRequest = require('../models/BloodRequest');
const Donor = require('../models/Donor');

// @desc    Create new blood request
// @route   POST /api/requests
exports.createRequest = async (req, res) => {
  try {
    const {
      patientName,
      bloodGroup,
      unitsRequired,
      hospitalName,
      city,
      contactPerson,
      contactPhone,
      urgency,
      neededDate,
      reason,
      notes
    } = req.body;

    const request = await BloodRequest.create({
      patientName,
      bloodGroup,
      unitsRequired,
      hospitalName,
      city,
      contactPerson,
      contactPhone,
      urgency: urgency || 'Standard',
      neededDate: neededDate || new Date(Date.now() + 24 * 60 * 60 * 1000),
      reason: reason || 'Medical emergency',
      notes: notes || '',
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Blood request registered successfully!',
      data: request
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to submit blood request'
    });
  }
};

// @desc    Get all blood requests with optional filters
// @route   GET /api/requests
exports.getAllRequests = async (req, res) => {
  try {
    const { status, bloodGroup, urgency, city, search } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (bloodGroup && bloodGroup !== 'all') {
      filter.bloodGroup = bloodGroup;
    }

    if (urgency && urgency !== 'all') {
      filter.urgency = urgency;
    }

    if (city && city.trim() !== '') {
      filter.city = { $regex: city.trim(), $options: 'i' };
    }

    if (search && search.trim() !== '') {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      filter.$or = [
        { patientName: searchRegex },
        { hospitalName: searchRegex },
        { contactPerson: searchRegex },
        { city: searchRegex }
      ];
    }

    const requests = await BloodRequest.find(filter).sort({
      urgency: -1, // Critical/Urgent priority
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching blood requests'
    });
  }
};

// @desc    Get single blood request
// @route   GET /api/requests/:id
exports.getRequestById = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update request status (Pending, Approved, Fulfilled, Cancelled)
// @route   PATCH /api/requests/:id/status
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Approved', 'Fulfilled', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const request = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Request status updated to ${status}`,
      data: request
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update request status'
    });
  }
};

// @desc    Delete blood request
// @route   DELETE /api/requests/:id
exports.deleteRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blood request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting request'
    });
  }
};

// @desc    Get portal summary & dashboard statistics
// @route   GET /api/requests/stats/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const totalDonors = await Donor.countDocuments();
    const availableDonors = await Donor.countDocuments({ isAvailable: true });

    const totalRequests = await BloodRequest.countDocuments();
    const pendingRequests = await BloodRequest.countDocuments({ status: 'Pending' });
    const fulfilledRequests = await BloodRequest.countDocuments({ status: 'Fulfilled' });
    const urgentRequests = await BloodRequest.countDocuments({
      urgency: { $in: ['Urgent', 'Critical'] },
      status: { $in: ['Pending', 'Approved'] }
    });

    // Donors breakdown by blood group
    const donorGroupCounts = await Donor.aggregate([
      {
        $group: {
          _id: '$bloodGroup',
          count: { $sum: 1 },
          availableCount: {
            $sum: { $cond: [{ $eq: ['$isAvailable', true] }, 1, 0] }
          }
        }
      }
    ]);

    // Request breakdown by blood group
    const requestGroupCounts = await BloodRequest.aggregate([
      {
        $group: {
          _id: '$bloodGroup',
          count: { $sum: 1 },
          totalUnits: { $sum: '$unitsRequired' }
        }
      }
    ]);

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const bloodGroupStats = bloodGroups.map((group) => {
      const donorStat = donorGroupCounts.find((d) => d._id === group) || { count: 0, availableCount: 0 };
      const reqStat = requestGroupCounts.find((r) => r._id === group) || { count: 0, totalUnits: 0 };
      return {
        bloodGroup: group,
        donorCount: donorStat.count,
        availableDonorCount: donorStat.availableCount,
        requestCount: reqStat.count,
        requestedUnits: reqStat.totalUnits
      };
    });

    res.status(200).json({
      success: true,
      data: {
        totalDonors,
        availableDonors,
        totalRequests,
        pendingRequests,
        fulfilledRequests,
        urgentRequests,
        bloodGroupStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error calculating dashboard stats'
    });
  }
};

