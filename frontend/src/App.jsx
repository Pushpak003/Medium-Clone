import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/navbar.component";
import Footer from "./components/footer.component";
import UserAuthForm from "./pages/UserAuthForm.page";
import Editor from "./pages/Editor";
import Homepage from "./pages/Homepage";
import SearchPage from "./pages/SearchPage";
import PageNotFound from "./pages/404";
import ProfilePage from "./pages/ProfilePage";
import BlogPage from "./pages/BlogPage";
import SideNav from "./components/ui/SideNav";
import EditProfilePage from "./pages/EditProfilePage";
import ChangePwdPage from "./pages/ChangePwdPage";
import ManageBlogs from "./pages/ManageBlogs";
import NotificationsPage from "./pages/notifications.page";
import DashboardPage from "./pages/dashboard.page";
import { ProtectedRoute, GuestRoute } from "./components/ProtectedRoute";
import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext({});

const App = () => {
  const { pathname } = useLocation();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const themeFromLs = localStorage.getItem("medium-theme");
    if (themeFromLs) {
      setTheme(themeFromLs);
      document.body.setAttribute("data-theme", themeFromLs);
    } else {
      document.body.setAttribute("data-theme", theme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {!pathname.startsWith("/editor") && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/search/:query" element={<SearchPage />} />
        <Route path="/user/:id" element={<ProfilePage />} />
        <Route path="/blog/:id" element={<BlogPage />} />

        {/* Guest only */}
        <Route path="/signin" element={<GuestRoute><UserAuthForm type="sign-in" /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><UserAuthForm type="sign-up" /></GuestRoute>} />

        {/* Protected */}
        <Route path="/editor" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
        <Route path="/editor/:id" element={<ProtectedRoute><Editor /></ProtectedRoute>} />

        <Route path="/dashboard" element={<ProtectedRoute><SideNav /></ProtectedRoute>}>
          <Route path="blogs" element={<ManageBlogs />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route index element={<DashboardPage />} />
        </Route>

        <Route path="/settings" element={<ProtectedRoute><SideNav /></ProtectedRoute>}>
          <Route path="edit-profile" element={<EditProfilePage />} />
          <Route path="change-password" element={<ChangePwdPage />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
            {!pathname.startsWith("/editor") && <Footer />}

    </ThemeContext.Provider>
  );
};

export default App;