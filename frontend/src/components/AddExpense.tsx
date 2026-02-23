import React, { useState } from 'react';
import { expenseApi } from '../services/api';

interface AddExpenseProps {
  onSuccess?: () => void;
}

const AddExpense: React.FC<AddExpenseProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    vendor_name: '',
    description: '',
  });
  const [category, setCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await expenseApi.add({
        date: formData.date,
        amount: parseFloat(formData.amount),
        vendor_name: formData.vendor_name,
        description: formData.description,
      });

      setMessage({ type: 'success', text: 'Expense added successfully!' });
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        vendor_name: '',
        description: '',
      });
      setCategory('');

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to add expense',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Auto-detect category based on vendor name (simplified)
    if (name === 'vendor_name') {
      const vendorLower = value.toLowerCase();
      if (vendorLower.includes('swiggy') || vendorLower.includes('zomato')) {
        setCategory('Food');
      } else if (vendorLower.includes('uber') || vendorLower.includes('ola')) {
        setCategory('Transportation');
      } else if (vendorLower.includes('amazon') || vendorLower.includes('flipkart')) {
        setCategory('Shopping');
      } else {
        setCategory('');
      }
    }
  };

  return (
    <div className="card">
      <div className="card-title">
        <i className="fas fa-pen-alt"></i> Add expense (manual)
      </div>

      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-field">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Amount (₹)</label>
          <input
            type="number"
            name="amount"
            placeholder="24.50"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>
        <div className="form-field">
          <label>Vendor</label>
          <input
            type="text"
            name="vendor_name"
            placeholder="e.g. Swiggy"
            value={formData.vendor_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Category (auto)</label>
          <input
            type="text"
            placeholder="Food"
            value={category}
            readOnly
            style={{background: '#edf2f7'}}
          />
        </div>
        <div className="form-field full-width">
          <label>Description</label>
          <input
            type="text"
            name="description"
            placeholder="Lunch delivery"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className="full-width">
          <button type="submit" className="btn btn-sm" disabled={loading}>
            <i className="fas fa-plus-circle"></i> {loading ? 'Adding...' : 'Add expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;
