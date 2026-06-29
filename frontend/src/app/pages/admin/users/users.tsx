import { SidebarContentLayout } from "@/components/layouts/sidebar-content-layout";
import { SearchBox } from "@/components/ui/search-box";
import { useSearchParams } from "react-router";
import { UsersList } from "@/features/users/components/admin/users-list";

export const UsersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (value: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("search", value);
      params.set("page", "1");
      return params;
    });
  };

  return (
    <SidebarContentLayout
      title="Users"
      subtitle="Manage user accounts, toggle administrative access, and suspend malicious users."
      headerComponent={
        <div className="flex justify-between w-full max-w-xl">
          <SearchBox
            onSearch={handleSearch}
            defaultValue={searchParams.get("search") || ""}
            placeholder="Search by name or email..."
          />
        </div>
      }
    >
      <UsersList />
    </SidebarContentLayout>
  );
};

export default UsersPage;
