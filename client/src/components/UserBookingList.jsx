import { useState, useEffect } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

const UserBookingList = () => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { showToast } = useToast();

	useEffect(() => {
		fetchUserBookings();
	}, []);

	const fetchUserBookings = async () => {
		try {
			setLoading(true);
			const response = await api.getUserBookings();
			setBookings(response.data);
			setError(null);
		} catch (err) {
			console.error("Error fetching bookings:", err);
			setError("Failed to load your bookings. Please try again.");
			showToast("Failed to load bookings", "error");
		} finally {
			setLoading(false);
		}
	};

	const getStatusBadgeColor = (status) => {
		switch (status) {
			case "confirmed":
				return "bg-green-100 text-green-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "cancelled":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
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
				<button
					onClick={fetchUserBookings}
					className="mt-2 bg-red-700 text-white py-1 px-3 rounded-md hover:bg-red-800">
					Try Again
				</button>
			</div>
		);
	}

	if (bookings.length === 0) {
		return (
			<div className="text-center py-8">
				<h3 className="text-lg font-medium text-gray-700">No bookings yet</h3>
				<p className="text-gray-500 mt-2">You haven't made any bookings yet.</p>
			</div>
		);
	}

	return (
		<div className="bg-white shadow-md rounded-lg overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Event Type
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Date
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Status
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Created
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{bookings.map((booking) => (
							<tr key={booking._id} className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm font-medium text-gray-900">
										{booking.eventType}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm text-gray-500">
										{new Date(booking.eventDate).toLocaleDateString()}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span
										className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
											booking.status
										)}`}>
										{booking.status.charAt(0).toUpperCase() +
											booking.status.slice(1)}
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{new Date(booking.createdAt).toLocaleDateString()}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default UserBookingList;
