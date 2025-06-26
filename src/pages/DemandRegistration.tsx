
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import DemandRegistrationForm from "@/components/demand/DemandRegistrationForm";
import FloatingChatBot from "@/components/FloatingChatBot";
import { useDemandRegistration } from "@/hooks/useDemandRegistration";

const DemandRegistration = () => {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { formData, setFormData, isLoading, handleSubmit } = useDemandRegistration(session);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">수요기관 등록</CardTitle>
            <CardDescription>
              기술 서비스가 필요한 기관의 수요 정보를 등록해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DemandRegistrationForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
      <FloatingChatBot />
    </div>
  );
};

export default DemandRegistration;
