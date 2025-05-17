import { useState, useEffect } from "react";
import { adminApi } from "../../services/api";
import AdminSidebar from "../../components/AdminSidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import Button from "../../components/Button";
import FormInput from "../../components/FormInput";
import Modal from "../../components/Modal";
import { useToast } from "../../context/ToastContext";
import {
	FiSearch,
	FiEdit2,
	FiTrash2,
	FiCalendar,
	FiClock,
	FiFileText,
	FiFilter,
	FiBookOpen,
} from "react-icons/fi";

const BookingManagement = () => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [editingBooking, setEditingBooking] = useState(null);
	const [formData, setFormData] = useState({
		status: "",
		date: "",
		time: "",
		notes: "",
	});
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { showToast } = useToast();

	useEffect(() => {
		fetchBookings();
	}, []);

	const fetchBookings = async () => {
		try {
			setLoading(true);
			const response = await adminApi.getAllBookings();
			setBookings(response.data);
			setError(null);
		} catch (err) {
			const errorMessage = "Failed to load bookings";
			setError(errorMessage);
			showToast(errorMessage, "error");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleEditClick = (booking) => {
		const bookingDate = new Date(booking.date);
		const formattedDate = bookingDate.toISOString().split("T")[0];

		setEditingBooking(booking);
		setFormData({
			status: booking.status,
			date: formattedDate,
			time: booking.time,
			notes: booking.notes || "",
		});
	};

	const handleCancelEdit = () => {
		setEditingBooking(null);
		setFormData({
			status: "",
			date: "",
			time: "",
			notes: "",
		});
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await adminApi.updateBookingDetails(editingBooking._id, formData);
			setEditingBooking(null);
			showToast("Booking updated successfully", "success");
			fetchBookings(); // Refresh the booking list
		} catch (err) {
			const errorMessage = "Failed to update booking";
			setError(errorMessage);
			showToast(errorMessage, "error");
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteBooking = async (bookingId, customerName) => {
		if (
			!window.confirm(
				`Are you sure you want to delete the booking for ${
					customerName || "this customer"
				}? This action cannot be undone.`
			)
		) {
			return;
		}

		try {
			await adminApi.deleteBooking(bookingId);
			showToast("Booking deleted successfully", "success");
			fetchBookings(); // Refresh the booking list
		} catch (err) {
			const errorMessage = "Failed to delete booking";
			setError(errorMessage);
			showToast(errorMessage, "error");
			console.error(err);
		}
	};

	const filteredBookings = bookings.filter((booking) => {
		const matchesSearch =
			(booking.user?.name &&
				booking.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
			(booking.user?.email &&
				booking.user.email.toLowerCase().includes(searchTerm.toLowerCase()));

		const matchesStatus =
			filterStatus === "all" || booking.status === filterStatus;

		return matchesSearch && matchesStatus;
	});

	const getStatusColor = (status) => {
		switch (status) {
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "confirmed":
				return "bg-green-100 text-green-800";
			case "cancelled":
				return "bg-red-100 text-red-800";
			case "completed":
				return "bg-blue-100 text-blue-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="flex h-screen bg-[#121212]">
			<AdminSidebar />
			<div className="flex-1 overflow-auto p-6">
				<div className="bg-[#1e1e1e] rounded-lg p-6 shadow-lg border border-[#333333] min-h-[calc(100vh-3rem)]">
					<div className="flex items-center justify-between mb-6">
						<h1 className="text-2xl font-bold text-[#e0e0e0] flex items-center">
							<FiBookOpen className="mr-2 text-[#bb86fc]" /> Booking Management
						</h1>
						<Button
							variant="primary"
							size="small"
							onClick={fetchBookings}
							loading={loading}
							disabled={loading}>
							Refresh
						</Button>
					</div>

					{error && (
						<div className="mb-6">
							<ErrorMessage message={error} type="error" />
						</div>
					)}

					<div className="flex flex-col md:flex-row gap-4 mb-6">
						<div className="relative flex-1">
							<FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
							<input
								type="text"
								placeholder="Search by customer name or email..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 bg-[#121212] border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#bb86fc] text-[#e0e0e0] placeholder-gray-500"
								aria-label="Search bookings"
							/>
						</div>

						<div className="md:w-64">
							<div className="relative">
								<FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
								<select
									id="statusFilter"
									value={filterStatus}
									onChange={(e) => setFilterStatus(e.target.value)}
									className="w-full pl-10 pr-4 py-2 bg-[#121212] border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#bb86fc] text-[#e0e0e0] appearance-none"
									aria-label="Filter bookings by status">
									<option value="all">All Statuses</option>
									<option value="pending">Pending</option>
									<option value="confirmed">Confirmed</option>
									<option value="cancelled">Cancelled</option>
									<option value="completed">Completed</option>
								</select>
								<div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
									<svg
										className="fill-current h-4 w-4 text-gray-400"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20">
										<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
									</svg>
								</div>
							</div>
						</div>
					</div>

					{loading && bookings.length === 0 ? (
						<div className="flex justify-center items-center py-12">
							<LoadingSpinner size="large" text="Loading bookings..." />
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full border-collapse">
								<thead>
									<tr className="bg-[#2d2d2d] text-left">
										<th className="px-4 py-3 text-[#e0e0e0] font-medium rounded-tl-md">
											Date
										</th>
										<th className="px-4 py-3 text-[#e0e0e0] font-medium">
											Time
										</th>
										<th className="px-4 py-3 text-[#e0e0e0] font-medium">
											Customer
										</th>
										<th className="px-4 py-3 text-[#e0e0e0] font-medium text-center">
											Status
										</th>
										<th className="px-4 py-3 text-[#e0e0e0] font-medium hidden md:table-cell">
											Package
										</th>
										<th className="px-4 py-3 text-[#e0e0e0] font-medium hidden lg:table-cell">
											Created
										</th>
										<th className="px-4 py-3 text-[#e0e0e0] font-medium rounded-tr-md text-right">
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{filteredBookings.length === 0 ? (
										<tr>
											<td
												colSpan="7"
												className="px-4 py-8 text-center text-gray-400">
												{searchTerm || filterStatus !== "all"
													? "No bookings match your search criteria"
													: "No bookings found"}
											</td>
										</tr>
									) : (
										filteredBookings.map((booking, index) => (
											<tr
												key={booking._id}
												className={`border-b border-[#333333] ${
													index % 2 === 1 ? "bg-[#1a1a1a]" : ""
												} hover:bg-[#2d2d2d]`}>
												<td className="px-4 py-3 text-[#e0e0e0]">
													{new Date(booking.date).toLocaleDateString()}
												</td>
												<td className="px-4 py-3 text-[#e0e0e0]">
													{booking.time}
												</td>
												<td className="px-4 py-3 text-[#e0e0e0]">
													<div className="font-medium">
														{booking.user?.name || "Unknown"}
													</div>
													<div className="text-sm text-gray-400">
														{booking.user?.email}
													</div>
												</td>
												<td className="px-4 py-3 text-center">
													<span
														className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
															booking.status
														)}`}>
														{booking.status}
													</span>
												</td>
												<td className="px-4 py-3 text-[#e0e0e0] hidden md:table-cell">
													{booking.package?.name || "Standard"}
												</td>
												<td className="px-4 py-3 text-[#e0e0e0] hidden lg:table-cell">
													{new Date(booking.createdAt).toLocaleDateString()}
												</td>
												<td className="px-4 py-3 text-right space-x-2">
													<Button
														variant="text"
														size="small"
														icon={<FiEdit2 />}
														onClick={() => handleEditClick(booking)}
														ariaLabel={`Edit booking for ${
															booking.user?.name || "customer"
														}`}>
														Edit
													</Button>
													<Button
														variant="danger"
														size="small"
														icon={<FiTrash2 />}
														onClick={() =>
															handleDeleteBooking(
																booking._id,
																booking.user?.name
															)
														}
														ariaLabel={`Delete booking for ${
															booking.user?.name || "customer"
														}`}>
														Delete
													</Button>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>

			{editingBooking && (
				<Modal
					isOpen={!!editingBooking}
					onClose={handleCancelEdit}
					title={`Edit Booking for ${editingBooking.user?.name || "Customer"}`}
					size="medium">
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label
								htmlFor="status"
								className="block text-sm font-medium mb-1 text-gray-300">
								Status
							</label>
							<select
								id="status"
								name="status"
								value={formData.status}
								onChange={handleChange}
								required
								className="w-full px-3 py-2 rounded-md bg-[#121212] border border-[#333333] focus:outline-none focus:ring-2 focus:ring-[#bb86fc] focus:ring-opacity-20 text-[#e0e0e0]">
								<option value="pending">Pending</option>
								<option value="confirmed">Confirmed</option>
								<option value="cancelled">Cancelled</option>
								<option value="completed">Completed</option>
							</select>
						</div>

						<FormInput
							id="date"
							label="Booking Date"
							type="date"
							name="date"
							value={formData.date}
							onChange={handleChange}
							required
							icon={<FiCalendar />}
						/>

						<FormInput
							id="time"
							label="Booking Time"
							type="time"
							name="time"
							value={formData.time}
							onChange={handleChange}
							required
							icon={<FiClock />}
						/>

						<div>
							<label
								htmlFor="notes"
								className="block text-sm font-medium mb-1 text-gray-300">
								Notes
							</label>
							<div className="relative">
								<div className="absolute left-3 top-3 text-gray-400">
									<FiFileText />
								</div>
								<textarea
									id="notes"
									name="notes"
									value={formData.notes}
									onChange={handleChange}
									rows="3"
									className="w-full pl-10 pr-3 py-2 rounded-md bg-[#121212] border border-[#333333] focus:outline-none focus:ring-2 focus:ring-[#bb86fc] focus:ring-opacity-20 text-[#e0e0e0]"
									placeholder="Add any notes about this booking"></textarea>
							</div>
						</div>

						<div className="flex justify-end space-x-3 pt-2">
							<Button
								type="button"
								variant="secondary"
								onClick={handleCancelEdit}>
								Cancel
							</Button>
							<Button
								type="submit"
								variant="primary"
								loading={isSubmitting}
								disabled={isSubmitting}>
								Save Changes
							</Button>
						</div>
					</form>
				</Modal>
			)}
		</div>
	);
};

export default BookingManagement;
