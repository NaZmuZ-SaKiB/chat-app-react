import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import SignUpPage from "../pages/SignUp/SignUpPage";
import SignInPage from "../pages/SignIn/SignInPage";
import ConversationPage from "@/pages/Conversation/ConversationPage";
import HomePage from "@/pages/Home/HomePage";
import StartConversationPage from "@/pages/StartConversation/StartConversationPage";
import CallSendingPage from "@/pages/Calls/CallSendingPage";
import CallReceivingPage from "@/pages/Calls/CallReceivingPage";
import AudioCallPage from "@/pages/Calls/AudioCallPage";
import MyProfilePage from "@/pages/MyProfile/MyProfilePage";
import VideoCallPage from "@/pages/Calls/VideoCallPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/conversation/:id",
        element: <ConversationPage />,
      },
      {
        path: "/start-conversation/:id",
        element: <StartConversationPage />,
      },
      {
        path: "/my-profile",
        element: <MyProfilePage />,
      },
    ],
  },
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/call-sending/:id",
    element: <CallSendingPage />,
  },
  {
    path: "/call-receiving/:id",
    element: <CallReceivingPage />,
  },
  {
    path: "/audio-call/:id",
    element: <AudioCallPage />,
  },
  {
    path: "/video-call/:id",
    element: <VideoCallPage />,
  },
]);

export default router;
