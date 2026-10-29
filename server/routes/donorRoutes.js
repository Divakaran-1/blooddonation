const express = require('express');
const router = express.Router();
const {
  registerDonor,
  getAllDonors,
  getCompatibleDonors,
  getDonorById,
  updateDonor,
  toggleAvailability,
  deleteDonor
} = require('../controllers/donorController');

router.route('/')
  .post(registerDonor)
  .get(getAllDonors);

router.get('/compatible', getCompatibleDonors);

router.route('/:id')
  .get(getDonorById)
  .put(updateDonor)
  .delete(deleteDonor);

router.patch('/:id/availability', toggleAvailability);

module.exports = router;

