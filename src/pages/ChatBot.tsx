
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Database, Play, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ChatBot from '@/components/ChatBot';
import Navbar from '@/components/Navbar';

const ChatBotPage = () => {
  const [isCreatingEmbeddings, setIsCreatingEmbeddings] = useState(false);
  const [embeddingsCreated, setEmbeddingsCreated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // 페이지 로드 시 자동으로 임베딩 생성 시작
    createEmbeddings();
  }, []);

  const createEmbeddings = async () => {
    setIsCreatingEmbeddings(true);
    try {
      console.log('임베딩 생성을 시작합니다...');
      
      const { data, error } = await supabase.functions.invoke('create-embeddings');
      
      if (error) {
        console.error('임베딩 생성 오류:', error);
        throw error;
      }

      console.log('임베딩 생성 완료:', data);
      
      toast({
        title: '벡터 데이터베이스 생성 완료',
        description: `공급기업 ${data.suppliersProcessed}개, 수요기관 ${data.demandsProcessed}개의 데이터가 벡터화되었습니다.`,
      });
      
      setEmbeddingsCreated(true);
    } catch (error) {
      console.error('Error creating embeddings:', error);
      toast({
        title: '오류 발생',
        description: '임베딩 생성 중 오류가 발생했습니다. 다시 시도해주세요.',
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

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                벡터 데이터베이스 상태
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isCreatingEmbeddings ? (
                <div className="flex items-center gap-2 text-blue-600">
                  <Play className="h-4 w-4 animate-spin" />
                  <span>임베딩 생성 중... 잠시만 기다려주세요.</span>
                </div>
              ) : embeddingsCreated ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>벡터 데이터베이스가 준비되었습니다!</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    벡터 데이터베이스 생성을 시작하고 있습니다...
                  </p>
                  <Button 
                    onClick={createEmbeddings} 
                    disabled={isCreatingEmbeddings}
                    className="w-full"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    다시 시도
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold">AI 상담원과 대화하기</h2>
            </div>
            {embeddingsCreated ? (
              <ChatBot />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>벡터 데이터베이스 생성이 완료되면 챗봇을 사용할 수 있습니다.</p>
              </div>
            )}
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
