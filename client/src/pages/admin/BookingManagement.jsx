import { useState, useEffect } from "react";
import { adminApi } from "../../services/api";
import AdminSidebar from "../../components/AdminSidebar";

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

	useEffect(() => {
		fetchBookings();
	}, []);

	const fetchBookings = async () => {
		try {
			setLoading(true);
			const response = await adminApi.getAllBookings();
			setBookings(response.data);
		} catch (err) {
			setError("Failed to load bookings");
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

		try {
			await adminApi.updateBookingDetails(editingBooking._id, formData);
			setEditingBooking(null);
			fetchBookings(); // Refresh the booking list
		} catch (err) {
			setError("Failed to update booking");
			console.error(err);
		}
	};

	const handleDeleteBooking = async (bookingId) => {
		if (!window.confirm("Are you sure you want to delete this booking?")) {
			return;
		}

		try {
			await adminApi.deleteBooking(bookingId);
			fetchBookings(); // Refresh the booking list
		} catch (err) {
			setError("Failed to delete booking");
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

	if (loading && bookings.length === 0) {
		return (
			<div className="admin-layout">
				<AdminSidebar />
				<div className="admin-content">
					<h1>Booking Management</h1>
					<div className="loading">Loading bookings...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="admin-layout">
			<AdminSidebar />
			<div className="admin-content">
				<h1>Booking Management</h1>

				{error && <div className="error-message">{error}</div>}

				<div className="admin-actions">
					<div className="search-box">
						<input
							type="text"
							placeholder="Search by customer name or email..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>

					<div className="filter-controls">
						<label htmlFor="statusFilter">Filter by status:</label>
						<select
							id="statusFilter"
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}>
							<option value="all">All</option>
							<option value="pending">Pending</option>
							<option value="confirmed">Confirmed</option>
							<option value="cancelled">Cancelled</option>
							<option value="completed">Completed</option>
						</select>
					</div>
				</div>

				<div className="table-container">
					<table className="admin-table">
						<thead>
							<tr>
								<th>Date</th>
								<th>Time</th>
								<th>Customer</th>
								<th>Status</th>
								<th>Package</th>
								<th>Created</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredBookings.map((booking) => (
								<tr key={booking._id}>
									<td>{new Date(booking.date).toLocaleDateString()}</td>
									<td>{booking.time}</td>
									<td>
										{booking.user?.name || "Unknown"}
										<br />
										<small>{booking.user?.email}</small>
									</td>
									<td>
										<span className={`status-badge ${booking.status}`}>
											{booking.status}
										</span>
									</td>
									<td>{booking.package?.name || "Standard"}</td>
									<td>{new Date(booking.createdAt).toLocaleDateString()}</td>
									<td>
										<button
											className="action-btn edit"
											onClick={() => handleEditClick(booking)}>
											Edit
										</button>
										<button
											className="action-btn delete"
											onClick={() => handleDeleteBooking(booking._id)}>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{editingBooking && (
					<div className="modal-overlay">
						<div className="edit-booking-modal">
							<h2>Edit Booking</h2>
							<form onSubmit={handleSubmit}>
								<div className="form-group">
									<label htmlFor="status">Status</label>
									<select
										id="status"
										name="status"
										value={formData.status}
										onChange={handleChange}
										required>
										<option value="pending">Pending</option>
										<option value="confirmed">Confirmed</option>
										<option value="cancelled">Cancelled</option>
										<option value="completed">Completed</option>
									</select>
								</div>

								<div className="form-group">
									<label htmlFor="date">Date</label>
									<input
										type="date"
										id="date"
										name="date"
										value={formData.date}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="form-group">
									<label htmlFor="time">Time</label>
									<input
										type="time"
										id="time"
										name="time"
										value={formData.time}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="form-group">
									<label htmlFor="notes">Notes</label>
									<textarea
										id="notes"
										name="notes"
										value={formData.notes}
										onChange={handleChange}
										rows="3"></textarea>
								</div>

								<div className="form-actions">
									<button
										type="button"
										className="cancel-btn"
										onClick={handleCancelEdit}>
										Cancel
									</button>
									<button type="submit" className="save-btn">
										Save Changes
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default BookingManagement;
