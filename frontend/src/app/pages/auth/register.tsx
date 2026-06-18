import { AuthLayout } from "@/components/layouts/auth-layout";
import { RegisterForm } from "@/features/auth/components/register-form";
import { useNavigate, useSearchParams } from "react-router";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  return (
    <AuthLayout>
      <RegisterForm
        onSuccess={() => navigate(`${redirectTo ? `${redirectTo}` : ""}`)} //TODO: default back location not implemented
      />
    </AuthLayout>
  );
};

export default RegisterPage;
