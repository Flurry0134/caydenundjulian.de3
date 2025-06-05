import React from 'react';
import FileList from '../components/files/FileList';

const FilesPage: React.FC = () => {
  return (
    <div className="h-full max-h-screen overflow-y-auto">
      <FileList />
    </div>
  );
};

export default FilesPage;