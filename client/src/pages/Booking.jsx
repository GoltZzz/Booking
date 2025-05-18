import { useAuth } from "../context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import { useState, useEffect } from "react";
import "../styles/Booking.css";

// Import the background images
import birthdayImg from "../assets/images/birthday.jpg";
import weddingImg from "../assets/images/wedding pre-nup.jpg";
import debutImg from "../assets/images/debut.jpg";
import maternityImg from "../assets/images/maternity.jpg";

const BookingPage = () => {
	const { isAuthenticated, isLoading } = useAuth();
	const [currentBgIndex, setCurrentBgIndex] = useState(0);

	const backgroundImages = [
		{
			src: birthdayImg,
			alt: "Birthday Photoshoot",
			label: "Birthday Photoshoot",
		},
		{
			src: weddingImg,
			alt: "Wedding Pre-nup Photography",
			label: "Wedding Pre-nup Photography",
		},
		{ src: debutImg, alt: "Debut Photoshoot", label: "Debut Photoshoot" },
		{
			src: maternityImg,
			alt: "Maternity Photoshoot",
			label: "Maternity Photoshoot",
		},
	];

	// Change background image every 5 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentBgIndex(
				(prevIndex) => (prevIndex + 1) % backgroundImages.length
			);
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	if (isLoading) {
		return (
			<div className="min-h-screen flex justify-center items-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return (
		<div className="min-h-screen relative">
			{/* Background image with gradient overlay */}
			<div className="background-slideshow">
				{backgroundImages.map((img, index) => (
					<div
						key={index}
						className="background-slide"
						style={{
							backgroundImage: `url(${img.src})`,
							opacity: index === currentBgIndex ? 1 : 0,
						}}>
						<div className="absolute inset-0 bg-black bg-opacity-60"></div>
					</div>
				))}
			</div>

			{/* Content overlay */}
			<div className="relative z-10 min-h-screen py-12 px-4">
				<div className="max-w-4xl mx-auto">
					<div className="mb-6">
						<Link
							to="/dashboard"
							className="text-white hover:underline flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
							Back to Dashboard
						</Link>
					</div>

					<div className="booking-form-container bg-white bg-opacity-95 dark:bg-gray-800 dark:bg-opacity-95 rounded-lg shadow-xl p-6 backdrop-filter backdrop-blur-sm">
						<h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
							Book Your Photography Session
						</h1>

						{/* Category labels */}
						<div className="flex justify-center mb-8 space-x-2 flex-wrap">
							{backgroundImages.map((img, index) => (
								<div
									key={index}
									className={`category-badge px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 ${
										index === currentBgIndex
											? "bg-blue-600 text-white active-category"
											: "bg-gray-200 text-gray-700 hover:bg-gray-300"
									}`}
									onClick={() => setCurrentBgIndex(index)}>
									{img.label}
								</div>
							))}
						</div>

						<BookingForm />
					</div>
				</div>
			</div>
		</div>
	);
};

export default BookingPage;
