import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Login from "./auth/login.page";
import Cookies from "js-cookie";
import Home from "./home/home.page";


const RoutesHandler = () => {
  const isAuthenticated = !!Cookies.get("tokenId");
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };
  const NotProtectedRoute = ({ children }: { children: JSX.Element }) => {
    return !isAuthenticated ? children : <Navigate to="/home" />;
  };

  const routesConfig = [
    { path: "/login", element: <Login />, isProtected: false },
    { path: "/home", element: <Home />, isProtected: true },
  ];

  return (
    <BrowserRouter>
      {isAuthenticated && <NavBar />}

      <Routes>
        {routesConfig.map(({ path, element, isProtected }) => (
          <Route
            key={path}
            path={path}
            element={
              isProtected ? (
                <ProtectedRoute>{element}</ProtectedRoute>
              ) : (
                <NotProtectedRoute>{element}</NotProtectedRoute>
              )
            }
          />
        ))}
        <Route
          path="*"
          element={
            Cookies.get("token") ? (
              <Navigate to="/home" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesHandler;
