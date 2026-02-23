import React from 'react';
import ExpenseList from '../components/ExpenseList';
import './ExpensesPage.css';

const ExpensesPage: React.FC = () => {
  return (
    <div className="expenses-page">
      <ExpenseList />
    </div>
  );
};

export default ExpensesPage;
