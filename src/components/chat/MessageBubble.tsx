import React, { useState } from 'react';
import { Message } from '../../types';
import { ThumbsUp, ThumbsDown, Link, ExternalLink } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  
  const isUserMessage = message.sender === 'user';
  const time = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedback(type);
    // In a real app, this would send feedback to the server
    console.log(`User gave ${type} feedback for message: ${message.id}`);
  };

  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUserMessage 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
        }`}
      >
        <div className="text-sm">{message.content}</div>
        
        {message.citations && message.citations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
            <h4 className="text-xs font-medium mb-2">Sources:</h4>
            <ul className="space-y-2">
              {message.citations.map((citation) => (
                <li key={citation.id} className="text-xs">
                  <div className="flex items-start">
                    <Link size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{citation.text}</p>
                      <p className="text-gray-400 dark:text-gray-500 mt-1">
                        {citation.source}
                        {citation.url && (
                          <a 
                            href={citation.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center ml-2 text-blue-400 hover:text-blue-300"
                          >
                            <ExternalLink size={10} className="mr-1" />
                            Link
                          </a>
                        )}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-1 text-right">
          <span className="text-xs opacity-70">{time}</span>
        </div>
      </div>
      
      {!isUserMessage && (
        <div className="ml-2 flex flex-col justify-end">
          <div className="flex space-x-1">
            <button
              onClick={() => handleFeedback('positive')}
              className={`p-1 rounded-md ${
                feedback === 'positive'
                  ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900'
                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
              aria-label="Thumbs up"
            >
              <ThumbsUp size={14} />
            </button>
            <button
              onClick={() => handleFeedback('negative')}
              className={`p-1 rounded-md ${
                feedback === 'negative'
                  ? 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900'
                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
              aria-label="Thumbs down"
            >
              <ThumbsDown size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;