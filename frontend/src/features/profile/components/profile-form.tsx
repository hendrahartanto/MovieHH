import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser } from "@/lib/auth";
import { useNotifications } from "@/components/ui/notification/notification-store";
import { useUpdateProfile } from "../api/update-profile";
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
import { Loader2 } from "lucide-react";

const profileInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

type ProfileInput = z.infer<typeof profileInputSchema>;

export const ProfileForm = () => {
  const { data: user, refetch: refetchUser } = useUser();
  const { addNotification } = useNotifications();
  const updateProfileMutation = useUpdateProfile();

  const profileForm = useForm<ProfileInput>({
    resolver: zodResolver(profileInputSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, profileForm]);

  const onProfileSubmit = (data: ProfileInput) => {
    updateProfileMutation.mutate(
      {
        name: data.name,
        email: data.email,
      },
      {
        onSuccess: () => {
          addNotification({
            type: "success",
            title: "Profile Updated",
            message: "Your profile details have been saved successfully.",
          });
          refetchUser();
        },
        onError: (err: any) => {
          addNotification({
            type: "error",
            title: "Failed to Update Profile",
            message: err?.response?.data?.message || "Something went wrong.",
          });
        },
      },
    );
  };

  return (
    <>
      <div className="mb-6">
        <h3 className="font-semibold text-foreground">Personal Information</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Update your display name and email address.
        </p>
      </div>

      <Form {...profileForm}>
        <form
          onSubmit={profileForm.handleSubmit(onProfileSubmit)}
          className="space-y-5"
        >
          <FormField
            control={profileForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    className="bg-background/50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={profileForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="bg-background/50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="px-6"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
