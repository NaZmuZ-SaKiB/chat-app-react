const MessagesLoader = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 justify-end">
      {Array(10)
        .fill(0)
        .map((_, i) => {
          const width = Math.floor(Math.random() * 100) + 100;
          const align = i % 2 === 0 ? "self-start" : "self-end";

          return (
            <div
              key={`message-loader-${i}`}
              className={`max-w-sm h-8 ${align} bg-slate-200 animate-pulse rounded-2xl`}
              style={{ width }}
            ></div>
          );
        })}
    </div>
  );
};

export default MessagesLoader;
