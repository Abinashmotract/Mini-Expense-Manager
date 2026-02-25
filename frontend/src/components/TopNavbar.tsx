import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCurrentMonthName } from '../utils/constants';
import './TopNavbar.css';

const TopNavbar: React.FC = () => {
  const location = useLocation();
  const currentDate = new Date();
  const currentMonth = getCurrentMonthName();
  const currentYear = currentDate.getFullYear();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as Node;
      if (
        isMenuOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(target) &&
        !buttonRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav className="top-navbar">
      <div className="navbar-left">
        <Link to="/" className='text-decoration-none'>
          <h1>
            <i className="fas fa-receipt"></i> Mini Expense Manager
          </h1>
        </Link>
        <div className="date-badge">
          <i className="fas fa-calendar-alt"></i> {currentMonth} {currentYear} · active
        </div>
        <button 
          ref={buttonRef}
          className="hamburger-menu" 
          onClick={toggleMenu} 
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      <div 
        ref={menuRef}
        className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}
        aria-hidden={!isMenuOpen}
      >
        <Link to="/" className={`nav-menu-item ${isActive('/') ? 'active' : ''}`} onClick={closeMenu}>
          <i className="fas fa-chart-pie"></i>
          <span>Dashboard</span>
        </Link>
        <Link to="/add-expense" className={`nav-menu-item ${isActive('/add-expense') ? 'active' : ''}`} onClick={closeMenu}>
          <i className="fas fa-plus-circle"></i>
          <span>Add Expense</span>
        </Link>
        <Link to="/expenses" className={`nav-menu-item ${isActive('/expenses') ? 'active' : ''}`} onClick={closeMenu}>
          <i className="fas fa-list"></i>
          <span>All Expenses</span>
        </Link>
        <Link to="/upload-csv" className={`nav-menu-item ${isActive('/upload-csv') ? 'active' : ''}`} onClick={closeMenu}>
          <i className="fas fa-upload"></i>
          <span>Upload CSV</span>
        </Link>
        <Link to="/vendor-mappings" className={`nav-menu-item ${isActive('/vendor-mappings') ? 'active' : ''}`} onClick={closeMenu}>
          <i className="fas fa-tags"></i>
          <span>Vendor Mappings</span>
        </Link>
      </div>
    </nav>
  );
};

export default TopNavbar;
