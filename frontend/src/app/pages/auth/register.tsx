import { AuthLayout } from "@/components/layouts/auth-layout";
import { RegisterForm } from "@/features/auth/components/register-form";
import { api } from "@/lib/api-client";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    const test = async () => {
      try {
        const res = await api.get("/genres");
        console.log(res);
      } catch (error: any) {
        console.log(error);
      }
    };
    const login = async () => {
      try {
        const res = await api.post("/auth/login", {
          email: "admin@gmail.com",
          password: "123123",
        });
        console.log(res);
      } catch (error: any) {
        console.log(error);
      }
    };
    // login();
    test();
  }, [trigger]);

  return (
    <AuthLayout>
      <RegisterForm
        onSuccess={() => navigate(`${redirectTo ? `${redirectTo}` : ""}`)} //TODO: default back location not implemented
      />
    </AuthLayout>
  );
};

export default LoginPage;
