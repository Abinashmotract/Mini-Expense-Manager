# Mini Expense Manager

A simple expense tracking application with automatic categorization and anomaly detection.

## Features

- **Add Expense Manually**: Track expenses with date, amount, vendor name, and description
- **Automatic Categorization**: Expenses are automatically categorized based on vendor-to-category mappings
- **CSV Upload**: Bulk import expenses from CSV files
- **Anomaly Detection**: Automatically flags expenses that are more than 3× the average for their category
- **Dashboard**: View monthly totals by category, top vendors, and anomaly statistics
- **Vendor Mappings**: Manage vendor-to-category mappings for automatic categorization

## Technologies Used

### Frontend
- React 18.2.0
- TypeScript 4.9.5
- React Router DOM 6.30.3
- Bootstrap 5.3.8
- Axios 1.6.2
- Font Awesome 6.0.0

### Backend
- Node.js
- Express 4.18.2
- PostgreSQL (pg 8.11.3)
- Multer 1.4.5 (for file uploads)
- CSV Parser 3.0.0
- CORS 2.8.5
- dotenv 16.3.1

### Database
- PostgreSQL 12+

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Database Setup

1. Create a PostgreSQL database:
```bash
createdb expense_manager
```

2. Run the schema SQL to create tables:
```bash
psql -d expense_manager -f backend/db/schema.sql
```

Or connect with your PostgreSQL user:
```bash
psql -U postgres -d expense_manager -f backend/db/schema.sql
```

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with your database credentials:
```
PORT=5000
DB_HOST=dpg-d6e9js8gjchc738if5g0-a
DB_PORT=5432
DB_NAME=expense_manager_h1y2
DB_USER=expense_manager_h1y2_user
DB_PASSWORD=PghvnvYuRLHbQ9eLxSuRSRzemht5DtBm
```

4. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

### Adding Expenses

1. Go to "Add Expense" page
2. Fill in date, amount, vendor name, and description
3. Click "Add Expense"
4. Category is automatically assigned based on vendor name

### Uploading CSV

1. Go to "Upload CSV" page
2. Prepare a CSV file with columns: `date`, `amount`, `vendor_name`, `description`
3. Select the CSV file and click "Upload CSV"

Example CSV:
```csv
date,amount,vendor_name,description
2024-01-15,250.50,Swiggy,Lunch order
2024-01-16,500.00,Amazon,Office supplies
```

### Managing Vendor Mappings

1. Go to "Vendor Mappings" page
2. Click "Add Mapping"
3. Enter vendor name and select category
4. Expenses from this vendor will be automatically categorized

### Viewing Dashboard

1. Go to "Dashboard" page
2. View monthly totals, category breakdown, top vendors, and anomalies

## API Endpoints

- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Add a new expense
- `GET /api/expenses/anomalies` - Get all anomalies
- `POST /api/expenses/upload-csv` - Upload CSV file
- `GET /api/dashboard?year=2024&month=1` - Get dashboard data
- `GET /api/categories` - Get all categories
- `GET /api/vendor-mappings` - Get all vendor mappings
- `POST /api/vendor-mappings` - Create a vendor mapping
- `DELETE /api/vendor-mappings/:id` - Delete a vendor mapping

## Assumptions

1. **Currency**: All amounts are in Indian Rupees (₹)
2. **Date Format**: Dates are stored in YYYY-MM-DD format
3. **Anomaly Threshold**: Fixed at 3× the category average (not configurable)
4. **Vendor Matching**: Case-insensitive matching with partial string matching
5. **Default Category**: Expenses without vendor mapping default to "Other" category
6. **CSV Format**: CSV files must have exact column names: `date`, `amount`, `vendor_name`, `description`

## Design Note

**Rule-based Categorization**: The system uses a simple vendor-to-category mapping table. When an expense is added, it first checks for an exact vendor name match. If not found, it tries partial matching (case-insensitive). If still no match, it defaults to "Other" category. This is a simple approach that works well for known vendors but requires manual mapping for new vendors.

**Anomaly Detection**: Anomalies are detected by comparing each expense amount to the average amount for its category. If an expense is more than 3× the category average, it's flagged as an anomaly. The average is calculated from all expenses in that category. This simple threshold-based approach is easy to understand but may flag legitimate large purchases.

**Data Model**: The database uses three main tables - `categories` (predefined categories), `vendor_category_mappings` (vendor-to-category rules), and `expenses` (all expense records with category_id and is_anomaly flag). This simple structure makes queries fast and the logic straightforward.

**Trade-offs**: The system prioritizes simplicity over sophistication. No machine learning is used for categorization - all rules are manually defined. Anomaly detection uses a fixed 3× multiplier rather than statistical methods. This makes the system easy to understand and maintain, but less flexible than more advanced solutions.

## Project Structure

```
Expense Manager/
├── backend/
│   ├── controllers/     # Request handlers
│   ├── db/             # Database connection and schema
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── services/        # Business logic (categorization, anomaly detection)
│   └── server.js        # Express server
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       ├── services/    # API service layer
│       └── App.tsx      # Main app component
└── README.md
```

## License

ISC
