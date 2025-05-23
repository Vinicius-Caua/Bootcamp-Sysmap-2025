import { createBrowserRouter } from "react-router";
import ProtectedRoute from "@/api/routes/Autenticacao/protectedRoute";
import SignIn from "@/screens/Login";
import SingUp from "@/screens/Cadastro";
import Home from "@/screens/Home";
import NotFoundPage from "@/screens/notFoundPage";
import Layout from "@/layout";
import ListagemTipo from "@/screens/ListagemTipo";
import UserProfile from "@/screens/UserProfile";
import UserEditProfile from "@/screens/UserEditProfile";

const router = createBrowserRouter([
  // Public routes
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/register",
    element: <SingUp />,
  },

  // Protected routes
  {
    element: <ProtectedRoute />, // Wrap the protected routes with the ProtectedRoute component
    children: [
      {
        element: <Layout />, // Layout component to be used for all protected routes
        children: [
          {
            index: true, // Default route when accessing the base path
            path: "/home",
            element: <Home />,
          },
          {
            path: "/types-list/:typeId/:typeName", // Dynamic route for listing activities by type
            element: <ListagemTipo />, // ListagemTipo component for listing types
          },
          {
            path: "/profile", // Dynamic route for user profile
            element: <UserProfile />, // UserProfile component for user profile
          },
          {
            path: "/profile/edit", // Dynamic route for editing user profile
            element: <UserEditProfile />, // UserEditProfile component for editing profile
          },
        ],
      },
    ],
  },

  // Catch-all route for 404 Not Found
  {
    path: "*",
    element: <NotFoundPage />, // This will catch all undefined routes and show the NotFoundPage component
  },
]);

export default router;
