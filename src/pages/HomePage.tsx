import React from 'react';
import ChatContainer from '../components/chat/ChatContainer';

const HomePage: React.FC = () => {
  return (
    <div className="h-full max-h-screen">
      <ChatContainer />
    </div>
  );
};

export default HomePage;