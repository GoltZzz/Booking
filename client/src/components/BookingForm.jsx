import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

const BookingForm = () => {
	const [formData, setFormData] = useState({
		eventType: "",
		eventDate: "",
		specialRequest: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const toast = useToast();

	const photographyCategories = [
		"Birthday Photoshoot",
		"Wedding Pre-nup Photography",
		"Debut Photoshoot",
		"Maternity Photoshoot",
	];

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			await api.createBooking(formData);
			toast.success("Booking submitted successfully!");
			navigate("/dashboard"); // Redirect to dashboard after successful booking
		} catch (err) {
			console.error("Booking failed:", err);
			setError(
				err.response?.data?.error ||
					"Failed to create booking. Please try again."
			);
			toast.error("Booking failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto">
			{error && (
				<div
					className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
					role="alert">
					<p>{error}</p>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="transition-all duration-300 hover:transform hover:scale-[1.02]">
					<label
						htmlFor="eventType"
						className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Photography Package
					</label>
					<select
						id="eventType"
						name="eventType"
						value={formData.eventType}
						onChange={handleChange}
						className="input-field w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white shadow-sm transition-all duration-300"
						required>
						<option value="" disabled>
							Select a photography package
						</option>
						{photographyCategories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
				</div>

				<div className="transition-all duration-300 hover:transform hover:scale-[1.02]">
					<label
						htmlFor="eventDate"
						className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Event Date
					</label>
					<input
						type="date"
						id="eventDate"
						name="eventDate"
						value={formData.eventDate}
						onChange={handleChange}
						className="input-field w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white shadow-sm transition-all duration-300"
						required
						min={new Date().toISOString().split("T")[0]} // Prevent selecting dates in the past
					/>
				</div>

				<div className="transition-all duration-300 hover:transform hover:scale-[1.02]">
					<label
						htmlFor="specialRequest"
						className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Special Request (Optional)
					</label>
					<textarea
						id="specialRequest"
						name="specialRequest"
						value={formData.specialRequest}
						onChange={handleChange}
						className="input-field w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white shadow-sm transition-all duration-300"
						rows="4"
						placeholder="Tell us about any specific requirements for your photo session..."
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					className={`submit-button w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md font-medium text-base transition-all duration-300 ${
						loading ? "opacity-70 cursor-not-allowed" : ""
					}`}>
					{loading ? (
						<div className="flex items-center justify-center">
							<svg
								className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24">
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Processing...
						</div>
					) : (
						"Book Your Session"
					)}
				</button>
			</form>
		</div>
	);
};

export default BookingForm;
