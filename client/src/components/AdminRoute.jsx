import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const AdminRoute = () => {
	const { isAuthenticated, user, loading } = useAuth();

	// Add debugging to check admin status
	useEffect(() => {
		console.log("AdminRoute - Auth Status:", {
			isAuthenticated,
			loading,
			user: user ? { ...user, isAdmin: user.isAdmin } : null,
			hasAdminRights: isAuthenticated && user && user.isAdmin,
		});
	}, [isAuthenticated, user, loading]);

	// Show loading state while checking authentication
	if (loading) {
		return (
			<div className="min-h-screen flex justify-center items-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
				<p className="ml-3">Verifying admin access...</p>
			</div>
		);
	}

	// Check if user is authenticated and is an admin
	if (!isAuthenticated) {
		console.log("User not authenticated, redirecting to login");
		return <Navigate to="/login" replace />;
	}

	if (!user || !user.isAdmin) {
		console.log("User not admin, redirecting to dashboard", user);
		return <Navigate to="/dashboard" replace />;
	}

	// Render the child routes if user is authenticated and is an admin
	console.log("User is admin, rendering admin content");
	return <Outlet />;
};

export default AdminRoute;
