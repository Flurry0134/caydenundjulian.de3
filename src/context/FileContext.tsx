import React, { createContext, useState, useContext, useEffect } from 'react';
import { UploadedFile } from '../types';

interface FileContextType {
  files: UploadedFile[];
  uploadProgress: number | null;
  isUploading: boolean;
  showUploadOverlay: boolean;
  toggleUploadOverlay: () => void;
  uploadFile: (file: File) => Promise<void>;
  removeFile: (fileId: string) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const useFiles = () => {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
};

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadOverlay, setShowUploadOverlay] = useState(false);

  // Load files from localStorage on mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('uploadedFiles');
    if (savedFiles) {
      const parsedFiles = JSON.parse(savedFiles).map((file: any) => ({
        ...file,
        uploadedAt: new Date(file.uploadedAt)
      }));
      setFiles(parsedFiles);
    }
  }, []);

  // Save files to localStorage whenever they change
  useEffect(() => {
    if (files.length > 0) {
      localStorage.setItem('uploadedFiles', JSON.stringify(files));
    }
  }, [files]);

  const toggleUploadOverlay = () => {
    setShowUploadOverlay(!showUploadOverlay);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate file upload with progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Create uploaded file object
      const newFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        uploadedAt: new Date()
      };
      
      setFiles([newFile, ...files]);
      return Promise.resolve();
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId));
  };

  return (
    <FileContext.Provider value={{
      files,
      uploadProgress,
      isUploading,
      showUploadOverlay,
      toggleUploadOverlay,
      uploadFile,
      removeFile
    }}>
      {children}
    </FileContext.Provider>
  );
};