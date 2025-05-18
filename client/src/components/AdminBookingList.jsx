import { useState, useEffect } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";
import {
	FiRefreshCw,
	FiAlertCircle,
	FiClock,
	FiCheckCircle,
} from "react-icons/fi";

// Status badge component for consistent styling
const StatusBadge = ({ status }) => {
	const getStatusStyles = (status) => {
		switch (status.toLowerCase()) {
			case "pending":
				return "bg-yellow-500 bg-opacity-20 text-yellow-500";
			case "confirmed":
				return "bg-green-500 bg-opacity-20 text-green-500";
			case "cancelled":
				return "bg-red-500 bg-opacity-20 text-red-500";
			case "completed":
				return "bg-blue-500 bg-opacity-20 text-blue-500";
			default:
				return "bg-gray-500 bg-opacity-20 text-gray-500";
		}
	};

	return (
		<span
			className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(
				status
			)}`}>
			{status.charAt(0).toUpperCase() + status.slice(1)}
		</span>
	);
};

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
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#bb86fc]"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div
				className="bg-[#252525] border border-[#333333] text-[#e0e0e0] px-4 py-3 rounded"
				role="alert">
				<div className="flex items-center">
					<FiAlertCircle className="text-[#ff5252] mr-2" size={20} />
					<p>{error}</p>
				</div>
				{isAdmin ? (
					<Button
						onClick={fetchBookings}
						variant="primary"
						size="small"
						className="mt-2"
						icon={<FiRefreshCw />}>
						Try Again
					</Button>
				) : (
					<Button
						onClick={loginAsAdmin}
						variant="primary"
						size="small"
						className="mt-2">
						Log In as Admin
					</Button>
				)}
			</div>
		);
	}

	// Only show actual bookings content if user is an admin
	if (!isAdmin) {
		return (
			<div
				className="bg-[#252525] border border-[#333333] text-[#e0e0e0] px-4 py-3 rounded"
				role="alert">
				<div className="flex items-center">
					<FiAlertCircle className="text-[#ff5252] mr-2" size={20} />
					<p>You need administrator privileges to view this page.</p>
				</div>
				<Button
					onClick={loginAsAdmin}
					variant="primary"
					size="small"
					className="mt-2">
					Log In as Admin
				</Button>
			</div>
		);
	}

	if (bookings.length === 0) {
		return (
			<div className="text-center py-8 text-[#9e9e9e]">
				<FiAlertCircle className="mx-auto mb-2 text-2xl" />
				<h3 className="text-lg font-medium text-[#e0e0e0]">
					No bookings available
				</h3>
				<p className="mt-2">There are currently no bookings in the system.</p>
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
			<div className="bg-[#252525] rounded-lg shadow overflow-hidden border border-[#333333]">
				<div className="px-6 py-4 border-b border-[#333333] flex items-center justify-between">
					<h3 className="text-lg font-medium text-[#e0e0e0] flex items-center">
						<FiClock className="mr-2 text-yellow-500" /> Pending Bookings
					</h3>
					<Button
						variant="outline"
						size="small"
						onClick={fetchBookings}
						icon={<FiRefreshCw />}>
						Refresh
					</Button>
				</div>
				{pendingBookings.length === 0 ? (
					<div className="p-6 text-center text-[#9e9e9e]">
						No pending bookings
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-[#1e1e1e]">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
										Customer
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
										Event Type
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
										Date
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
										Special Request
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-[#333333]">
								{pendingBookings.map((booking) => (
									<tr key={booking._id} className="hover:bg-[#2d2d2d]">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-[#e0e0e0]">
												{booking.user?.name || "Unknown"}
											</div>
											<div className="text-sm text-gray-400">
												{booking.user?.email || "No email"}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-[#e0e0e0]">
												{booking.eventType}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-400">
												{new Date(booking.eventDate).toLocaleDateString()}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<StatusBadge status={booking.status} />
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-gray-400 max-w-xs truncate">
												{booking.specialRequest || "None"}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<Button
												onClick={() => handleConfirmBooking(booking._id)}
												variant="primary"
												size="small"
												disabled={processingIds.includes(booking._id)}
												loading={processingIds.includes(booking._id)}>
												Confirm
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Confirmed Bookings Section */}
			<div className="bg-[#252525] rounded-lg shadow overflow-hidden border border-[#333333]">
				<div className="px-6 py-4 border-b border-[#333333] flex items-center">
					<h3 className="text-lg font-medium text-[#e0e0e0] flex items-center">
						<FiCheckCircle className="mr-2 text-green-500" /> Confirmed Bookings
					</h3>
				</div>
				{confirmedBookings.length === 0 ? (
					<div className="p-6 text-center text-[#9e9e9e]">
						No confirmed bookings
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-[#1e1e1e]">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
										Customer
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
										Event Type
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
										Date
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
										Special Request
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
										Confirmed At
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-[#333333]">
								{confirmedBookings.map((booking) => (
									<tr key={booking._id} className="hover:bg-[#2d2d2d]">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-[#e0e0e0]">
												{booking.user?.name || "Unknown"}
											</div>
											<div className="text-sm text-gray-400">
												{booking.user?.email || "No email"}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-[#e0e0e0]">
												{booking.eventType}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-400">
												{new Date(booking.eventDate).toLocaleDateString()}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<StatusBadge status={booking.status} />
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-gray-400 max-w-xs truncate">
												{booking.specialRequest || "None"}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-400">
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
