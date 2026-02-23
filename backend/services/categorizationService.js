const VendorMapping = require('../models/vendorMapping');
const Category = require('../models/category');

class CategorizationService {
  static async getCategoryForVendor(vendorName) {
    // First, try to find exact match in vendor mappings
    const mapping = await VendorMapping.getByVendorName(vendorName);
    if (mapping) {
      return mapping.category_id;
    }

    // Try case-insensitive partial matching
    const allMappings = await VendorMapping.getAll();
    const vendorLower = vendorName.toLowerCase();
    
    for (const map of allMappings) {
      if (vendorLower.includes(map.vendor_name.toLowerCase()) || 
          map.vendor_name.toLowerCase().includes(vendorLower)) {
        return map.category_id;
      }
    }

    // Default to "Other" category if no match found
    const otherCategory = await Category.getByName('Other');
    return otherCategory ? otherCategory.id : null;
  }

  static async assignCategory(vendorName) {
    const categoryId = await this.getCategoryForVendor(vendorName);
    if (!categoryId) {
      // If "Other" category doesn't exist, create it
      const newCategory = await Category.create('Other');
      return newCategory.id;
    }
    return categoryId;
  }
}

module.exports = CategorizationService;
