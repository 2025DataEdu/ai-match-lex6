
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ChatBot from '@/components/ChatBot';
import Navbar from '@/components/Navbar';

const ChatBotPage = () => {
  const [databaseReady, setDatabaseReady] = useState(false);
  const [isCheckingDatabase, setIsCheckingDatabase] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    setIsCheckingDatabase(true);
    try {
      // 공급기업과 수요기관 테이블에 데이터가 있는지 확인
      const [suppliersResult, demandsResult] = await Promise.all([
        supabase.from('공급기업').select('*', { count: 'exact', head: true }),
        supabase.from('수요기관').select('*', { count: 'exact', head: true })
      ]);

      const suppliersCount = suppliersResult.count || 0;
      const demandsCount = demandsResult.count || 0;

      console.log(`공급기업 데이터: ${suppliersCount}개, 수요기관 데이터: ${demandsCount}개`);

      if (suppliersCount > 0 || demandsCount > 0) {
        setDatabaseReady(true);
        toast({
          title: '데이터베이스 준비 완료',
          description: `공급기업 ${suppliersCount}개, 수요기관 ${demandsCount}개의 데이터를 활용할 수 있습니다.`,
        });
      } else {
        toast({
          title: '데이터베이스 확인 필요',
          description: '공급기업과 수요기관 데이터가 없습니다. 데이터를 먼저 등록해주세요.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error checking database status:', error);
      toast({
        title: '데이터베이스 연결 오류',
        description: '데이터베이스 상태를 확인할 수 없습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsCheckingDatabase(false);
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
              키워드 검색 기반 지능형 상담 시스템
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                데이터베이스 상태
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isCheckingDatabase ? (
                <div className="flex items-center gap-2 text-blue-600">
                  <Database className="h-4 w-4 animate-pulse" />
                  <span>데이터베이스 상태 확인 중...</span>
                </div>
              ) : databaseReady ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>데이터베이스가 준비되었습니다! 챗봇을 사용할 수 있습니다.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-orange-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>데이터가 부족합니다. 공급기업이나 수요기관 데이터를 먼저 등록해주세요.</span>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold">AI 상담원과 대화하기</h2>
            </div>
            <ChatBot />
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              이 챗봇은 키워드 검색을 통해 관련 공급기업과 수요기관 정보를 찾아 
              정확한 답변을 제공합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBotPage;
