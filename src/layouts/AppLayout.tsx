import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';

const AppLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  return (
    <div className="min-h-screen max-h-screen flex bg-gray-100 dark:bg-gray-900">
      <div className="hidden md:flex md:w-64 md:flex-shrink-0">
        <Sidebar />
      </div>
      
      <div className="md:hidden">
        {/* Mobile menu button would go here */}
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;