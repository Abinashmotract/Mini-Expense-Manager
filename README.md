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
- React with TypeScript
- React Router DOM
- Bootstrap
- Axios
- Font Awesome

### Backend
- Node.js with Express
- PostgreSQL
- Multer (for file uploads)
- CSV Parser
- CORS
- dotenv

### Database
- PostgreSQL

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
INTERNAL_DATABASE_URL=postgresql://expense_manager_h1y2_user:PghvnvYuRLHbQ9eLxSuRSRzemht5DtBm@dpg-d6e9js8gjchc738if5g0-a/expense_manager_h1y2
EXTERNAL_DATABASE_URL=postgresql://expense_manager_h1y2_user:PghvnvYuRLHbQ9eLxSuRSRzemht5DtBm@dpg-d6e9js8gjchc738if5g0-a.oregon-postgres.render.com/expense_manager_h1y2
PSQL_COMMAND=PGPASSWORD=PghvnvYuRLHbQ9eLxSuRSRzemht5DtBm psql -h dpg-d6e9js8gjchc738if5g0-a.oregon-postgres.render.com -U expense_manager_h1y2_user expense_manager_h1y2
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

## How to Start

1. Start the backend server first (from `backend` directory):
   ```bash
   npm start
   ```

2. Start the frontend server (from `frontend` directory):
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Deployment on Render

### Setting up Database Schema on Render

After creating a PostgreSQL database on Render, you need to run the schema SQL to create tables. You can do this in one of the following ways:

**Option 1: Using Render Database Console**
1. Go to your Render dashboard
2. Click on your PostgreSQL database
3. Go to "Connect" tab
4. Click "Connect via psql" or use the "Query" tab
5. Copy and paste the contents of `backend/db/schema.sql` and run it

**Option 2: Using psql from local machine**
```bash
# From the backend/db directory
PGPASSWORD='PghvnvYuRLHbQ9eLxSuRSRzemht5DtBm' psql -h dpg-d6e9js8gjchc738if5g0-a -p 5432 -U expense_manager_h1y2_user -d expense_manager_h1y2 -f schema.sql
```

**Option 3: Using Node.js script (Recommended - Easiest Method)**

1. Make sure your `.env` file in the backend directory has the Render database credentials (including `EXTERNAL_DATABASE_URL`)
2. Navigate to backend directory:
```bash
cd backend
```
3. Run the setup script:
```bash
node db/setup-render-db.js
```

This script will:
- Connect to your Render database using the external URL
- Run the schema SQL to create all tables
- Insert default categories and vendor mappings
- Verify that everything was created successfully

**If the script fails, use Option 4 below (Direct psql command)**

**Option 4: Direct psql Command (Quick Fix - Use This if script doesn't work)**

Run this command from your local machine (make sure you have psql installed):

```bash
cd backend
cat db/schema.sql | PGPASSWORD='PghvnvYuRLHbQ9eLxSuRSRzemht5DtBm' psql -h dpg-d6e9js8gjchc738if5g0-a.oregon-postgres.render.com -p 5432 -U expense_manager_h1y2_user -d expense_manager_h1y2
```

Or using the file directly:
```bash
cd backend/db
PGPASSWORD='PghvnvYuRLHbQ9eLxSuRSRzemht5DtBm' psql -h dpg-d6e9js8gjchc738if5g0-a.oregon-postgres.render.com -p 5432 -U expense_manager_h1y2_user -d expense_manager_h1y2 -f schema.sql
```

**✅ Schema Successfully Created!**

After running the schema, you should see:
- 3 tables created: `categories`, `vendor_category_mappings`, `expenses`
- 7 categories inserted
- 6 vendor mappings inserted

Verify by visiting:
- `https://mini-expense-manager.onrender.com/api/categories` (should return categories)
- `https://mini-expense-manager.onrender.com/api/vendor-mappings` (should return vendor mappings)
- `https://mini-expense-manager.onrender.com/api/expenses` (should return empty array, not an error)

## Assumptions

1. **Currency**: All amounts are in Indian Rupees (₹)
2. **Date Format**: Dates are stored in YYYY-MM-DD format
3. **Anomaly Threshold**: Fixed at 3× the category average (not configurable)
4. **Vendor Matching**: Case-insensitive matching with partial string matching
5. **Default Category**: Expenses without vendor mapping default to "Other" category
6. **CSV Format**: CSV files must have exact column names: `date`, `amount`, `vendor_name`, `description`

## Design Note

**Rule-based Categorization**: The system uses a simple vendor-to-category mapping table stored in the database. When an expense is added, it first checks for an exact vendor name match in the mappings table. If not found, it tries partial matching (case-insensitive). If still no match, it defaults to "Other" category. This approach is simple and works well for known vendors but requires manual mapping for new vendors.

**Anomaly Detection**: Anomalies are detected by comparing each expense amount to the average amount for its category. If an expense is more than 3× the category average, it's flagged as an anomaly. The average is calculated from all expenses in that category. This simple threshold-based approach is easy to understand but may flag legitimate large purchases.

**Data Model**: The database uses three main tables - `categories` (predefined categories), `vendor_category_mappings` (vendor-to-category rules), and `expenses` (all expense records with category_id and is_anomaly flag). This simple structure makes queries fast and the logic straightforward.

**Trade-offs**: The system prioritizes simplicity over sophistication. No machine learning is used for categorization - all rules are manually defined. Anomaly detection uses a fixed 3× multiplier rather than statistical methods. This makes the system easy to understand and maintain, but less flexible than more advanced solutions.

## License

ISC
