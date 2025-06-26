
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Database, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ChatBot from '@/components/ChatBot';
import Navbar from '@/components/Navbar';

const ChatBotPage = () => {
  const [isCreatingEmbeddings, setIsCreatingEmbeddings] = useState(false);
  const [embeddingsCreated, setEmbeddingsCreated] = useState(false);
  const { toast } = useToast();

  const createEmbeddings = async () => {
    setIsCreatingEmbeddings(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-embeddings');
      
      if (error) {
        throw error;
      }

      toast({
        title: '임베딩 생성 완료',
        description: `공급기업 ${data.suppliersProcessed}개, 수요기관 ${data.demandsProcessed}개의 데이터가 처리되었습니다.`,
      });
      
      setEmbeddingsCreated(true);
    } catch (error) {
      console.error('Error creating embeddings:', error);
      toast({
        title: '오류',
        description: '임베딩 생성 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingEmbeddings(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              AI 챗봇
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              벡터 검색 기반 지능형 상담 시스템
            </p>
          </div>

          {!embeddingsCreated && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  벡터 데이터베이스 초기화
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  챗봇을 사용하기 전에 기존 데이터를 벡터 데이터베이스로 변환해야 합니다.
                  이 과정은 처음 한 번만 실행하면 됩니다.
                </p>
                <Button 
                  onClick={createEmbeddings} 
                  disabled={isCreatingEmbeddings}
                  className="w-full"
                >
                  {isCreatingEmbeddings ? (
                    <>
                      <Play className="mr-2 h-4 w-4 animate-spin" />
                      임베딩 생성 중...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      벡터 데이터베이스 생성
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold">AI 상담원과 대화하기</h2>
            </div>
            <ChatBot />
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              이 챗봇은 벡터 검색을 통해 관련 공급기업과 수요기관 정보를 찾아 
              정확한 답변을 제공합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBotPage;
