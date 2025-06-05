import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
              <span className="text-xl font-bold text-white">AI</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Chatbot</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to start your conversation
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;