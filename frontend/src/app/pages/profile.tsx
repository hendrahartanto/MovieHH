import { useUser } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, User as UserIcon, Lock } from "lucide-react";
import {
  ProfileCard,
  ProfileForm,
  ChangePasswordForm,
} from "@/features/profile";

const ProfilePage = () => {
  const { data: user } = useUser();

  if (!user) {
    return (
      <div className="pt-32 pb-12 content-wrapper flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 content-wrapper">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          My Profile
        </h2>
        <p className="text-muted-foreground">
          Manage your account details, credentials, and booking history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 space-y-5">
          <ProfileCard user={user} />
        </div>

        <div className="lg:col-span-8">
          <div className="rounded-xl border border-border/40 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden">
            <Tabs defaultValue="profile" className="w-full">
              <div className="border-b border-border/40 px-6 bg-muted/20">
                <TabsList className="flex w-auto rounded-none bg-transparent p-0 gap-1 -mb-px">
                  <TabsTrigger
                    value="profile"
                    className="
                      inline-flex items-center gap-2 px-4 py-3.5 text-sm font-medium
                      rounded-none border-b-2 border-transparent
                      text-muted-foreground bg-transparent
                      hover:text-foreground transition-colors
                      data-[state=active]:border-primary
                      data-[state=active]:text-foreground
                      data-[state=active]:bg-transparent
                    "
                  >
                    <UserIcon className="w-4 h-4" />
                    Account Settings
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="
                      inline-flex items-center gap-2 px-4 py-3.5 text-sm font-medium
                      rounded-none border-b-2 border-transparent
                      text-muted-foreground bg-transparent
                      hover:text-foreground transition-colors
                      data-[state=active]:border-primary
                      data-[state=active]:text-foreground
                      data-[state=active]:bg-transparent
                    "
                  >
                    <Lock className="w-4 h-4" />
                    Security
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="profile" className="p-6 mt-0">
                <ProfileForm />
              </TabsContent>

              <TabsContent value="security" className="p-6 mt-0">
                <ChangePasswordForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
