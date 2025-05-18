import { useState, useEffect } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

const AdminBookingList = () => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [processingIds, setProcessingIds] = useState([]);
	const { user, isAuthenticated } = useAuth();
	const toast = useToast();

	const isAdmin = user && user.isAdmin;

	// Debug user status on component load
	useEffect(() => {
		console.log("Auth status in AdminBookingList:", {
			isAuthenticated,
			user: user ? { ...user, isAdmin: user.isAdmin } : null,
			isAdmin,
		});
	}, [user, isAuthenticated, isAdmin]);

	useEffect(() => {
		if (isAuthenticated && isAdmin) {
			fetchBookings();
		} else {
			setLoading(false);
			setError("You don't have admin permissions to view this data.");
		}
	}, [isAuthenticated, isAdmin]);

	const fetchBookings = async () => {
		try {
			// Use the token in localStorage for authentication if available
			const token = localStorage.getItem("token");
			console.log(
				"Using token from localStorage:",
				token ? "Found" : "Not found"
			);

			const response = await api.getAllBookings();
			console.log("Bookings response:", response);
			setBookings(response.data);
			setError(null);
			setLoading(false);
		} catch (err) {
			console.error("Error fetching bookings:", err);

			// Handle specific error types
			if (err.response) {
				if (err.response.status === 401) {
					setError("Authentication error. Please log in again.");
					toast.error("Session expired");
				} else if (err.response.status === 403) {
					setError("You don't have permission to access this resource.");
					toast.error("Access denied");
				} else {
					setError(
						`Error: ${err.response.data.error || "Failed to load bookings"}`
					);
					toast.error("Failed to load bookings");
				}
			} else {
				setError("Network error. Please check your connection and try again.");
				toast.error("Network error");
			}
			setLoading(false);
		}
	};

	const handleConfirmBooking = async (bookingId) => {
		try {
			setProcessingIds((prev) => [...prev, bookingId]);
			await api.confirmBooking(bookingId);

			// Optimistic UI update
			setBookings((prevBookings) =>
				prevBookings.map((booking) =>
					booking._id === bookingId
						? { ...booking, status: "confirmed" }
						: booking
				)
			);

			toast.success("Booking confirmed successfully!");
		} catch (err) {
			console.error("Error confirming booking:", err);
			toast.error("Failed to confirm booking. Please try again.");
			// Refresh to ensure data consistency
			fetchBookings();
		} finally {
			setProcessingIds((prev) => prev.filter((id) => id !== bookingId));
		}
	};

	const loginAsAdmin = () => {
		// First clear any existing tokens
		localStorage.removeItem("token");

		// Then redirect to login page
		window.location.href = "/login";
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-48">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div
				className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
				role="alert">
				<p>{error}</p>
				{isAdmin ? (
					<button
						onClick={fetchBookings}
						className="mt-2 bg-red-700 text-white py-1 px-3 rounded-md hover:bg-red-800">
						Try Again
					</button>
				) : (
					<button
						onClick={loginAsAdmin}
						className="mt-2 bg-blue-700 text-white py-1 px-3 rounded-md hover:bg-blue-800">
						Log In as Admin
					</button>
				)}
			</div>
		);
	}

	// Only show actual bookings content if user is an admin
	if (!isAdmin) {
		return (
			<div
				className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded"
				role="alert">
				<p>You need administrator privileges to view this page.</p>
				<button
					onClick={loginAsAdmin}
					className="mt-2 bg-blue-700 text-white py-1 px-3 rounded-md hover:bg-blue-800">
					Log In as Admin
				</button>
			</div>
		);
	}

	if (bookings.length === 0) {
		return (
			<div className="text-center py-8">
				<h3 className="text-lg font-medium text-gray-700">
					No bookings available
				</h3>
				<p className="text-gray-500 mt-2">
					There are currently no bookings in the system.
				</p>
			</div>
		);
	}

	// Group bookings by status
	const pendingBookings = bookings.filter(
		(booking) => booking.status === "pending"
	);
	const confirmedBookings = bookings.filter(
		(booking) => booking.status === "confirmed"
	);

	return (
		<div className="space-y-8">
			{/* Pending Bookings Section */}
			<div className="bg-white shadow-md rounded-lg overflow-hidden">
				<div className="bg-yellow-50 px-6 py-4 border-b border-yellow-100">
					<h3 className="text-lg font-medium text-yellow-800">
						Pending Bookings
					</h3>
				</div>
				{pendingBookings.length === 0 ? (
					<div className="p-6 text-center text-gray-500">
						No pending bookings
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Customer
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Event Type
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Date
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Special Request
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{pendingBookings.map((booking) => (
									<tr key={booking._id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-gray-900">
												{booking.user?.name || "Unknown"}
											</div>
											<div className="text-sm text-gray-500">
												{booking.user?.email || "No email"}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-900">
												{booking.eventType}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-500">
												{new Date(booking.eventDate).toLocaleDateString()}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-gray-500 max-w-xs truncate">
												{booking.specialRequest || "None"}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<button
												onClick={() => handleConfirmBooking(booking._id)}
												disabled={processingIds.includes(booking._id)}
												className={`bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm ${
													processingIds.includes(booking._id)
														? "opacity-50 cursor-not-allowed"
														: ""
												}`}>
												{processingIds.includes(booking._id)
													? "Processing..."
													: "Confirm"}
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Confirmed Bookings Section */}
			<div className="bg-white shadow-md rounded-lg overflow-hidden">
				<div className="bg-green-50 px-6 py-4 border-b border-green-100">
					<h3 className="text-lg font-medium text-green-800">
						Confirmed Bookings
					</h3>
				</div>
				{confirmedBookings.length === 0 ? (
					<div className="p-6 text-center text-gray-500">
						No confirmed bookings
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Customer
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Event Type
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Date
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Special Request
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Confirmed At
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{confirmedBookings.map((booking) => (
									<tr key={booking._id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-gray-900">
												{booking.user?.name || "Unknown"}
											</div>
											<div className="text-sm text-gray-500">
												{booking.user?.email || "No email"}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-900">
												{booking.eventType}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-500">
												{new Date(booking.eventDate).toLocaleDateString()}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-gray-500 max-w-xs truncate">
												{booking.specialRequest || "None"}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-500">
												{new Date(
													booking.updatedAt || booking.createdAt
												).toLocaleString()}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminBookingList;
