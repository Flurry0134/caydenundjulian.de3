import React from 'react';
import SettingsTabs from '../components/settings/SettingsTabs';

const SettingsPage: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
      <SettingsTabs />
    </div>
  );
};

export default SettingsPage;