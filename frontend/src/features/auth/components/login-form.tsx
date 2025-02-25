import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const inputLoginSchema = z.object({
  username: z.string().min(1, "Username is requried"),
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

  return (
    <>
      <Form {...form}>
        <form className="flex flex-col gap-4">
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
                  <Input placeholder="Password" {...field} />
                </FormControl>
              </FormItem>
            )}
          ></FormField>
          <Button className="w-full">Login</Button>
        </form>
      </Form>
    </>
  );
};
