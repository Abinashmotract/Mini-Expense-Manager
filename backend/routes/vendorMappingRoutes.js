const express = require('express');
const router = express.Router();
const VendorMappingController = require('../controllers/vendorMappingController');

router.get('/', VendorMappingController.getAllMappings);
router.post('/', VendorMappingController.createMapping);
router.delete('/:id', VendorMappingController.deleteMapping);

module.exports = router;
