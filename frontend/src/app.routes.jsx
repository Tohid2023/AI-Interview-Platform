import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Dashboard from "./features/interview/pages/Dashboard";
import Interview from "./features/interview/pages/Interview";
import RecentPlans from "./features/interview/pages/RecentPlans";
import Landing from "./features/interview/pages/Landing";
import Layout from "./components/Layout";

export const router = createBrowserRouter([
  // Public Routes (Landing Page)
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Landing />,
      }
    ]
  },
  // Protected Routes (Dashboard Area)
  {
    path: "/",
    element: <Protected><Layout /></Protected>,
    children: [
      {
        path: "/create",
        element: <Dashboard />,
      },
      {
        path: "/create-plan",
        element: <Home />,
      },
      {
        path: "/interview/:interviewId",
        element: <Interview />,
      },
      {
        path: "/recent",
        element: <RecentPlans />,
      }
    ]
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
    element: (
      <div>
        <h1>404 Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <a href="/login">Go to login</a>
      </div>
    ),
  },
]);
