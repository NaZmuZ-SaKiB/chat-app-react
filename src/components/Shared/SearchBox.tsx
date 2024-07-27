import { Search } from "lucide-react";
import { Input } from "../ui/input";

type TProps = {
  search: string;
  setSearch: (search: string) => void;
};

const SearchBox = ({ search, setSearch }: TProps) => {
  return (
    <div className="flex gap-2 items-center bg-slate-100 px-2 text-gray-700">
      <Search className="size-4" />
      <Input
        value={search}
        placeholder="Search"
        className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 bg-transparent"
        onChange={(e) => setSearch(e.target?.value)}
      />
    </div>
  );
};

export default SearchBox;
