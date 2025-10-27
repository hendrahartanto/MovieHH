import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useSearchParams } from "react-router";
import { paths } from "@/config/paths";
import { LoginInput, loginInputSchema, useLogin } from "@/lib/auth";
import {
  SubmitButton,
  SubmitButtonType,
} from "@/components/ui/form/submit-button";

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const login = useLogin();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (data: LoginInput) => {
    login.mutate(data, { onSuccess }); //TODO: handle on error (optional)
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col gap-4">
            <p className="text-xl mb-2 font-bold">Login</p>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <SubmitButton
              type={SubmitButtonType.LOGIN}
              isPending={login.isPending}
            >
              Login
            </SubmitButton>
          </div>
          <div className="w-full mt-2 text-sm">
            Don't have an account?{" "}
            <Link
              className="text-sm text-blue-600 hover:underline"
              to={paths.auth.register.getHref(redirectTo)}
            >
              Sign Up
            </Link>
          </div>
        </form>
      </Form>
    </>
  );
};
