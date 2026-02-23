import React, { useEffect, useState } from 'react';
import { dashboardApi, Expense } from '../services/api';
import { getMonthNameByIndex } from '../utils/constants';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const selectedYear = new Date().getFullYear();
        const selectedMonth = new Date().getMonth() + 1;
        const dashboardData = await dashboardApi.getData(selectedYear, selectedMonth);
        setData(dashboardData);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) {
    return <div className="card loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="card alert alert-error">{error}</div>;
  }

  if (!data) {
    return <div className="card empty-state">No data available</div>;
  }

  const totalMonthly = data.monthlyTotals.reduce(
    (sum: number, item: any) => sum + parseFloat(item.total),
    0
  );

  // Get category colors
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Food': 'food',
      'Transportation': 'transport',
      'Shopping': 'shopping',
      'Entertainment': 'entertainment',
      'Healthcare': 'health',
      'Bills': 'bills',
      'Other': 'other'
    };
    return colors[category] || 'other';
  };

  // Calculate max for bar width
  const maxAmount = Math.max(...data.monthlyTotals.map((item: any) => parseFloat(item.total)), 1);

  return (
    <>
      {/* Bootstrap 5 Grid Layout */}
      <div className="container-fluid">
        <div className="row g-3">
          {/* Left Column - Summary Grid */}
          <div className="col-12 col-md-6">
            <div className="summary-grid">
              <div className="stat-card">
                <div className="label"><i className="fas fa-calendar"></i> monthly total</div>
                <div className="value">₹{totalMonthly.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <span style={{ fontSize: '0.8rem', color: '#546e7a' }}>Current month</span>
              </div>
              <div className="stat-card">
                <div className="label"><i className="fas fa-flag"></i> anomalies</div>
                <div className="value" style={{ color: '#b3410c' }}>{data.anomalyCount}</div>
                <span style={{ fontSize: '0.8rem', color: '#546e7a' }}>needs review</span>
              </div>
              <div className="stat-card">
                <div className="label"><i className="fas fa-layer-group"></i> categories</div>
                <div className="value">{data.monthlyTotals.length}</div>
                <span style={{ fontSize: '0.8rem', color: '#546e7a' }}>active</span>
              </div>
              <div className="stat-card">
                <div className="label"><i className="fas fa-store"></i> vendors</div>
                <div className="value">{data.topVendors.length}</div>
                <span style={{ fontSize: '0.8rem', color: '#546e7a' }}>this month</span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Category Bars */}
          <div className="col-12 col-md-6">
            <div className="card">
              <div className="card-title">
                <i className="fas fa-chart-pie"></i> monthly totals per category ({getMonthNameByIndex(new Date().getMonth())})
              </div>
              <div className="category-bars">
                {data.monthlyTotals.map((item: any, index: number) => {
                  const amount = parseFloat(item.total);
                  const percentage = (amount / maxAmount) * 100;
                  const colorClass = getCategoryColor(item.category);
                  return (
                    <div key={index} className="cat-row">
                      <span className="cat-name">{item.category}</span>
                      <div className="bar-bg">
                        <div className={`bar-fill ${colorClass}`} style={{ width: `${percentage}%` }}>
                          ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </div>
                      </div>
                      <span className="cat-amount">₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 Vendors */}
      <div className="container-fluid">
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-title">
                <i className="fas fa-trophy"></i> top 5 vendors (total spend)
              </div>
              <ul className="vendor-list">
                {data.topVendors.map((vendor: any, index: number) => {
                  const rankIcon = index === 0 ? 'fas fa-crown' : index < 3 ? 'fas fa-medal' : '';
                  const rankColor = index === 0 ? '#a9742c' : index < 3 ? '#b0a67f' : '';
                  return (
                    <li key={index}>
                      <span>
                        {rankIcon && <i className={`${rankIcon} rank-icon`} style={{ color: rankColor }}></i>}
                        {index + 1}. {vendor.vendor_name}
                      </span>
                      <strong>₹{parseFloat(vendor.total_spend).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    </li>
                  );
                })}
              </ul>

              {data.anomalies.length > 0 && (
                <>
                  <hr />
                  <div className="card-title" style={{ marginBottom: '0.8rem' }}>
                    <i className="fas fa-bolt" style={{ color: '#c2410c' }}></i> anomalies summary
                  </div>
                  <div className="anomaly-summary">
                    <span className="flag-badge">
                      <i className="fas fa-fire"></i> {data.anomalyCount} anomalies
                    </span>
                    {data.anomalies.slice(0, 5).map((anomaly: Expense, index: number) => (
                      <span key={index} className="chip" style={{ background: '#fceae5' }}>
                        {anomaly.category_name} : ₹{anomaly.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
