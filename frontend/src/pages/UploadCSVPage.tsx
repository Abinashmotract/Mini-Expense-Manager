import React, { useState } from 'react';
import CSVUpload from '../components/CSVUpload';
import './UploadCSVPage.css';

const UploadCSVPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    // Optionally navigate to expenses list after upload
    // navigate('/expenses');
  };

  return (
    <div className="upload-csv-page">
      <CSVUpload onSuccess={handleSuccess} key={refreshKey} />
    </div>
  );
};

export default UploadCSVPage;
