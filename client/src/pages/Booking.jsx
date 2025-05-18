import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { packageApi, bookingApi } from "../services/api";
import { useToast } from "../context/ToastContext";
import LoadingSpinner from "../components/LoadingSpinner";
import SkeletonLoader from "../components/SkeletonLoader";
import LoadingOverlay from "../components/LoadingOverlay";
import ErrorMessage from "../components/ErrorMessage";
import ErrorBoundary from "../components/ErrorBoundary";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import {
	FiCalendar,
	FiClock,
	FiMapPin,
	FiPackage,
	FiRefreshCw,
	FiAlertTriangle,
} from "react-icons/fi";
import { useApiCall, getErrorMessage } from "../services/apiUtils";
import "../styles/Booking.css";

const Booking = () => {
	const [packages, setPackages] = useState([]);
	const [selectedPackage, setSelectedPackage] = useState(null);
	const [loadingPackages, setLoadingPackages] = useState(true);
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
	const toast = useToast();

	// Use the new API call hook for submission
	const [
		submitBooking,
		bookingResult,
		submitting,
		submissionError,
		resetSubmission,
	] = useApiCall(bookingApi.createBooking, {
		errorMessage:
			"Failed to create booking. Please check your information and try again.",
		showSuccessToast: true,
		successMessage: "Booking confirmed successfully!",
	});

	const fetchPackages = async () => {
		setLoadingPackages(true);
		setError("");

		try {
			const response = await packageApi.getPackages();
			setPackages(response.data);
			setError("");
		} catch (err) {
			console.error("Error fetching packages:", err);
			setError(
				getErrorMessage(err) || "Failed to load packages. Please try again."
			);
			toast.error("Failed to load packages", "error");
		} finally {
			setLoadingPackages(false);
		}
	};

	useEffect(() => {
		fetchPackages();
	}, []);

	// If booking was successful, navigate to dashboard
	useEffect(() => {
		if (bookingResult) {
			setTimeout(() => {
				navigate("/dashboard");
			}, 1500);
		}
	}, [bookingResult, navigate]);

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

		// Reset any previous submission errors
		resetSubmission();

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

		// Use the API call hook to handle submission with proper error handling
		await submitBooking(bookingData);
	};

	// Render the package options with skeleton loaders during loading
	const renderPackageOptions = () => {
		if (loadingPackages) {
			return Array(3)
				.fill(0)
				.map((_, index) => (
					<div key={index} className="mb-4">
						<SkeletonLoader type="card" height="250px" />
					</div>
				));
		}

		if (packages.length === 0 && !error) {
			return (
				<div className="text-center p-8 bg-[#1e1e1e] rounded-lg border border-[#333333]">
					<FiPackage size={48} className="mx-auto mb-4 text-gray-500" />
					<p className="text-gray-400">No packages available at the moment.</p>
				</div>
			);
		}

		return packages.map((pkg) => (
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
				<p className="text-[#bb86fc] text-xl font-bold mt-2">₱{pkg.price}</p>
				<p className="text-gray-400 flex items-center mt-1">
					<FiClock className="mr-1" /> {pkg.duration} hours
				</p>
				<ul className="features mt-3 space-y-1">
					{pkg.features.map((feature, index) => (
						<li key={index} className="text-sm text-gray-300 flex items-start">
							<span className="text-[#bb86fc] mr-2">✓</span> {feature}
						</li>
					))}
				</ul>
			</div>
		));
	};

	// Render error state with retry option
	const renderError = () => {
		if (!error) return null;

		return (
			<div className="bg-[#1e1e1e] rounded-lg p-6 border border-[#333333] mb-6">
				<div className="flex items-center text-[#ff5252] mb-3">
					<FiAlertTriangle size={24} className="mr-2" />
					<h3 className="text-lg font-semibold">Error Loading Packages</h3>
				</div>
				<p className="text-gray-300 mb-4">{error}</p>
				<Button
					onClick={fetchPackages}
					variant="primary"
					size="small"
					icon={<FiRefreshCw />}>
					Try Again
				</Button>
			</div>
		);
	};

	return (
		<ErrorBoundary>
			<LoadingOverlay
				isLoading={submitting}
				message="Submitting your booking..."
				spinnerSize="large"
				fullPage
				blur
				transparent>
				<div className="booking-page bg-[#121212] text-[#e0e0e0] min-h-screen py-8 px-4">
					<div className="container mx-auto max-w-6xl">
						<h1 className="text-3xl font-bold mb-6 text-center">
							Book a Photo Session
						</h1>

						{renderError()}
						{submissionError && (
							<ErrorMessage
								message={submissionError}
								type="error"
								className="mb-6"
								dismissable
								onDismiss={resetSubmission}
							/>
						)}

						<div className="booking-container grid grid-cols-1 lg:grid-cols-3 gap-8">
							<div className="package-selection lg:col-span-1">
								<h2 className="text-xl font-semibold mb-4">Select a Package</h2>
								<div className="package-options space-y-4">
									{renderPackageOptions()}
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
												disabled={submitting}
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
												<option value="Debut photoshoot">
													Debut photoshoot
												</option>
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

										<div>
											<label
												htmlFor="date"
												className="block text-sm font-medium mb-1 text-gray-300">
												Event Date <span className="text-[#ff5252]">*</span>
											</label>
											<div className="relative">
												<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
													<FiCalendar />
												</span>
												<input
													type="date"
													id="date"
													name="date"
													value={formData.date}
													onChange={handleChange}
													required
													disabled={submitting}
													min={new Date().toISOString().split("T")[0]}
													className={`w-full px-3 py-2 pl-10 rounded-md bg-[#121212] border ${
														formErrors.date
															? "border-[#ff5252]"
															: "border-[#333333]"
													} focus:outline-none focus:ring-2 focus:ring-[#bb86fc] focus:ring-opacity-20`}
													aria-invalid={!!formErrors.date}
													aria-describedby={
														formErrors.date ? "date-error" : undefined
													}
												/>
											</div>
											{formErrors.date && (
												<div
													id="date-error"
													className="text-[#ff5252] text-xs mt-1">
													{formErrors.date}
												</div>
											)}
										</div>

										<div>
											<label
												htmlFor="startTime"
												className="block text-sm font-medium mb-1 text-gray-300">
												Start Time <span className="text-[#ff5252]">*</span>
											</label>
											<div className="relative">
												<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
													<FiClock />
												</span>
												<input
													type="time"
													id="startTime"
													name="startTime"
													value={formData.startTime}
													onChange={handleChange}
													required
													disabled={submitting}
													className={`w-full px-3 py-2 pl-10 rounded-md bg-[#121212] border ${
														formErrors.startTime
															? "border-[#ff5252]"
															: "border-[#333333]"
													} focus:outline-none focus:ring-2 focus:ring-[#bb86fc] focus:ring-opacity-20`}
													aria-invalid={!!formErrors.startTime}
													aria-describedby={
														formErrors.startTime ? "startTime-error" : undefined
													}
												/>
											</div>
											{formErrors.startTime && (
												<div
													id="startTime-error"
													className="text-[#ff5252] text-xs mt-1">
													{formErrors.startTime}
												</div>
											)}
										</div>

										<div>
											<label
												htmlFor="endTime"
												className="block text-sm font-medium mb-1 text-gray-300">
												End Time
											</label>
											<div className="relative">
												<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
													<FiClock />
												</span>
												<input
													type="time"
													id="endTime"
													name="endTime"
													value={formData.endTime}
													readOnly
													disabled
													className="w-full px-3 py-2 pl-10 rounded-md bg-[#1a1a1a] border border-[#333333] cursor-not-allowed"
												/>
											</div>
											<p className="text-gray-500 text-xs mt-1">
												Auto-calculated based on package duration
											</p>
										</div>

										<div className="md:col-span-2">
											<label
												htmlFor="location"
												className="block text-sm font-medium mb-1 text-gray-300">
												Event Location <span className="text-[#ff5252]">*</span>
											</label>
											<div className="relative">
												<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
													<FiMapPin />
												</span>
												<input
													type="text"
													id="location"
													name="location"
													value={formData.location}
													onChange={handleChange}
													required
													disabled={submitting}
													placeholder="Enter the full event location address"
													className={`w-full px-3 py-2 pl-10 rounded-md bg-[#121212] border ${
														formErrors.location
															? "border-[#ff5252]"
															: "border-[#333333]"
													} focus:outline-none focus:ring-2 focus:ring-[#bb86fc] focus:ring-opacity-20`}
													aria-invalid={!!formErrors.location}
													aria-describedby={
														formErrors.location ? "location-error" : undefined
													}
												/>
											</div>
											{formErrors.location && (
												<div
													id="location-error"
													className="text-[#ff5252] text-xs mt-1">
													{formErrors.location}
												</div>
											)}
										</div>

										<div className="md:col-span-2">
											<label
												htmlFor="additionalNotes"
												className="block text-sm font-medium mb-1 text-gray-300">
												Special Requests (Optional)
											</label>
											<textarea
												id="additionalNotes"
												name="additionalNotes"
												value={formData.additionalNotes}
												onChange={handleChange}
												disabled={submitting}
												placeholder="Any special requests or additional information..."
												rows="4"
												className="w-full px-3 py-2 rounded-md bg-[#121212] border border-[#333333] focus:outline-none focus:ring-2 focus:ring-[#bb86fc] focus:ring-opacity-20"
											/>
										</div>
									</div>

									<div className="mt-6 flex justify-end">
										<Button
											type="submit"
											loading={submitting}
											disabled={submitting || loadingPackages}
											className="w-full md:w-auto">
											{submitting ? "Processing..." : "Confirm Booking"}
										</Button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</LoadingOverlay>
		</ErrorBoundary>
	);
};

export default Booking;
