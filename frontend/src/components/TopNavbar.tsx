import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCurrentMonthName } from '../utils/constants';
import './TopNavbar.css';

const TopNavbar: React.FC = () => {
  const location = useLocation();
  const currentDate = new Date();
  const currentMonth = getCurrentMonthName();
  const currentYear = currentDate.getFullYear();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="top-navbar">
      <div className="navbar-left">
        <h1>
          <i className="fas fa-receipt"></i> Mini Expense Manager
        </h1>
        <div className="date-badge">
          <i className="fas fa-calendar-alt"></i> {currentMonth} {currentYear} · active
        </div>
      </div>
      
      <div className="navbar-menu">
        <Link to="/" className={`nav-menu-item ${isActive('/') ? 'active' : ''}`}>
          <i className="fas fa-chart-pie"></i>
          <span>Dashboard</span>
        </Link>
        <Link to="/add-expense" className={`nav-menu-item ${isActive('/add-expense') ? 'active' : ''}`}>
          <i className="fas fa-plus-circle"></i>
          <span>Add Expense</span>
        </Link>
        <Link to="/expenses" className={`nav-menu-item ${isActive('/expenses') ? 'active' : ''}`}>
          <i className="fas fa-list"></i>
          <span>All Expenses</span>
        </Link>
        <Link to="/upload-csv" className={`nav-menu-item ${isActive('/upload-csv') ? 'active' : ''}`}>
          <i className="fas fa-upload"></i>
          <span>Upload CSV</span>
        </Link>
        <Link to="/vendor-mappings" className={`nav-menu-item ${isActive('/vendor-mappings') ? 'active' : ''}`}>
          <i className="fas fa-tags"></i>
          <span>Vendor Mappings</span>
        </Link>
      </div>
    </nav>
  );
};

export default TopNavbar;
