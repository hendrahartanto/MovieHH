import { useSearchParams } from "react-router";
import { useAdminUsers } from "../../api/admin-get-users";
import { ConfirmationDialog } from "@/components/ui/confirmation-modal";
import {
  useAdminUpdateUserRole,
  useAdminToggleSuspension,
} from "../../api/admin-update-user";
import { useUser } from "@/lib/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, User, ShieldAlert, ShieldCheck, UserX, UserCheck } from "lucide-react";
import { format } from "date-fns";

const AVATAR_COLORS = [
  "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "bg-rose-500/20 text-rose-400 border-rose-500/30",
  "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export const UsersList = () => {
  const currentUser = useUser();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = +(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";

  const { data, isLoading } = useAdminUsers({ page, search });
  const updateRoleMutation = useAdminUpdateUserRole();
  const toggleSuspensionMutation = useAdminToggleSuspension();

  const handlePageChange = (pageNum: number) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", pageNum.toString());
      return params;
    });
  };

  const handleRoleToggle = async (userId: string, currentRole: "USER" | "ADMIN") => {
    const targetRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    try {
      await updateRoleMutation.mutateAsync({ userId, role: targetRole });
    } catch (err: any) {
      alert(err.message || "Failed to update user role");
    }
  };

  const handleSuspensionToggle = async (userId: string, isCurrentlySuspended: boolean) => {
    const nextState = !isCurrentlySuspended;
    try {
      await toggleSuspensionMutation.mutateAsync({ userId, isSuspended: nextState });
    } catch (err: any) {
      alert(err.message || "Failed to toggle user suspension status");
    }
  };

  if (isLoading) {
    return <UsersSkeleton />;
  }

  const users = data?.data?.users;
  const pagination = data?.data?.pagination;

  if (!users || users.length === 0) {
    return <EmptyUsersState search={search} />;
  }

  return (
    <div className="space-y-6">
      <Card className="p-0 border-border bg-card text-card-foreground shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow className="hover:bg-transparent border-b border-border/50">
                <TableHead className="pl-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">User</TableHead>
                <TableHead className="py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Role</TableHead>
                <TableHead className="py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Bookings</TableHead>
                <TableHead className="py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Joined Date</TableHead>
                <TableHead className="text-right pr-6 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/30">
              {users.map((item, idx) => {
                const isSelf = currentUser.data?.id === item.id;
                const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];

                return (
                  <TableRow
                    key={item.id}
                    className="hover:bg-muted/10 transition-colors duration-150 border-b border-border/10"
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor}`}>
                          {getInitials(item.name)}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground text-xs block">
                            {item.name} {isSelf && <span className="text-[10px] text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-full ml-1 font-semibold">You</span>}
                          </span>
                          <span className="text-[11px] text-muted-foreground block truncate max-w-[180px]">
                            {item.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          item.role === "ADMIN"
                            ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
                            : "bg-muted/10 text-muted-foreground border-muted-foreground/20"
                        }`}
                      >
                        {item.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          item.isSuspended
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        {item.isSuspended ? "Suspended" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-foreground font-medium">
                      {item._count?.reservations ?? 0}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(item.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-2">
                        <ConfirmationDialog
                          title="Change User Role"
                          body={`Are you sure you want to change this user's role to ${item.role === "ADMIN" ? "USER" : "ADMIN"}?`}
                          isDone={updateRoleMutation.isSuccess && updateRoleMutation.variables?.userId === item.id}
                          triggerButton={
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isSelf || updateRoleMutation.isPending}
                              className="h-8 text-[11px] font-medium"
                            >
                              {item.role === "ADMIN" ? (
                                <div className="flex items-center gap-1">
                                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                                  Demote
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  Promote
                                </div>
                              )}
                            </Button>
                          }
                          confirmButton={
                            <Button
                              variant="default"
                              disabled={updateRoleMutation.isPending}
                              onClick={() => handleRoleToggle(item.id, item.role)}
                            >
                              Confirm
                            </Button>
                          }
                        />
                        <ConfirmationDialog
                          title={item.isSuspended ? "Lift Suspension" : "Suspend User"}
                          body={
                            item.isSuspended
                              ? "Are you sure you want to lift this user's suspension?"
                              : "Are you sure you want to suspend this user? They will be immediately blocked from all active sessions."
                          }
                          isDone={toggleSuspensionMutation.isSuccess && toggleSuspensionMutation.variables?.userId === item.id}
                          triggerButton={
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isSelf || toggleSuspensionMutation.isPending}
                              className="h-8 text-[11px] font-medium"
                            >
                              {item.isSuspended ? (
                                <div className="flex items-center gap-1">
                                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  Unsuspend
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <UserX className="w-3.5 h-3.5 text-rose-400" />
                                  Suspend
                                </div>
                              )}
                            </Button>
                          }
                          confirmButton={
                            <Button
                              variant={item.isSuspended ? "default" : "destructive"}
                              disabled={toggleSuspensionMutation.isPending}
                              onClick={() => handleSuspensionToggle(item.id, item.isSuspended)}
                            >
                              Confirm
                            </Button>
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/50">
              <div className="text-xs text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} accounts
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="bg-background"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === pagination.page ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="bg-background"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const UsersSkeleton = () => {
  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6"><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead><Skeleton className="h-4 w-12" /></TableHead>
              <TableHead><Skeleton className="h-4 w-12" /></TableHead>
              <TableHead><Skeleton className="h-4 w-12" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead className="text-right pr-6"><Skeleton className="h-4 w-24 ml-auto" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="pl-6">
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-3.5 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-16 rounded-md" />
                    <Skeleton className="h-8 w-16 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

interface EmptyUsersStateProps {
  search: string;
}

const EmptyUsersState = ({ search }: EmptyUsersStateProps) => {
  return (
    <Card className="border-border bg-card text-card-foreground shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4 border border-border/50 text-muted-foreground">
          <User className="w-8 h-8" />
        </div>
        <CardTitle className="mb-2 text-lg font-semibold">
          {search ? "No matches found" : "No users found"}
        </CardTitle>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          {search
            ? "Your search query did not match any accounts. Try checking your spelling or searching for a different keyword."
            : "No user accounts registered on this cinema portal."}
        </p>
      </CardContent>
    </Card>
  );
};
