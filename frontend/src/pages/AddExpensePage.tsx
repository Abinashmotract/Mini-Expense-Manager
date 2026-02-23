import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddExpense from '../components/AddExpense';
import './AddExpensePage.css';

const AddExpensePage: React.FC = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    // Optionally navigate to expenses list after adding
    // navigate('/expenses');
  };

  return (
    <div className="add-expense-page">
      <AddExpense onSuccess={handleSuccess} key={refreshKey} />
    </div>
  );
};

export default AddExpensePage;
