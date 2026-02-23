const VendorMapping = require('../models/vendorMapping');
const Category = require('../models/category');

class VendorMappingController {
  static async getAllMappings(req, res) {
    try {
      const mappings = await VendorMapping.getAll();
      res.json(mappings);
    } catch (error) {
      console.error('Error fetching vendor mappings:', error);
      res.status(500).json({ error: 'Failed to fetch vendor mappings', details: error.message });
    }
  }

  static async createMapping(req, res) {
    try {
      const { vendor_name, category_id } = req.body;

      if (!vendor_name || !category_id) {
        return res.status(400).json({ error: 'Vendor name and category ID are required' });
      }

      const mapping = await VendorMapping.create(vendor_name, category_id);
      const mappings = await VendorMapping.getAll();
      const createdMapping = mappings.find(m => m.id === mapping.id);

      res.status(201).json(createdMapping);
    } catch (error) {
      console.error('Error creating vendor mapping:', error);
      res.status(500).json({ error: 'Failed to create vendor mapping', details: error.message });
    }
  }

  static async deleteMapping(req, res) {
    try {
      const { id } = req.params;
      const mapping = await VendorMapping.delete(id);
      
      if (!mapping) {
        return res.status(404).json({ error: 'Vendor mapping not found' });
      }

      res.json({ message: 'Vendor mapping deleted successfully', mapping });
    } catch (error) {
      console.error('Error deleting vendor mapping:', error);
      res.status(500).json({ error: 'Failed to delete vendor mapping', details: error.message });
    }
  }
}

module.exports = VendorMappingController;
