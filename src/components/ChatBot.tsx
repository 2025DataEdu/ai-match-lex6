
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  context?: any[];
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '안녕하세요! AI매치허브 챗봇입니다. 공급기업과 수요기관에 관한 질문을 해주세요.',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 입력 필드에 포커스
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('사용자 인증이 필요합니다.');
      }

      const userId = user.email?.split('@')[0] || user.id;

      const { data, error } = await supabase.functions.invoke('ai-chatbot', {
        body: {
          message: currentInput,
          userId: userId,
        },
      });

      if (error) {
        throw error;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date(),
        context: data.context,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: '오류',
        description: '메시지 전송 중 오류가 발생했습니다.',
        variant: 'destructive',
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // 메시지 전송 후 입력 필드에 다시 포커스
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="h-[600px] flex flex-col">
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
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
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <div className="p-2 rounded-full bg-gray-200">
                    <Bot className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="p-3 rounded-lg bg-gray-100">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !inputValue.trim()}
              size="icon"
              className="flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
