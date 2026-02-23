# Expense Manager

A full-stack expense tracking application with automatic categorization, anomaly detection, and comprehensive dashboard analytics.

## Features

- **Add Expense Manually**: Track expenses with date, amount, vendor name, and description
- **Automatic Categorization**: Expenses are automatically categorized based on vendor-to-category mappings
- **CSV Upload**: Bulk import expenses from CSV files
- **Anomaly Detection**: Automatically flags expenses that are more than 3× the average for their category
- **Dashboard**: View monthly totals by category, top vendors, and anomaly statistics
- **Vendor Mappings**: Manage vendor-to-category mappings for automatic categorization

## Tech Stack

- **Frontend**: React + TypeScript
- **Backend**: Node.js + Express
- **Database**: PostgreSQL

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

2. Run the schema SQL to create tables and insert default data:
```bash
psql -d expense_manager -f backend/db/schema.sql
```

Alternatively, you can connect to PostgreSQL and run the SQL file:
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

3. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your PostgreSQL credentials:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_manager
DB_USER=postgres
DB_PASSWORD=your_password
```

5. Create the uploads directory:
```bash
mkdir uploads
```

6. Start the backend server:
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

3. Create a `.env` file in the frontend directory (optional, defaults to localhost:5000):
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

### Adding Expenses

1. Navigate to the "Add Expense" tab
2. Fill in the date, amount, vendor name, and optional description
3. Click "Add Expense"
4. The category will be automatically assigned based on vendor name

### Uploading CSV

1. Navigate to the "Upload CSV" tab
2. Prepare a CSV file with the following columns:
   - `date` (format: YYYY-MM-DD)
   - `amount` (numeric)
   - `vendor_name` (text)
   - `description` (optional, text)
3. Select the CSV file and click "Upload CSV"
4. The system will import all valid expenses and show any errors

Example CSV:
```csv
date,amount,vendor_name,description
2024-01-15,250.50,Swiggy,Lunch order
2024-01-16,500.00,Amazon,Office supplies
2024-01-17,150.00,Uber,Commute to office
```

### Managing Vendor Mappings

1. Navigate to the "Vendor Mappings" tab
2. Click "+ Add Mapping"
3. Enter a vendor name and select a category
4. Click "Add Mapping"
5. Expenses from this vendor will now be automatically categorized

### Viewing Dashboard

1. Navigate to the "Dashboard" tab
2. Select the year and month to view
3. View:
   - Total monthly spend
   - Monthly totals by category
   - Top 5 vendors by total spend
   - Anomaly count and recent anomalies

### Viewing Expenses

1. Navigate to the "All Expenses" tab
2. View all expenses or filter to show only anomalies
3. Anomalies are highlighted in red

## API Endpoints

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Add a new expense
- `GET /api/expenses/anomalies` - Get all anomalies
- `POST /api/expenses/upload-csv` - Upload CSV file

### Dashboard
- `GET /api/dashboard?year=2024&month=1` - Get dashboard data

### Categories
- `GET /api/categories` - Get all categories

### Vendor Mappings
- `GET /api/vendor-mappings` - Get all vendor mappings
- `POST /api/vendor-mappings` - Create a vendor mapping
- `DELETE /api/vendor-mappings/:id` - Delete a vendor mapping

## Default Categories

The system comes with the following default categories:
- Food
- Transportation
- Shopping
- Bills
- Entertainment
- Healthcare
- Other

## Default Vendor Mappings

The system includes some default vendor mappings:
- Swiggy → Food
- Zomato → Food
- Uber → Transportation
- Ola → Transportation
- Amazon → Shopping
- Flipkart → Shopping

## Anomaly Detection

An expense is flagged as an anomaly if its amount is more than 3× the average amount for its category. This helps identify unusual spending patterns.

## Project Structure

```
Expense Manager/
├── backend/
│   ├── controllers/     # Request handlers
│   ├── db/             # Database connection and schema
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   └── server.js       # Express server
├── frontend/
│   ├── public/         # Static files
│   └── src/
│       ├── components/ # React components
│       ├── services/   # API service layer
│       └── App.tsx     # Main app component
└── README.md
```

## License

ISC
# Mini-Expense-Manager
