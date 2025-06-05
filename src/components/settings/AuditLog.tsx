import React from 'react';

// Mock audit log data
const auditLogEntries = [
  { id: 1, timestamp: new Date('2025-05-12T08:32:45'), username: 'alice_smith', action: 'Login', ip: '192.168.1.***' },
  { id: 2, timestamp: new Date('2025-05-12T09:15:22'), username: 'alice_smith', action: 'File Upload', ip: '192.168.1.***' },
  { id: 3, timestamp: new Date('2025-05-12T10:45:12'), username: 'bob_jones', action: 'Chat Export', ip: '172.16.254.***' },
  { id: 4, timestamp: new Date('2025-05-11T14:22:36'), username: 'admin', action: 'User Role Update', ip: '10.0.0.***' },
  { id: 5, timestamp: new Date('2025-05-11T16:05:51'), username: 'carol_davis', action: 'Login', ip: '192.168.2.***' },
  { id: 6, timestamp: new Date('2025-05-10T11:30:18'), username: 'alice_smith', action: 'Logout', ip: '192.168.1.***' },
  { id: 7, timestamp: new Date('2025-05-10T09:47:02'), username: 'admin', action: 'Settings Update', ip: '10.0.0.***' },
];

const AuditLog: React.FC = () => {
  // Group entries by date
  const groupedEntries: Record<string, typeof auditLogEntries> = {};
  auditLogEntries.forEach(entry => {
    const date = entry.timestamp.toLocaleDateString();
    if (!groupedEntries[date]) {
      groupedEntries[date] = [];
    }
    groupedEntries[date].push(entry);
  });
  
  // Sort dates in descending order
  const sortedDates = Object.keys(groupedEntries).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Audit Log</h2>
        
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Export Log
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search audit log..."
                className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="all">All Actions</option>
              <option value="login">Login</option>
              <option value="upload">File Upload</option>
              <option value="export">Chat Export</option>
              <option value="settings">Settings Update</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedDates.map(date => (
                <React.Fragment key={date}>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <td colSpan={4} className="px-6 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                      {date}
                    </td>
                  </tr>
                  
                  {groupedEntries[date].map(entry => (
                    <tr key={entry.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {entry.timestamp.toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {entry.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {entry.action}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {entry.ip}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">7</span> of <span className="font-medium">7</span> entries
          </div>
          
          <div className="flex-1 flex justify-center sm:justify-end">
            <nav className="relative z-0 inline-flex -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                Previous
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-blue-50 dark:bg-blue-900 text-sm font-medium text-blue-600 dark:text-blue-400">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLog;