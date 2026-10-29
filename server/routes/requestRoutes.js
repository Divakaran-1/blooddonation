const express = require('express');
const router = express.Router();
const {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  deleteRequest,
  getDashboardStats
} = require('../controllers/requestController');

router.get('/stats/dashboard', getDashboardStats);

router.route('/')
  .post(createRequest)
  .get(getAllRequests);

router.route('/:id')
  .get(getRequestById)
  .delete(deleteRequest);

router.patch('/:id/status', updateRequestStatus);

module.exports = router;

