import { Home, LayoutDashboard, Users } from "lucide-react";
import Index from "./pages/Index.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    page: <Dashboard />,
  },
  {
    title: "Admin Dashboard",
    to: "/admin",
    icon: <Users className="h-4 w-4" />,
    page: <AdminDashboard />,
  },
];
