import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBoxProps {
  placeholder?: string;
  defaultValue?: string;
  onSearch: (value: string) => void;
}

export const SearchBox = ({
  placeholder = "Search...",
  defaultValue = "",
  onSearch,
}: SearchBoxProps) => {
  const [value, setValue] = useState(defaultValue);

  const handleSearch = () => {
    onSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex items-center gap-2 max-w-sm w-full">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={placeholder}
          className="pl-8"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <Button variant="secondary" onClick={handleSearch}>
        Search
      </Button>
    </div>
  );
};
