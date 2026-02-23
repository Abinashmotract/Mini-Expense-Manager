import React, { useEffect, useState } from 'react';
import { vendorMappingApi, categoryApi, VendorMapping, Category } from '../services/api';

const VendorMappings: React.FC = () => {
  const [mappings, setMappings] = useState<VendorMapping[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMapping, setNewMapping] = useState({ vendor_name: '', category_id: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [mappingsData, categoriesData] = await Promise.all([
        vendorMappingApi.getAll(),
        categoryApi.getAll(),
      ]);
      setMappings(mappingsData);
      setCategories(categoriesData);
    } catch (err: any) {
      setError(err.message || 'Failed to load vendor mappings');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMapping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMapping.vendor_name || !newMapping.category_id) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      await vendorMappingApi.create(newMapping.vendor_name, parseInt(newMapping.category_id));
      setMessage({ type: 'success', text: 'Vendor mapping added successfully!' });
      setNewMapping({ vendor_name: '', category_id: '' });
      setShowAddForm(false);
      loadData();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to add vendor mapping',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this mapping?')) {
      return;
    }

    try {
      await vendorMappingApi.delete(id);
      setMessage({ type: 'success', text: 'Vendor mapping deleted successfully!' });
      loadData();
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to delete vendor mapping',
      });
    }
  };

  if (loading) {
    return <div className="card loading">Loading vendor mappings...</div>;
  }

  if (error) {
    return <div className="card alert alert-error">{error}</div>;
  }

  return (
    <div className="card">
      <div className="card-title">
        <i className="fas fa-rule"></i> vendor → category mapping
      </div>

      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      <div className="rule-mapping">
        {mappings.map((mapping) => (
          <span key={mapping.id} className="rule-badge">
            <i className="fas fa-tag"></i> {mapping.vendor_name} : {mapping.category_name}
            <button
              onClick={() => handleDelete(mapping.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#dc3545',
                cursor: 'pointer',
                marginLeft: '8px',
                padding: '0 4px'
              }}
              title="Delete"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {showAddForm && (
        <form onSubmit={handleAddMapping} style={{background: '#f7fafc', padding: '1rem', borderRadius: '12px', marginTop: '1rem', border: '1px solid #d8e0e8'}}>
          <div className="form-field">
            <label>Vendor Name *</label>
            <input
              type="text"
              value={newMapping.vendor_name}
              onChange={(e) => setNewMapping({ ...newMapping, vendor_name: e.target.value })}
              placeholder="e.g., Swiggy, Amazon"
              required
            />
          </div>
          <div className="form-field">
            <label>Category *</label>
            <select
              value={newMapping.category_id}
              onChange={(e) => setNewMapping({ ...newMapping, category_id: e.target.value })}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{display: 'flex', gap: '0.5rem'}}>
            <button type="submit" className="btn btn-sm" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Mapping'}
            </button>
            <button type="button" className="btn-secondary btn-sm" onClick={() => {
              setShowAddForm(false);
              setNewMapping({ vendor_name: '', category_id: '' });
            }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {!showAddForm && (
        <button
          className="btn-secondary btn-sm"
          onClick={() => setShowAddForm(true)}
          style={{marginTop: '0.5rem'}}
        >
          <i className="fas fa-plus"></i> Add Mapping
        </button>
      )}

      <p style={{fontSize: '0.8rem', marginTop: '0.5rem', color: '#546e7a'}}>
        <i className="icon-green fas fa-magic"></i> Auto‑category on add / upload
      </p>
    </div>
  );
};

export default VendorMappings;
