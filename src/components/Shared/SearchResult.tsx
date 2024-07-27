import { useSearchUsersQuery } from "@/lib/queries/user.query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchUserLoader from "../Loaders/SearchUserLoader";

type TPorps = {
  search: string;
  setSearch: (search: string) => void;
};

const SearchResult = ({ search, setSearch }: TPorps) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      setSearchTerm(search);
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [search]);

  const { data, isLoading } = useSearchUsersQuery(searchTerm);

  if (isLoading) return <SearchUserLoader />;

  const users = (data?.data as any[]) || [];

  return (
    <div>
      <h2 className="font-semibold mb-3">Search Results</h2>
      {users.map((user: any) => (
        <Link
          to={`/start-conversation/${user._id}`}
          key={`s-r-${user._id}`}
          className="p-2 flex gap-2 items-center"
          onClick={() => {
            setSearch("");
            setSearchTerm("");
          }}
        >
          <div className="size-10">
            <img src={user?.image} alt={user?.username} />
          </div>
          <div>
            <h3 className="text-lg">{user.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SearchResult;
