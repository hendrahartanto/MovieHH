import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router";
import { paths } from "@/config/paths";

const inputLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type inputLoginSchema = z.infer<typeof inputLoginSchema>;

export const LoginForm = () => {
  const form = useForm<inputLoginSchema>({
    resolver: zodResolver(inputLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => {})}>
          <div className="flex flex-col gap-4">
            <p className="text-xl mb-2 font-bold">Login</p>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
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
            <Button type="submit" className="w-full">
              Login
            </Button>
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
