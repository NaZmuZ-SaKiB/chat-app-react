const ConversationsLoader = () => {
  return (
    <div>
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div
            key={`conversation-loader-${i}`}
            className="p-2 flex gap-2 items-center"
          >
            <div className="size-14 rounded-full bg-slate-200 animate-pulse"></div>
            <div className="flex-1 overflow-hidden">
              <h3 className="w-full max-w-[30%] h-5 rounded-2xl bg-slate-200 animate-pulse mb-2"></h3>
              <p className="w-full max-w-[50%] h-3 rounded-2xl bg-slate-200 animate-pulse"></p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ConversationsLoader;
