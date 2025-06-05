import React from 'react';
import { useFiles } from '../../context/FileContext';
import { useChat } from '../../context/ChatContext';
import { FileIcon, Trash2, MessageSquare } from 'lucide-react';

const FileList: React.FC = () => {
  const { files, removeFile } = useFiles();
  const { sessions, loadSession } = useChat();
  
  // Group files by date
  const groupedFiles: Record<string, typeof files> = {};
  files.forEach(file => {
    const date = file.uploadedAt.toLocaleDateString();
    if (!groupedFiles[date]) {
      groupedFiles[date] = [];
    }
    groupedFiles[date].push(file);
  });
  
  // Sort dates in descending order
  const sortedDates = Object.keys(groupedFiles).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  
  const findSessionForFile = (fileId: string) => {
    return sessions.find(session => 
      session.messages.some(message => 
        message.content.includes(fileId) || message.content.includes(files.find(f => f.id === fileId)?.name || '')
      )
    );
  };
  
  const openChatWithFile = (fileId: string) => {
    const session = findSessionForFile(fileId);
    if (session) {
      loadSession(session.id);
    }
  };
  
  const getFileTypeIcon = (fileType: string) => {
    // Simplified for demo purposes
    if (fileType.startsWith('image/')) {
      return '🖼️';
    } else if (fileType.includes('pdf')) {
      return '📄';
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return '📝';
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return '📊';
    } else {
      return '📁';
    }
  };

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-6">
        <FileIcon size={48} className="mb-4 opacity-30" />
        <p className="text-lg font-medium mb-2">No files uploaded yet</p>
        <p className="text-sm text-center">
          Upload files from the chat interface to see them listed here.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Files</h2>
      
      {sortedDates.map(date => (
        <div key={date} className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{date}</h3>
          
          <div className="space-y-3">
            {groupedFiles[date].map(file => {
              const sessionWithFile = findSessionForFile(file.id);
              
              return (
                <div 
                  key={file.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">{getFileTypeIcon(file.type)}</div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate mr-2">
                          {file.name}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {(file.size / 1024).toFixed(2)} KB
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Uploaded at {file.uploadedAt.toLocaleTimeString()}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      {sessionWithFile && (
                        <button
                          onClick={() => openChatWithFile(file.id)}
                          className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Open chat"
                        >
                          <MessageSquare size={18} />
                        </button>
                      )}
                      
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete file"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;