#!/bin/bash

# Setup script for Expense Manager Backend

echo "Setting up Expense Manager Backend..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_manager
DB_USER=postgres
DB_PASSWORD=postgres
EOF
    echo ".env file created. Please update it with your database credentials."
else
    echo ".env file already exists."
fi

# Create uploads directory
if [ ! -d uploads ]; then
    echo "Creating uploads directory..."
    mkdir uploads
    echo "Uploads directory created."
else
    echo "Uploads directory already exists."
fi

# Install dependencies
echo "Installing dependencies..."
npm install

echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your PostgreSQL credentials"
echo "2. Create the database: createdb expense_manager"
echo "3. Run the schema: psql -d expense_manager -f db/schema.sql"
echo "4. Start the server: npm start"
