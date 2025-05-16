import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { packageApi, bookingApi } from "../services/api";
import "../styles/Booking.css";

const Booking = () => {
	const [packages, setPackages] = useState([]);
	const [selectedPackage, setSelectedPackage] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [formData, setFormData] = useState({
		eventType: "",
		date: "",
		startTime: "",
		endTime: "",
		location: "",
		additionalNotes: "",
	});
	const navigate = useNavigate();

	useEffect(() => {
		const fetchPackages = async () => {
			try {
				const response = await packageApi.getPackages();
				setPackages(response.data);
				setLoading(false);
			} catch (err) {
				console.error("Error fetching packages:", err);
				setError("Failed to load packages. Please try again later.");
				setLoading(false);
			}
		};

		fetchPackages();
	}, []);

	const handlePackageSelect = (pkg) => {
		setSelectedPackage(pkg);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const calculateEndTime = (startTime, duration) => {
		if (!startTime || !duration) return "";

		const [hours, minutes] = startTime.split(":").map(Number);
		const date = new Date();
		date.setHours(hours, minutes, 0);
		date.setHours(date.getHours() + duration);

		return `${String(date.getHours()).padStart(2, "0")}:${String(
			date.getMinutes()
		).padStart(2, "0")}`;
	};

	useEffect(() => {
		if (formData.startTime && selectedPackage) {
			const endTime = calculateEndTime(
				formData.startTime,
				selectedPackage.duration
			);
			setFormData((prevState) => ({
				...prevState,
				endTime,
			}));
		}
	}, [formData.startTime, selectedPackage]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!selectedPackage) {
			setError("Please select a package");
			return;
		}

		try {
			const bookingData = {
				bookingDate: formData.date,
				startTime: formData.startTime,
				endTime: formData.endTime,
				duration: selectedPackage.duration,
				category: formData.eventType,
				packageType: selectedPackage.name,
				specialRequests: formData.additionalNotes,
				location: formData.location,
			};

			await bookingApi.createBooking(bookingData);
			navigate("/dashboard");
		} catch (err) {
			console.error("Error creating booking:", err);
			setError(
				err.response?.data?.message ||
					"Failed to create booking. Please try again."
			);
		}
	};

	if (loading) {
		return <div className="loading">Loading packages...</div>;
	}

	return (
		<div className="booking-page">
			<h1>Book a Photo Booth</h1>

			{error && <div className="error-message">{error}</div>}

			<div className="booking-container">
				<div className="package-selection">
					<h2>Select a Package</h2>
					<div className="package-options">
						{packages.map((pkg) => (
							<div
								key={pkg._id}
								className={`package-option ${
									selectedPackage?._id === pkg._id ? "selected" : ""
								}`}
								onClick={() => handlePackageSelect(pkg)}>
								<h3>{pkg.name}</h3>
								<p className="price">${pkg.price}</p>
								<p className="duration">{pkg.duration} hours</p>
								<ul className="features">
									{pkg.features.map((feature, index) => (
										<li key={index}>{feature}</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>

				<div className="booking-form-container">
					<h2>Event Details</h2>
					<form onSubmit={handleSubmit} className="booking-form">
						<div className="form-group">
							<label htmlFor="eventType">Event Type</label>
							<select
								id="eventType"
								name="eventType"
								value={formData.eventType}
								onChange={handleChange}
								required>
								<option value="">Select Event Type</option>
								<option value="Birthday">Birthday</option>
								<option value="Wedding pre-nup">Wedding pre-nup</option>
								<option value="Debut photoshoot">Debut photoshoot</option>
								<option value="Maternity">Maternity</option>
							</select>
						</div>

						<div className="form-group">
							<label htmlFor="date">Event Date</label>
							<input
								type="date"
								id="date"
								name="date"
								value={formData.date}
								onChange={handleChange}
								min={new Date().toISOString().split("T")[0]}
								required
							/>
						</div>

						<div className="form-group">
							<label htmlFor="startTime">Start Time</label>
							<input
								type="time"
								id="startTime"
								name="startTime"
								value={formData.startTime}
								onChange={handleChange}
								required
							/>
						</div>

						<div className="form-group">
							<label htmlFor="endTime">End Time</label>
							<input
								type="time"
								id="endTime"
								name="endTime"
								value={formData.endTime}
								readOnly
								required
							/>
							<small>End time is calculated based on package duration</small>
						</div>

						<div className="form-group">
							<label htmlFor="location">Event Location</label>
							<input
								type="text"
								id="location"
								name="location"
								value={formData.location}
								onChange={handleChange}
								placeholder="Full address of the event"
								required
							/>
						</div>

						<div className="form-group">
							<label htmlFor="additionalNotes">Additional Notes</label>
							<textarea
								id="additionalNotes"
								name="additionalNotes"
								value={formData.additionalNotes}
								onChange={handleChange}
								placeholder="Any special requests or information"
								rows="4"></textarea>
						</div>

						<div className="booking-summary">
							<h3>Booking Summary</h3>
							<p>
								<strong>Package:</strong>{" "}
								{selectedPackage ? selectedPackage.name : "No package selected"}
							</p>
							<p>
								<strong>Duration:</strong>{" "}
								{selectedPackage ? `${selectedPackage.duration} hours` : "-"}
							</p>
							<p>
								<strong>Total:</strong>{" "}
								{selectedPackage ? `$${selectedPackage.price}` : "$0"}
							</p>
						</div>

						<button
							type="submit"
							className="btn book-btn"
							disabled={!selectedPackage}>
							Confirm Booking
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Booking;
