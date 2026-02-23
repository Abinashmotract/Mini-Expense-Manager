-- Migration script to fix schema
-- This will drop existing tables and recreate them with correct structure

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS vendor_category_mappings CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vendor_category_mappings table
CREATE TABLE vendor_category_mappings (
    id SERIAL PRIMARY KEY,
    vendor_name VARCHAR(255) UNIQUE NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create expenses table
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

-- Create indexes for better query performance
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category_id);
CREATE INDEX idx_expenses_vendor ON expenses(vendor_name);
CREATE INDEX idx_expenses_anomaly ON expenses(is_anomaly);
CREATE INDEX idx_vendor_mappings_vendor ON vendor_category_mappings(vendor_name);

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

-- Insert some default vendor mappings
INSERT INTO vendor_category_mappings (vendor_name, category_id) VALUES
    ('Swiggy', (SELECT id FROM categories WHERE name = 'Food')),
    ('Zomato', (SELECT id FROM categories WHERE name = 'Food')),
    ('Uber', (SELECT id FROM categories WHERE name = 'Transportation')),
    ('Ola', (SELECT id FROM categories WHERE name = 'Transportation')),
    ('Amazon', (SELECT id FROM categories WHERE name = 'Shopping')),
    ('Flipkart', (SELECT id FROM categories WHERE name = 'Shopping'))
ON CONFLICT (vendor_name) DO NOTHING;
