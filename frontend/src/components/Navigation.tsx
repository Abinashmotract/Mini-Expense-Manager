import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="main-navigation">
      <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
        <i className="fas fa-chart-pie"></i>
        <span>Dashboard</span>
      </Link>
      <Link to="/add-expense" className={`nav-link ${isActive('/add-expense') ? 'active' : ''}`}>
        <i className="fas fa-plus-circle"></i>
        <span>Add Expense</span>
      </Link>
      <Link to="/expenses" className={`nav-link ${isActive('/expenses') ? 'active' : ''}`}>
        <i className="fas fa-list"></i>
        <span>All Expenses</span>
      </Link>
      <Link to="/upload-csv" className={`nav-link ${isActive('/upload-csv') ? 'active' : ''}`}>
        <i className="fas fa-upload"></i>
        <span>Upload CSV</span>
      </Link>
      <Link to="/vendor-mappings" className={`nav-link ${isActive('/vendor-mappings') ? 'active' : ''}`}>
        <i className="fas fa-tags"></i>
        <span>Vendor Mappings</span>
      </Link>
    </nav>
  );
};

export default Navigation;
