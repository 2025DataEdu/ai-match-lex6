
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
    <div className="h-[600px] flex flex-col">
      <div className="flex-1 flex flex-col">
        <MessageList messages={messages} isLoading={isLoading} />
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
