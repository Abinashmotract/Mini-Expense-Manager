-- Fix schema script - handles both old and new structures
-- This will check and fix the expenses table structure

-- First, check if we need to migrate from old structure
DO $$
BEGIN
    -- Check if expenses table has 'category' column (old structure)
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'expenses' 
        AND column_name = 'category'
    ) THEN
        -- Old structure detected - need to migrate
        RAISE NOTICE 'Old structure detected. Migrating...';
        
        -- Drop the old expenses table (data will be lost)
        DROP TABLE IF EXISTS expenses CASCADE;
        
        -- Recreate with correct structure
        CREATE TABLE expenses (
            id SERIAL PRIMARY KEY,
            date DATE NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            vendor_name VARCHAR(255) NOT NULL,
            description TEXT,
            category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
            is_anomaly BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Create indexes
        CREATE INDEX idx_expenses_date ON expenses(date);
        CREATE INDEX idx_expenses_category ON expenses(category_id);
        CREATE INDEX idx_expenses_vendor ON expenses(vendor_name);
        CREATE INDEX idx_expenses_anomaly ON expenses(is_anomaly);
        
        RAISE NOTICE 'Migration complete!';
    ELSE
        -- Check if category_id exists
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'expenses' 
            AND column_name = 'category_id'
        ) THEN
            -- Table might not exist, create it
            CREATE TABLE IF NOT EXISTS expenses (
                id SERIAL PRIMARY KEY,
                date DATE NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                vendor_name VARCHAR(255) NOT NULL,
                description TEXT,
                category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
                is_anomaly BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            -- Create indexes
            CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
            CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category_id);
            CREATE INDEX IF NOT EXISTS idx_expenses_vendor ON expenses(vendor_name);
            CREATE INDEX IF NOT EXISTS idx_expenses_anomaly ON expenses(is_anomaly);
            
            RAISE NOTICE 'Table created!';
        ELSE
            RAISE NOTICE 'Structure is already correct!';
        END IF;
    END IF;
END $$;

-- Ensure categories table exists
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure vendor_category_mappings table exists
CREATE TABLE IF NOT EXISTS vendor_category_mappings (
    id SERIAL PRIMARY KEY,
    vendor_name VARCHAR(255) UNIQUE NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for vendor mappings
CREATE INDEX IF NOT EXISTS idx_vendor_mappings_vendor ON vendor_category_mappings(vendor_name);

-- Insert default categories
INSERT INTO categories (name) VALUES 
    ('Food'),
    ('Transportation'),
    ('Shopping'),
    ('Bills'),
    ('Entertainment'),
    ('Healthcare'),
    ('Other')
ON CONFLICT (name) DO NOTHING;

-- Insert default vendor mappings
INSERT INTO vendor_category_mappings (vendor_name, category_id) VALUES
    ('Swiggy', (SELECT id FROM categories WHERE name = 'Food')),
    ('Zomato', (SELECT id FROM categories WHERE name = 'Food')),
    ('Uber', (SELECT id FROM categories WHERE name = 'Transportation')),
    ('Ola', (SELECT id FROM categories WHERE name = 'Transportation')),
    ('Amazon', (SELECT id FROM categories WHERE name = 'Shopping')),
    ('Flipkart', (SELECT id FROM categories WHERE name = 'Shopping'))
ON CONFLICT (vendor_name) DO NOTHING;
