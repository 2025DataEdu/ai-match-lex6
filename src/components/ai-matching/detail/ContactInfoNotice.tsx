
import { Mail } from "lucide-react";

interface ContactInfoNoticeProps {
  showContactInfo: boolean;
}

const ContactInfoNotice = ({ showContactInfo }: ContactInfoNoticeProps) => {
  if (showContactInfo) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
      <div className="flex items-center gap-2 text-yellow-800 font-medium mb-2">
        <Mail className="w-5 h-5" />
        연락처 정보 안내
      </div>
      <p className="text-sm text-yellow-700">
        상세한 연락처 정보(이메일, 전화번호)는 '관심표시'를 누른 후에 공개됩니다. 
        양쪽 당사자의 동의 하에 연결됩니다.
      </p>
    </div>
  );
};

export default ContactInfoNotice;
