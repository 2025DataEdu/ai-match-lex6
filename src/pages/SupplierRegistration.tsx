
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import SupplierRegistrationForm from "@/components/supplier/SupplierRegistrationForm";
import { useSupplierRegistration } from "@/hooks/useSupplierRegistration";

const SupplierRegistration = () => {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { formData, setFormData, handleSubmit, isLoading } = useSupplierRegistration();

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

  const handleCancel = () => {
    navigate("/");
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">공급기업 등록</CardTitle>
            <CardDescription>
              AI 기술 서비스를 제공하는 기업 정보를 등록해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SupplierRegistrationForm
              formData={formData}
              onFormDataChange={setFormData}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierRegistration;
