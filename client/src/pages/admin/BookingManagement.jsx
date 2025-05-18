import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import AdminBookingList from "../../components/AdminBookingList";
import { useEffect } from "react";
import { FiCalendar } from "react-icons/fi";

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
			<div className="min-h-screen flex justify-center items-center bg-[#121212]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bb86fc]"></div>
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
		<div className="min-h-screen bg-[#121212] flex">
			<AdminSidebar />
			<div className="flex-1 overflow-auto p-6">
				<div className="bg-[#1e1e1e] rounded-lg p-6 shadow-lg border border-[#333333] min-h-[calc(100vh-3rem)]">
					<div className="flex items-center justify-between mb-6">
						<h1 className="text-2xl font-bold text-[#e0e0e0] flex items-center">
							<FiCalendar className="mr-2 text-[#bb86fc]" /> Booking Management
						</h1>
					</div>

					<AdminBookingList />
				</div>
			</div>
		</div>
	);
};

export default BookingManagement;
