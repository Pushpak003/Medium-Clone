import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

// Sirf logged-in users ke liye
export const ProtectedRoute = ({ children }) => {
  // authSlice stores this as "accessToken", not "access_token" -
  // destructuring the wrong key always returned undefined here.
  const { accessToken } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

// Sirf guest users ke liye (already logged-in hain to home pe bhejo)
export const GuestRoute = ({ children }) => {
  const { accessToken } = useSelector((state) => state.auth);

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};