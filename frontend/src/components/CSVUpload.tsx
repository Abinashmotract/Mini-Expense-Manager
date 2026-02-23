import React, { useState } from 'react';
import { expenseApi } from '../services/api';

interface CSVUploadProps {
  onSuccess?: () => void;
}

const CSVUpload: React.FC<CSVUploadProps> = ({ onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage(null);
      setUploadResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a CSV file' });
      return;
    }

    setLoading(true);
    setMessage(null);
    setUploadResult(null);

    try {
      const result = await expenseApi.uploadCSV(file);
      setUploadResult(result);
      setMessage({
        type: 'success',
        text: `Successfully imported ${result.imported} expenses${result.errors > 0 ? ` (${result.errors} errors)` : ''}`,
      });
      setFile(null);
      const fileInput = document.getElementById('csvFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to upload CSV file',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-title">
        <i className="fas fa-upload"></i> Upload via CSV
      </div>

      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      {uploadResult && uploadResult.errorDetails && uploadResult.errorDetails.length > 0 && (
        <div className="alert alert-error">
          <strong>Errors encountered:</strong>
          <ul style={{marginTop: '0.5rem', paddingLeft: '1.5rem'}}>
            {uploadResult.errorDetails.slice(0, 5).map((error: any, index: number) => (
              <li key={index} style={{fontSize: '0.9rem'}}>
                Row: {JSON.stringify(error.row)} - {error.error}
              </li>
            ))}
            {uploadResult.errorDetails.length > 5 && (
              <li>... and {uploadResult.errorDetails.length - 5} more errors</li>
            )}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="csv-upload-area">
          <input
            type="file"
            id="csvFile"
            accept=".csv"
            onChange={handleFileChange}
            disabled={loading}
          />
          <button type="submit" className="btn-secondary" disabled={loading || !file} style={{background: 'white', border: 'none', padding: '0 1.5rem'}}>
            <i className="fas fa-cloud-upload-alt"></i> {loading ? 'parsing...' : 'parse'}
          </button>
        </div>
        <p style={{fontSize: '0.8rem', marginTop: '0.7rem', color: '#4b687c'}}>
          <i className="fas fa-info-circle"></i> Expected columns: Date, Amount, Vendor, Description
        </p>
      </form>
    </div>
  );
};

export default CSVUpload;
