
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface InquiryComment {
  id: string;
  매칭id: string;
  공급기업일련번호: string;
  수요기관일련번호: string;
  작성자유형: '공급기업' | '수요기관';
  작성자아이디: string;
  작성자명: string;
  기관명: string;
  댓글내용: string;
  부모댓글id?: string;
  작성일자: string;
  수정일자?: string;
  replies?: InquiryComment[];
}

export const useInquiryComments = () => {
  const [comments, setComments] = useState<InquiryComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchComments = async (matchingId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('문의댓글')
        .select('*')
        .eq('매칭id', matchingId)
        .order('작성일자', { ascending: true });

      if (error) {
        console.error('댓글 조회 오류:', error);
        toast({
          title: "댓글 조회 실패",
          description: "댓글을 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
        return;
      }

      // 댓글을 계층 구조로 정리
      const organizedComments = organizeComments(data || []);
      setComments(organizedComments);
    } catch (error) {
      console.error('댓글 fetch 오류:', error);
      toast({
        title: "오류 발생",
        description: "댓글을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const organizeComments = (commentList: any[]): InquiryComment[] => {
    const commentMap = new Map<string, InquiryComment>();
    const rootComments: InquiryComment[] = [];

    // 모든 댓글을 맵에 저장
    commentList.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // 부모-자식 관계 설정
    commentList.forEach(comment => {
      const commentObj = commentMap.get(comment.id)!;
      if (comment.부모댓글id) {
        const parent = commentMap.get(comment.부모댓글id);
        if (parent) {
          parent.replies!.push(commentObj);
        }
      } else {
        rootComments.push(commentObj);
      }
    });

    return rootComments;
  };

  const addComment = async (
    matchingId: string,
    공급기업일련번호: string,
    수요기관일련번호: string,
    작성자유형: '공급기업' | '수요기관',
    작성자아이디: string,
    작성자명: string,
    기관명: string,
    댓글내용: string,
    부모댓글id?: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('문의댓글')
        .insert([{
          매칭id: matchingId,
          공급기업일련번호,
          수요기관일련번호,
          작성자유형,
          작성자아이디,
          작성자명,
          기관명,
          댓글내용,
          부모댓글id
        }])
        .select()
        .single();

      if (error) {
        console.error('댓글 작성 오류:', error);
        toast({
          title: "댓글 작성 실패",
          description: "댓글 작성 중 오류가 발생했습니다.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "댓글 작성 완료",
        description: "댓글이 성공적으로 작성되었습니다.",
      });

      // 댓글 목록 새로고침
      await fetchComments(matchingId);
      return true;
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      toast({
        title: "오류 발생",
        description: "댓글 작성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      return false;
    }
  };

  const getCommentCount = async (matchingId: string): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('문의댓글')
        .select('*', { count: 'exact', head: true })
        .eq('매칭id', matchingId);

      if (error) {
        console.error('댓글 수 조회 오류:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('댓글 수 조회 오류:', error);
      return 0;
    }
  };

  return {
    comments,
    isLoading,
    fetchComments,
    addComment,
    getCommentCount
  };
};
