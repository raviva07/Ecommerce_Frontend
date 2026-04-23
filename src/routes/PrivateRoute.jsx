import React from "react";
import { Navigate } from "react-router-dom";
import Loader from "../components/common/Loader";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // simulate auth loading (optional)
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => setLoading(false), 300); // small delay for UX
  }, []);

  if (loading) return <Loader />;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
