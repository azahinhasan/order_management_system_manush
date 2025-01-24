import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Login from "./auth/login.page";
import Cookies from "js-cookie";
import Home from "./home/home.page";
import ProductList from "./product-management/productList.page";
import PromotionList from "./promotion-management/productList.page";
import PurchasePage from "./purchase/purchase.page";

const RoutesHandler = () => {
  const isAuthenticated = !!Cookies.get("tokenId");
  const ProtectedRoute = ({
    children,
    hasAccessRoles,
  }: {
    children: JSX.Element;
    hasAccessRoles: string[];
  }) => {
    return isAuthenticated ? (
      hasAccess(hasAccessRoles) ? (
        children
      ) : (
        <Navigate to="/home" />
      )
    ) : (
      <Navigate to="/login" />
    );
  };
  const NotProtectedRoute = ({ children }: { children: JSX.Element }) => {
    return !isAuthenticated ? children : <Navigate to="/home" />;
  };

  const hasAccess = (roles: string[]) => {
    if (roles.includes("PUBLICE")) return true;
    const userRoles = Cookies.get("role");
    return userRoles && roles.includes(userRoles);
  };

  const routesConfig = [
    {
      path: "/login",
      element: <Login />,
      isProtected: false,
      hasAccessRoles: ["PUBLICE"],
    },
    {
      path: "/home",
      element: <Home />,
      isProtected: true,
      hasAccessRoles: ["PUBLICE"],
    },
    {
      path: "/product-management",
      element: <ProductList />,
      isProtected: true,
      hasAccessRoles: ["ADMIN", "MANAGER", "DEVELOPER", "SUPER_ADMIN"],
    },
    {
      path: "/promotion-management",
      element: <PromotionList />,
      isProtected: true,
      hasAccessRoles: ["ADMIN", "MANAGER", "DEVELOPER", "SUPER_ADMIN"],
    },
    {
      path: "/confirm-purchase",
      element: <PurchasePage />,
      isProtected: true,
      hasAccessRoles: ["PUBLICE"],
    },
  ];

  return (
    <BrowserRouter>
      {isAuthenticated && <NavBar />}

      <Routes>
        {routesConfig.map(({ path, element, isProtected, hasAccessRoles }) => (
          <Route
            key={path}
            path={path}
            element={
              isProtected ? (
                <ProtectedRoute hasAccessRoles={hasAccessRoles}>
                  {element}
                </ProtectedRoute>
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
