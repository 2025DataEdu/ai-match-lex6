import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Reply, Clock } from "lucide-react";
import { useInquiryComments } from "@/hooks/useInquiryComments";
import { DetailedMatch } from "@/types/matching";

interface InquiryCommentModalProps {
  match: DetailedMatch;
  commentCount?: number;
  onCommentAdded?: () => void;
}

interface CommentItemProps {
  comment: any;
  onReply: (parentId: string) => void;
  level: number;
}

const CommentItem = ({ comment, onReply, level }: CommentItemProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  return (
    <div className={`border-l-2 border-gray-200 pl-4 ${level > 0 ? 'ml-6' : ''}`}>
      <div className="bg-gray-50 p-3 rounded-lg mb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant={comment.작성자유형 === '공급기업' ? 'default' : 'secondary'}>
              {comment.작성자유형}
            </Badge>
            <span className="font-medium">{comment.기관명}</span>
            <span className="text-sm text-gray-600">• {comment.작성자명}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {formatDate(comment.작성일자)}
          </div>
        </div>
        <p className="text-sm text-gray-800 mb-2">{comment.댓글내용}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReply(comment.id)}
          className="text-xs h-6 px-2"
        >
          <Reply className="w-3 h-3 mr-1" />
          답글
        </Button>
      </div>
      
      {comment.replies && comment.replies.map((reply: any) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          onReply={onReply}
          level={level + 1}
        />
      ))}
    </div>
  );
};

const InquiryCommentModal = ({ match, commentCount = 0, onCommentAdded }: InquiryCommentModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { comments, isLoading, fetchComments, addComment } = useInquiryComments();

  const matchingId = `${match.supplier.공급기업일련번호}_${match.demand.수요기관일련번호}`;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      fetchComments(matchingId);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    
    // 더미 데이터 (실제로는 현재 로그인한 사용자 정보를 사용해야 함)
    const 작성자유형 = '공급기업'; // 실제로는 사용자 유형에 따라 결정
    const 작성자아이디 = 'dummy-user-id';
    const 작성자명 = '테스트 사용자';
    const 기관명 = 작성자유형 === '공급기업' ? match.supplier.기업명 : match.demand.수요기관;

    const success = await addComment(
      matchingId,
      match.supplier.공급기업일련번호,
      match.demand.수요기관일련번호,
      작성자유형,
      작성자아이디,
      작성자명,
      기관명,
      newComment,
      replyingTo || undefined
    );

    if (success) {
      setNewComment("");
      setReplyingTo(null);
      if (onCommentAdded) {
        onCommentAdded();
      }
    }
    
    setIsSubmitting(false);
  };

  const handleReply = (parentId: string) => {
    setReplyingTo(parentId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          문의하기
          {commentCount > 0 && (
            <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
              {commentCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            문의 및 답변
          </DialogTitle>
          <div className="text-sm text-gray-600">
            {match.supplier.기업명} ↔ {match.demand.수요기관}
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* 매칭 정보 요약 */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-blue-900 mb-1">공급기업</h4>
                <p className="text-sm">{match.supplier.기업명}</p>
                <p className="text-xs text-gray-600">{match.supplier.유형}</p>
              </div>
              <div>
                <h4 className="font-medium text-green-900 mb-1">수요기관</h4>
                <p className="text-sm">{match.demand.수요기관}</p>
                <p className="text-xs text-gray-600">{match.demand.유형}</p>
              </div>
            </div>
          </div>

          {/* 댓글 목록 */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center py-4 text-gray-500">
                댓글을 불러오는 중...
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                아직 문의가 없습니다. 첫 번째 문의를 남겨보세요!
              </div>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onReply={handleReply}
                  level={0}
                />
              ))
            )}
          </div>

          {/* 댓글 작성 폼 */}
          <div className="border-t pt-4">
            {replyingTo && (
              <div className="mb-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-sm">
                답글을 작성 중입니다.
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                  className="ml-2 h-6 px-2 text-xs"
                >
                  취소
                </Button>
              </div>
            )}
            <div className="space-y-3">
              <Textarea
                placeholder={replyingTo ? "답글을 입력하세요..." : "문의사항을 입력하세요..."}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  {newComment.length}/1000자
                </div>
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmitting}
                >
                  {isSubmitting ? "전송 중..." : replyingTo ? "답글 작성" : "문의 작성"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InquiryCommentModal;
