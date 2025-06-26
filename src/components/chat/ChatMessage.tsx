
import React from 'react';
import { Bot, User } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  context?: any[];
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`flex items-start gap-2 max-w-[80%] ${
          message.isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <div
          className={`p-2 rounded-full flex-shrink-0 ${
            message.isUser ? 'bg-blue-500' : 'bg-gray-200'
          }`}
        >
          {message.isUser ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-gray-600" />
          )}
        </div>
        <div
          className={`p-3 rounded-lg ${
            message.isUser
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
          <p className="text-xs opacity-70 mt-1">
            {message.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
