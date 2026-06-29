import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";

const ErrorPage = () => (
  <div>
    <h1>404 Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <a href="/login">Go to login</a>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element:<Protected><Home /></Protected>,
    // element: <Navigate to="/login" replace />
  },
  {
        path:"/interview/:interviewId",
        element: <Protected><Interview /></Protected>
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
