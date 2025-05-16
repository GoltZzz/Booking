import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { bookingApi } from "../services/api";
import "../styles/Dashboard.css";

const Dashboard = () => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchBookings = async () => {
			try {
				const response = await bookingApi.getBookings();
				setBookings(response.data);
				setLoading(false);
			} catch (err) {
				console.error("Error fetching bookings:", err);
				setError("Failed to load your bookings. Please try again later.");
				setLoading(false);
			}
		};

		fetchBookings();
	}, []);

	const handleCancelBooking = async (id) => {
		if (window.confirm("Are you sure you want to cancel this booking?")) {
			try {
				await bookingApi.deleteBooking(id);
				setBookings(bookings.filter((booking) => booking._id !== id));
			} catch (err) {
				console.error("Error cancelling booking:", err);
				setError("Failed to cancel booking. Please try again.");
			}
		}
	};

	const formatDate = (dateString) => {
		const options = { year: "numeric", month: "long", day: "numeric" };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	const formatTime = (timeString) => {
		const options = { hour: "2-digit", minute: "2-digit" };
		return new Date(`2000-01-01T${timeString}`).toLocaleTimeString(
			undefined,
			options
		);
	};

	if (loading) {
		return <div className="loading">Loading your bookings...</div>;
	}

	return (
		<div className="dashboard">
			<div className="dashboard-header">
				<h1>My Bookings</h1>
				<Link to="/booking" className="btn">
					Book New Session
				</Link>
			</div>

			{error && <div className="error-message">{error}</div>}

			{bookings.length === 0 ? (
				<div className="no-bookings">
					<p>You don't have any bookings yet.</p>
					<Link to="/booking" className="btn">
						Book Your First Session
					</Link>
				</div>
			) : (
				<div className="bookings-list">
					{bookings.map((booking) => (
						<div className="booking-card" key={booking._id}>
							<div className="booking-header">
								<h3>{booking.eventType}</h3>
								<span
									className={`status status-${booking.status.toLowerCase()}`}>
									{booking.status}
								</span>
							</div>

							<div className="booking-details">
								<p>
									<strong>Date:</strong> {formatDate(booking.date)}
								</p>
								<p>
									<strong>Time:</strong> {formatTime(booking.startTime)} -{" "}
									{formatTime(booking.endTime)}
								</p>
								<p>
									<strong>Location:</strong> {booking.location}
								</p>
								<p>
									<strong>Package:</strong> {booking.package.name}
								</p>
								<p>
									<strong>Total:</strong> ${booking.totalAmount}
								</p>
							</div>

							<div className="booking-actions">
								{booking.status === "CONFIRMED" && (
									<button
										className="btn btn-outline btn-cancel"
										onClick={() => handleCancelBooking(booking._id)}>
										Cancel Booking
									</button>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Dashboard;
