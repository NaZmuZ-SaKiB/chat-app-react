import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/routes";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthContextProvider from "./context/AuthContextProvider";
import SocketContextProvider from "./context/SocketContextProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 4,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <SocketContextProvider>
          <RouterProvider router={routes} />
        </SocketContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
