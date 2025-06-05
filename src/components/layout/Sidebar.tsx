import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Home, FileText, Settings, Moon, Sun } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { mode, setMode, themeConfig, language } = useTheme();

  const navItems = [
    { 
      path: '/', 
      icon: <Home size={20} />, 
      label: language === 'en' ? 'Home (Chat)' : 'Start (Chat)', 
      admin: false 
    },
    { 
      path: '/files', 
      icon: <FileText size={20} />, 
      label: language === 'en' ? 'Files' : 'Dateien', 
      admin: false 
    },
    { 
      path: '/settings', 
      icon: <Settings size={20} />, 
      label: language === 'en' ? 'Settings' : 'Einstellungen', 
      admin: true 
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const toggleDarkMode = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="h-full flex flex-col bg-light-bg dark:bg-dark-bg border-r border-light-border dark:border-dark-border w-64">
      <div className="p-4 border-b border-light-border dark:border-dark-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold">AI</span>
          </div>
          <span className="text-lg font-semibold text-light-text dark:text-dark-text">AI Chat</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          if (item.admin && (!user || !user.isAdmin)) {
            return null;
          }
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'text-light-text hover:bg-light-accent dark:text-dark-text dark:hover:bg-dark-accent'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-light-border dark:border-dark-border">
        <div className="mb-4">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-center p-2 rounded-md text-light-text hover:bg-light-accent dark:text-dark-text dark:hover:bg-dark-accent group relative"
            aria-label="Toggle dark mode"
          >
            {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span className="ml-2">{language === 'en' ? 'Toggle Dark Mode' : 'Dunkelmodus umschalten'}</span>
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {language === 'en' ? 'Switch between light and dark mode' : 'Zwischen hellem und dunklem Modus wechseln'}
            </span>
          </button>
        </div>
        
        {user && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-light-accent dark:bg-dark-accent">
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.username} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-light-text dark:text-dark-text truncate">
                {user.username}
              </p>
              <p className="text-xs text-light-secondary dark:text-dark-secondary truncate">
                {user.isAdmin ? (language === 'en' ? 'Admin' : 'Administrator') : (language === 'en' ? 'User' : 'Benutzer')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;