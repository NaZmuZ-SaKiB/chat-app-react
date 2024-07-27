const SearchUserLoader = () => {
  return (
    <div>
      <h2 className="font-semibold mb-3">Search Results</h2>
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div
            key={`conversation-loader-${i}`}
            className="p-2 flex gap-2 items-center"
          >
            <div className="size-10 rounded-full bg-slate-200 animate-pulse"></div>
            <div className="flex-1">
              <h3 className="w-full max-w-[30%] h-4 rounded-2xl bg-slate-200 animate-pulse"></h3>
            </div>
          </div>
        ))}
    </div>
  );
};

export default SearchUserLoader;
