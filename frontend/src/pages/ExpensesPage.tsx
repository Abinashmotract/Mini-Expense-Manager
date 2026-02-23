import React, { useState } from 'react';
import ExpenseList from '../components/ExpenseList';
import './ExpensesPage.css';

const ExpensesPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="expenses-page">
      <ExpenseList key={refreshKey} />
    </div>
  );
};

export default ExpensesPage;
