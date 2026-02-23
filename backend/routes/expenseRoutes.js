const express = require('express');
const router = express.Router();
const ExpenseController = require('../controllers/expenseController');
const multer = require('multer');
const path = require('path');

// Configure multer for CSV uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || path.extname(file.originalname) === '.csv') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

router.post('/', ExpenseController.addExpense);
router.get('/', ExpenseController.getAllExpenses);
router.get('/anomalies', ExpenseController.getAnomalies);
router.post('/upload-csv', upload.single('csv'), ExpenseController.uploadCSV);

module.exports = router;
