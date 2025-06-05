import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useTheme } from '../../context/ThemeContext';
import { MoreHorizontal, Download, FileText, FileJson, ThumbsUp, Brackets, Languages } from 'lucide-react';

const ChatHeader: React.FC = () => {
  const { currentSession, isCitationMode, toggleCitationMode, exportChat } = useChat();
  const { language, setLanguage } = useTheme();
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExport = (format: 'pdf' | 'txt' | 'json') => {
    exportChat(format);
    setShowExportMenu(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'de' : 'en');
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-2 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {currentSession?.title || 'New Chat'}
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group relative"
            aria-label="Toggle language"
            title={language === 'en' ? 'Switch to German' : 'Zu Englisch wechseln'}
          >
            <Languages size={18} />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {language === 'en' ? 'Switch to German' : 'Zu Englisch wechseln'}
            </span>
          </button>
          
          <button
            onClick={toggleCitationMode}
            className={`p-2 rounded-md transition-colors group relative ${
              isCitationMode
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
            aria-label="Toggle citation mode"
          >
            <Brackets size={18} />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {language === 'en' ? 'Toggle citation mode' : 'Zitationsmodus umschalten'}
            </span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group relative"
              aria-label="Export chat"
            >
              <Download size={18} />
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {language === 'en' ? 'Export chat' : 'Chat exportieren'}
              </span>
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleExport('pdf')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <FileText size={16} className="mr-2" />
                  {language === 'en' ? 'Export as PDF' : 'Als PDF exportieren'}
                </button>
                <button
                  onClick={() => handleExport('txt')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <FileText size={16} className="mr-2" />
                  {language === 'en' ? 'Export as TXT' : 'Als TXT exportieren'}
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <FileJson size={16} className="mr-2" />
                  {language === 'en' ? 'Export as JSON' : 'Als JSON exportieren'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;