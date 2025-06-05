import React, { useState } from 'react';
import BrandingSettings from './BrandingSettings';
import UserManagement from './UserManagement';
import AuditLog from './AuditLog';

const SettingsTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('branding');
  
  const tabs = [
    { id: 'branding', label: 'Branding' },
    { id: 'users', label: 'Users' },
    { id: 'audit', label: 'Audit Log' }
  ];
  
  return (
    <div className="h-full">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="py-6">
        {activeTab === 'branding' && <BrandingSettings />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'audit' && <AuditLog />}
      </div>
    </div>
  );
};

export default SettingsTabs;