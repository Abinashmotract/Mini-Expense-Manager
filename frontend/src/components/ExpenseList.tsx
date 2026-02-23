import React, { useEffect, useState } from 'react';
import { expenseApi, Expense } from '../services/api';

const ExpenseList: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anomalies, setAnomalies] = useState<Expense[]>([]);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const [allExpenses, anomaliesData] = await Promise.all([
        expenseApi.getAll(),
        expenseApi.getAnomalies(),
      ]);
      setExpenses(allExpenses.slice(0, 10)); // Show latest 10
      setAnomalies(anomaliesData);
    } catch (err: any) {
      setError(err.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="card loading">Loading expenses...</div>;
  }

  if (error) {
    return <div className="card alert alert-error">{error}</div>;
  }

  return (
    <>
      {/* Anomalies Card */}
      {anomalies.length > 0 && (
        <div className="card">
          <div className="card-title">
            <i className="fas fa-exclamation-triangle" style={{color: '#c2410c'}}></i> flagged anomalies ( &gt; 3× avg )
          </div>
          <div className="anomaly-list">
            {anomalies.slice(0, 5).map((anomaly) => (
              <div key={anomaly.id} className="anomaly-item">
                <div className="anomaly-icon">
                  <i className="fas fa-exclamation"></i>
                </div>
                <div className="anomaly-detail">
                  <span><strong>{anomaly.vendor_name}</strong> · {anomaly.category_name}</span>
                  <span className="anomaly-amount">₹{anomaly.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <span className="chip">Anomaly</span>
              </div>
            ))}
          </div>
          <p style={{textAlign: 'right', fontSize: '0.9rem', marginTop: '6px', fontWeight: '600', color: '#c2410c'}}>
            🚩 <strong>{anomalies.length} anomalies</strong> detected
          </p>
        </div>
      )}

      {/* Latest Expenses */}
      <div className="card" style={{background: '#fbfdff'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <div className="card-title" style={{border: 'none', padding: 0, margin: 0}}>
            <i className="fas fa-list-ul"></i> latest expenses
          </div>
          <span className="chip">auto‑categorized</span>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          {expenses.length === 0 ? (
            <div className="empty-state">
              <p>No expenses found</p>
            </div>
          ) : (
            expenses.map((expense) => {
              const isAnomaly = expense.is_anomaly;
              return (
                <div
                  key={expense.id}
                  className="expense-list-item"
                  style={{
                    background: isAnomaly ? '#ffefed' : 'transparent',
                    borderRadius: isAnomaly ? '60px' : '0',
                    paddingLeft: isAnomaly ? '0.5rem' : '0',
                    paddingRight: isAnomaly ? '0.5rem' : '0',
                  }}
                >
                  <span>
                    {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {expense.vendor_name}{' '}
                    <span className="text-muted">({expense.category_name})</span>
                    {isAnomaly && ' 🚨'}
                  </span>
                  <span style={{fontWeight: '600', color: isAnomaly ? '#b91c1c' : '#1e293b'}}>
                    ₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default ExpenseList;
