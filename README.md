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
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_manager
DB_USER=postgres
DB_PASSWORD=your_password
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
