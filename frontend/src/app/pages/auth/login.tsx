import { AuthLayout } from "@/components/layouts/auth-layout";
import { LoginForm } from "@/features/auth/components/login-form";
import { useNavigate, useSearchParams } from "react-router";

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  return (
    <AuthLayout>
      <LoginForm
        onSuccess={() => navigate(`${redirectTo ? `${redirectTo}` : ""}`)} //TODO: default back location not implemented
      />
    </AuthLayout>
  );
};

export default LoginPage;
