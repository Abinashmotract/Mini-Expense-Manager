const Expense = require('../models/expense');
const CategorizationService = require('../services/categorizationService');
const AnomalyDetectionService = require('../services/anomalyDetectionService');

class ExpenseController {
  static async addExpense(req, res) {
    try {
      const { date, amount, vendor_name, description } = req.body;

      if (!date || !amount || !vendor_name) {
        return res.status(400).json({ error: 'Date, amount, and vendor name are required' });
      }

      // Assign category based on vendor
      const categoryId = await CategorizationService.assignCategory(vendor_name);

      // Create expense
      const expense = await Expense.create({
        date,
        amount: parseFloat(amount),
        vendor_name,
        description: description || '',
        category_id: categoryId,
        is_anomaly: false
      });

      // Check for anomaly
      await AnomalyDetectionService.checkAndFlagAnomaly(expense.id, parseFloat(amount), categoryId);

      // Re-fetch expense with category name
      const expenses = await Expense.getAll();
      const createdExpense = expenses.find(e => e.id === expense.id);

      res.status(201).json(createdExpense);
    } catch (error) {
      console.error('Error adding expense:', error);
      res.status(500).json({ error: 'Failed to add expense', details: error.message });
    }
  }

  static async getAllExpenses(req, res) {
    try {
      const expenses = await Expense.getAll();
      res.json(expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ error: 'Failed to fetch expenses', details: error.message });
    }
  }

  static async getAnomalies(req, res) {
    try {
      const anomalies = await Expense.getAnomalies();
      res.json(anomalies);
    } catch (error) {
      console.error('Error fetching anomalies:', error);
      res.status(500).json({ error: 'Failed to fetch anomalies', details: error.message });
    }
  }

  static async uploadCSV(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No CSV file uploaded' });
      }

      const csv = require('csv-parser');
      const fs = require('fs');
      const results = [];
      const errors = [];
      const promises = [];

      return new Promise((resolve, reject) => {
        fs.createReadStream(req.file.path)
          .pipe(csv())
          .on('data', (row) => {
            // Collect promises instead of awaiting in event handler
            const promise = (async () => {
              try {
                const { date, amount, vendor_name, description } = row;

                if (!date || !amount || !vendor_name) {
                  errors.push({ row, error: 'Missing required fields' });
                  return;
                }

                const categoryId = await CategorizationService.assignCategory(vendor_name);
                
                const expense = await Expense.create({
                  date,
                  amount: parseFloat(amount),
                  vendor_name,
                  description: description || '',
                  category_id: categoryId,
                  is_anomaly: false
                });

                await AnomalyDetectionService.checkAndFlagAnomaly(
                  expense.id, 
                  parseFloat(amount), 
                  categoryId
                );

                results.push(expense);
              } catch (error) {
                errors.push({ row, error: error.message });
              }
            })();
            promises.push(promise);
          })
          .on('end', async () => {
            try {
              // Wait for all promises to complete
              await Promise.all(promises);

              // Clean up uploaded file
              fs.unlinkSync(req.file.path);

              // Re-check all anomalies after bulk import
              await AnomalyDetectionService.recheckAllAnomalies();

              res.json({
                success: true,
                imported: results.length,
                errors: errors.length,
                errorDetails: errors
              });
              resolve();
            } catch (error) {
              if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
              }
              reject(error);
            }
          })
          .on('error', (error) => {
            if (fs.existsSync(req.file.path)) {
              fs.unlinkSync(req.file.path);
            }
            reject(error);
          });
      });
    } catch (error) {
      console.error('Error uploading CSV:', error);
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: 'Failed to process CSV', details: error.message });
    }
  }
}

module.exports = ExpenseController;
