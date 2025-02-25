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
        <form>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
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
                  <Input placeholder="password" {...field} />
                </FormControl>
              </FormItem>
            )}
          ></FormField>
        </form>
      </Form>
    </>
  );
};
