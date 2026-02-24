# Mini Expense Manager

A simple expense tracking application where you can add expenses manually or upload CSV files. The app automatically categorizes expenses and detects unusual spending.

## Features

- Add expenses manually with date, amount, vendor name, and description
- Upload multiple expenses at once using CSV file
- Automatic categorization based on vendor name (e.g., Swiggy → Food)
- Anomaly detection - flags expenses that are 3 times more than average
- Dashboard showing monthly totals, top vendors, and anomalies
- Manage vendor to category mappings

## Technologies Used

**Frontend:**
- React with TypeScript
- React Router for navigation
- Bootstrap for styling
- Axios for API calls

**Backend:**
- Node.js with Express
- PostgreSQL database
- Multer for file uploads
- CSV Parser for reading CSV files

## Setup Instructions

### 1. Database Setup

First, create a PostgreSQL database and run the schema:

```bash
# Create database
createdb expense_manager

# Run schema to create tables
psql -d expense_manager -f backend/db/schema.sql
```

### 2. Backend Setup

1. Go to backend folder:
```bash
cd backend
```

2. Install packages:
```bash
npm install
```

3. Create `.env` file in backend folder with your database details:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_manager
DB_USER=postgres
DB_PASSWORD=your_password
```

4. Start backend server:
```bash
npm start
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

1. Go to frontend folder:
```bash
cd frontend
```

2. Install packages:
```bash
npm install
```

3. Start frontend:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## How to Run

1. Start backend first (from `backend` folder): `npm start`
2. Start frontend (from `frontend` folder): `npm start`
3. Open browser and go to `http://localhost:3000`

## Assumptions

1. All amounts are in Indian Rupees (₹)
2. Dates are in YYYY-MM-DD format
3. Anomaly threshold is fixed at 3 times the category average
4. Vendor name matching is case-insensitive
5. If vendor is not found in mappings, it goes to "Other" category
6. CSV file should have columns: date, amount, vendor_name, description

## Design Note

**Rule-based Categorization:** I created a vendor-to-category mapping table in the database. When someone adds an expense, the system checks if the vendor name matches any mapping. If it finds a match, it assigns that category. If not found, it tries partial matching (like "swiggy" matches "Swiggy"). If still no match, it uses "Other" category. This is simple but works well for known vendors.

**Anomaly Detection:** For anomaly detection, I calculate the average expense amount for each category. Then I check if any expense is more than 3 times that average. If yes, I mark it as an anomaly. This is a simple way to find unusual spending.

**Data Model:** I used 3 main tables - `categories` (list of categories), `vendor_category_mappings` (which vendor belongs to which category), and `expenses` (all expense records). Each expense has a category_id and an is_anomaly flag. This structure is simple and easy to query.

**Trade-offs:** I kept things simple instead of using complex methods. No machine learning for categorization - just manual rules. For anomalies, I used a fixed 3x multiplier instead of statistical methods. This makes the code easy to understand but might not be as smart as advanced solutions.
