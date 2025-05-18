import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminBookingList from "../../components/AdminBookingList";
import { useEffect } from "react";

const BookingManagement = () => {
	const { user, isAuthenticated, loading } = useAuth();

	// Log the auth status for debugging
	useEffect(() => {
		console.log("BookingManagement - Auth State:", {
			isAuthenticated,
			user: user
				? {
						...user,
						isAdmin: user.isAdmin,
				  }
				: null,
			loading,
		});
	}, [user, isAuthenticated, loading]);

	if (loading) {
		return (
			<div className="min-h-screen flex justify-center items-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (!isAuthenticated) {
		console.log("Not authenticated, redirecting to login");
		return <Navigate to="/login" replace />;
	}

	// Check if user is admin
	if (!user?.isAdmin) {
		console.log("Not admin, redirecting to dashboard");
		return <Navigate to="/dashboard" replace />;
	}

	return (
		<div className="min-h-screen bg-gray-100 flex">
			<AdminSidebar />
			<div className="flex-1 p-8">
				<div className="max-w-7xl mx-auto">
					<h1 className="text-2xl font-bold text-gray-800 mb-6">
						Booking Management
					</h1>

					<div className="bg-white rounded-lg shadow-md p-6">
						<AdminBookingList />
					</div>
				</div>
			</div>
		</div>
	);
};

export default BookingManagement;
