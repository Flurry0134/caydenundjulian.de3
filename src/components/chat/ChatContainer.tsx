import React, { useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useFiles } from '../../context/FileContext';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import FileUploadOverlay from '../files/FileUploadOverlay';
import { Loader2 } from 'lucide-react';

const ChatContainer: React.FC = () => {
  const { messages, isLoading } = useChat();
  const { showUploadOverlay } = useFiles();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-h-screen">
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium mb-2">Welcome to AI Chat</p>
            <p className="text-sm">Start a conversation by typing a message below.</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <ChatInput />
      </div>
      
      {showUploadOverlay && <FileUploadOverlay />}
    </div>
  );
};

export default ChatContainer;