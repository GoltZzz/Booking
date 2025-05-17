import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { packageApi, bookingApi } from "../services/api";
import { useToast } from "../context/ToastContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import { FiCalendar, FiClock, FiMapPin, FiPackage } from "react-icons/fi";
import "../styles/Booking.css";

const Booking = () => {
	const [packages, setPackages] = useState([]);
	const [selectedPackage, setSelectedPackage] = useState(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [formData, setFormData] = useState({
		eventType: "",
		date: "",
		startTime: "",
		endTime: "",
		location: "",
		additionalNotes: "",
	});
	const [formErrors, setFormErrors] = useState({});
	const navigate = useNavigate();
	const { showToast } = useToast();

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
				showToast("Failed to load packages", "error");
			}
		};

		fetchPackages();
	}, [showToast]);

	const handlePackageSelect = (pkg) => {
		setSelectedPackage(pkg);
		// Clear any package selection error
		if (formErrors.package) {
			setFormErrors((prev) => ({ ...prev, package: null }));
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));

		// Clear error for the field being changed
		if (formErrors[name]) {
			setFormErrors((prev) => ({ ...prev, [name]: null }));
		}
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

	const validateForm = () => {
		const errors = {};

		if (!selectedPackage) {
			errors.package = "Please select a package";
		}

		if (!formData.eventType) {
			errors.eventType = "Event type is required";
		}

		if (!formData.date) {
			errors.date = "Event date is required";
		}

		if (!formData.startTime) {
			errors.startTime = "Start time is required";
		}

		if (!formData.location) {
			errors.location = "Event location is required";
		}

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setSubmitting(true);
		setError("");

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
			showToast("Booking confirmed successfully!", "success");
			navigate("/dashboard");
		} catch (err) {
			console.error("Error creating booking:", err);
			const errorMessage =
				err.response?.data?.message ||
				"Failed to create booking. Please try again.";
			setError(errorMessage);
			showToast(errorMessage, "error");
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen bg-[#121212] text-[#e0e0e0]">
				<LoadingSpinner size="large" text="Loading packages..." />
			</div>
		);
	}

	return (
		<div className="booking-page bg-[#121212] text-[#e0e0e0] min-h-screen py-8 px-4">
			<div className="container mx-auto max-w-6xl">
				<h1 className="text-3xl font-bold mb-6 text-center">
					Book a Photo Session
				</h1>

				{error && (
					<div className="mb-6">
						<ErrorMessage message={error} type="error" />
					</div>
				)}

				<div className="booking-container grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="package-selection lg:col-span-1">
						<h2 className="text-xl font-semibold mb-4">Select a Package</h2>
						<div className="package-options space-y-4">
							{packages.map((pkg) => (
								<div
									key={pkg._id}
									className={`package-option bg-[#1e1e1e] border ${
										selectedPackage?._id === pkg._id
											? "border-[#bb86fc]"
											: "border-[#333333]"
									} rounded-lg p-4 cursor-pointer transition-all hover:border-[#bb86fc] hover:transform hover:-translate-y-1`}
									onClick={() => handlePackageSelect(pkg)}
									role="radio"
									aria-checked={selectedPackage?._id === pkg._id}
									tabIndex={0}
									onKeyPress={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											handlePackageSelect(pkg);
										}
									}}>
									<h3 className="text-lg font-semibold">{pkg.name}</h3>
									<p className="text-[#bb86fc] text-xl font-bold mt-2">
										₱{pkg.price}
									</p>
									<p className="text-gray-400 flex items-center mt-1">
										<FiClock className="mr-1" /> {pkg.duration} hours
									</p>
									<ul className="features mt-3 space-y-1">
										{pkg.features.map((feature, index) => (
											<li
												key={index}
												className="text-sm text-gray-300 flex items-start">
												<span className="text-[#bb86fc] mr-2">✓</span> {feature}
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
						{formErrors.package && (
							<ErrorMessage
								message={formErrors.package}
								type="error"
								className="mt-2"
							/>
						)}
					</div>

					<div className="booking-form-container lg:col-span-2">
						<h2 className="text-xl font-semibold mb-4">Event Details</h2>
						<form
							onSubmit={handleSubmit}
							className="booking-form bg-[#1e1e1e] rounded-lg p-6 border border-[#333333]">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label
										htmlFor="eventType"
										className="block text-sm font-medium mb-1 text-gray-300">
										Event Type <span className="text-[#ff5252]">*</span>
									</label>
									<select
										id="eventType"
										name="eventType"
										value={formData.eventType}
										onChange={handleChange}
										required
										className={`w-full px-3 py-2 rounded-md bg-[#121212] border ${
											formErrors.eventType
												? "border-[#ff5252]"
												: "border-[#333333]"
										} focus:outline-none focus:ring-2 focus:ring-[#bb86fc] focus:ring-opacity-20`}
										aria-invalid={!!formErrors.eventType}
										aria-describedby={
											formErrors.eventType ? "eventType-error" : undefined
										}>
										<option value="">Select Event Type</option>
										<option value="Birthday">Birthday</option>
										<option value="Wedding pre-nup">Wedding pre-nup</option>
										<option value="Debut photoshoot">Debut photoshoot</option>
										<option value="Maternity">Maternity</option>
									</select>
									{formErrors.eventType && (
										<div
											id="eventType-error"
											className="text-[#ff5252] text-xs mt-1">
											{formErrors.eventType}
										</div>
									)}
								</div>

								<FormInput
									id="date"
									label="Event Date"
									type="date"
									name="date"
									value={formData.date}
									onChange={handleChange}
									min={new Date().toISOString().split("T")[0]}
									required
									error={formErrors.date}
									icon={<FiCalendar />}
								/>

								<FormInput
									id="startTime"
									label="Start Time"
									type="time"
									name="startTime"
									value={formData.startTime}
									onChange={handleChange}
									required
									error={formErrors.startTime}
									icon={<FiClock />}
								/>

								<FormInput
									id="endTime"
									label="End Time"
									type="time"
									name="endTime"
									value={formData.endTime}
									readOnly
									required
									disabled
									helperText="End time is calculated based on package duration"
								/>

								<FormInput
									id="location"
									label="Event Location"
									type="text"
									name="location"
									value={formData.location}
									onChange={handleChange}
									placeholder="Full address of the event"
									required
									error={formErrors.location}
									icon={<FiMapPin />}
									className="md:col-span-2"
								/>

								<div className="md:col-span-2">
									<label
										htmlFor="additionalNotes"
										className="block text-sm font-medium mb-1 text-gray-300">
										Additional Notes
									</label>
									<textarea
										id="additionalNotes"
										name="additionalNotes"
										value={formData.additionalNotes}
										onChange={handleChange}
										placeholder="Any special requests or information"
										rows="4"
										className="w-full px-3 py-2 rounded-md bg-[#121212] border border-[#333333] focus:outline-none focus:ring-2 focus:ring-[#bb86fc] focus:ring-opacity-20"></textarea>
								</div>
							</div>

							<div className="booking-summary mt-6 p-4 bg-[#121212] rounded-md border border-[#333333]">
								<h3 className="text-lg font-semibold mb-3 flex items-center">
									<FiPackage className="mr-2 text-[#bb86fc]" /> Booking Summary
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div>
										<p className="text-gray-400 text-sm">Package</p>
										<p className="font-semibold">
											{selectedPackage
												? selectedPackage.name
												: "No package selected"}
										</p>
									</div>
									<div>
										<p className="text-gray-400 text-sm">Duration</p>
										<p className="font-semibold">
											{selectedPackage
												? `${selectedPackage.duration} hours`
												: "-"}
										</p>
									</div>
									<div>
										<p className="text-gray-400 text-sm">Total</p>
										<p className="font-semibold text-[#bb86fc]">
											{selectedPackage ? `₱${selectedPackage.price}` : "₱0"}
										</p>
									</div>
								</div>
							</div>

							<div className="mt-6">
								<Button
									type="submit"
									variant="primary"
									size="large"
									fullWidth
									loading={submitting}
									disabled={!selectedPackage || submitting}>
									{submitting ? "Processing..." : "Confirm Booking"}
								</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Booking;
