import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TopNavbar from './components/TopNavbar';
import DashboardPage from './pages/DashboardPage';
import AddExpensePage from './pages/AddExpensePage';
import ExpensesPage from './pages/ExpensesPage';
import UploadCSVPage from './pages/UploadCSVPage';
import VendorMappingsPage from './pages/VendorMappingsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <TopNavbar />

        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/add-expense" element={<AddExpensePage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/upload-csv" element={<UploadCSVPage />} />
          <Route path="/vendor-mappings" element={<VendorMappingsPage />} />
        </Routes>

        <div className="app-footer">
          <i className="fas fa-robot"></i> rule‑based categorization · anomaly detection (3× average) · mini expense manager
        </div>
      </div>
    </Router>
  );
}

export default App;
