import LeftSidebar from "@/components/Layout/LeftSidebar";

const HomePage = () => {
  return (
    <>
      <div className="bg-slate-100 flex-1 h-svh grid place-items-center max-md:hidden">
        <div className="text-center">
          <h2 className="font-semibold text-xl text-gray-700 uppercase">
            Welcome To the
          </h2>
          <h1 className="font-bold text-5xl uppercase">Chats App</h1>

          <h3 className="mt-5 mb-2 text-xl font-medium">Get Started</h3>
          <div className="text-gray-500 text-lg">
            <p>Search Your Friends</p>
            <p>Start Chatting</p>
            <br />
            <p className="text-sm">
              Sometimes call may not work because it is hosted in free server
            </p>
            <p className="text-sm">
              Try refreshing the page or logout and login again
            </p>
          </div>
        </div>
      </div>
      <div className="md:hidden w-full">
        <LeftSidebar />
      </div>
    </>
  );
};

export default HomePage;
