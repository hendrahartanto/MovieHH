import { paths } from "@/config/paths";
import { useUser } from "@/lib/auth";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

type LayoutProps = {
  children: React.ReactNode;
};

export const AuthLayout = ({ children }: LayoutProps) => {
  const user = useUser();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const navigate = useNavigate();

  useEffect(() => {
    if (user.data) {
      navigate(redirectTo ? redirectTo : paths.home.getHref(), {
        replace: true,
      });
    }
  }, [user.data]);

  if (user) return;

  return (
    <div className="flex min-h-screen flex-col justify-center">
      <div className="mx-auto shadow py-7 px-10 rounded-md w-[350px] border">
        {children}
      </div>
    </div>
  );
};
