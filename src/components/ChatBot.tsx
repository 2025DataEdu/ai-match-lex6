
import React from 'react';
import MessageList from './chat/MessageList';
import MessageInput from './chat/MessageInput';
import { useChatMessages } from '@/hooks/useChatMessages';

const ChatBot = () => {
  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    sendMessage,
  } = useChatMessages();

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 min-h-0 overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>
      <div className="border-t bg-gray-50 flex-shrink-0">
        <MessageInput
          value={inputValue}
          onChange={setInputValue}
          onSend={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatBot;
