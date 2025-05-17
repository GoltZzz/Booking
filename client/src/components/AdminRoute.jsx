import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
	const { isAuthenticated, user, loading } = useAuth();

	// Show loading state while checking authentication
	if (loading) {
		return <div className="loading">Loading...</div>;
	}

	// Check if user is authenticated and is an admin
	if (!isAuthenticated || !user || !user.isAdmin) {
		return <Navigate to="/login" replace />;
	}

	// Render the child routes if user is authenticated and is an admin
	return <Outlet />;
};

export default AdminRoute;
