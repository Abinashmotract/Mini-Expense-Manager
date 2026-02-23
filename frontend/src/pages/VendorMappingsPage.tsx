import React, { useState } from 'react';
import VendorMappings from '../components/VendorMappings';
import './VendorMappingsPage.css';

const VendorMappingsPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="vendor-mappings-page">
      <VendorMappings key={refreshKey} />
    </div>
  );
};

export default VendorMappingsPage;
