import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserBookingList from "../components/UserBookingList";
import LogoutButton from "../components/LogoutButton";
import { FiHome } from "react-icons/fi";
import "../styles/Dashboard.css";

const Dashboard = () => {
	const { user, isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="min-h-screen flex justify-center items-center dashboard-gradient-bg">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen flex flex-col justify-center items-center p-4 dashboard-gradient-bg">
				<div className="dashboard-card p-8 rounded-xl max-w-md w-full">
					<h2 className="text-2xl font-bold mb-4 text-center welcome-text">
						Authentication Required
					</h2>
					<p className="mb-6 text-center text-gray-700 dark:text-gray-200">
						Please log in to view your dashboard.
					</p>
					<Link
						to="/login"
						className="action-button block w-full text-center bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium">
						Log In
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen dashboard-gradient-bg relative py-12">
			{/* Animated background shapes */}
			<div className="animated-shapes">
				<div className="shape"></div>
				<div className="shape"></div>
				<div className="shape"></div>
				<div className="shape"></div>
				<div className="shape"></div>
			</div>

			{/* Navigation bar */}
			<div className="fixed top-0 left-0 w-full bg-gray-900/60 backdrop-blur-md z-20 py-3 px-4">
				<div className="max-w-5xl mx-auto flex justify-between items-center">
					<Link
						to="/"
						className="flex items-center text-white hover:text-blue-400 transition-colors">
						<FiHome className="mr-2" size={20} />
						<span className="font-medium">Home</span>
					</Link>
					<LogoutButton className="text-white hover:text-red-400 transition-colors flex items-center" />
				</div>
			</div>

			{/* Content */}
			<div className="max-w-5xl mx-auto px-4 relative z-10 pt-12">
				<div className="dashboard-card rounded-xl shadow-xl p-6 mb-8">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
						<div>
							<h1 className="text-3xl font-extrabold mb-3 welcome-text tracking-tight">
								My Bookings
							</h1>
							<p className="text-lg text-gray-700 dark:text-gray-200">
								Welcome back,{" "}
								<span className="font-semibold">{user?.name || "User"}</span>
							</p>
						</div>
						<Link
							to="/booking"
							className="action-button mt-4 md:mt-0 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-2"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fillRule="evenodd"
									d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
									clipRule="evenodd"
								/>
							</svg>
							<span>New Booking</span>
						</Link>
					</div>

					<div className="relative">
						<UserBookingList />
					</div>
				</div>

				{/* Additional section for dashboard content */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div className="dashboard-card rounded-xl shadow-xl p-6">
						<h2 className="text-xl font-bold mb-5 tracking-tight section-title gradient-text-actions">
							Quick Actions
						</h2>
						<div className="space-y-4">
							<Link
								to="/profile"
								className="flex items-center p-3 rounded-lg hover:bg-gray-50/40 dark:hover:bg-gray-800/40 transition-colors">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-3 text-blue-600"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path
										fillRule="evenodd"
										d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
										clipRule="evenodd"
									/>
								</svg>
								<span className="font-medium gradient-text-blue">
									View Profile
								</span>
							</Link>
							<Link
								to="/booking"
								className="flex items-center p-3 rounded-lg hover:bg-gray-50/40 dark:hover:bg-gray-800/40 transition-colors">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-3 text-green-600"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path
										fillRule="evenodd"
										d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
										clipRule="evenodd"
									/>
								</svg>
								<span className="font-medium gradient-text-green">
									Schedule New Booking
								</span>
							</Link>
							<Link
								to="/help"
								className="flex items-center p-3 rounded-lg hover:bg-gray-50/40 dark:hover:bg-gray-800/40 transition-colors">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-3 text-purple-600"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path
										fillRule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
										clipRule="evenodd"
									/>
								</svg>
								<span className="font-medium gradient-text-purple">
									Get Help
								</span>
							</Link>
							<Link
								to="/"
								className="flex items-center p-3 rounded-lg hover:bg-gray-50/40 dark:hover:bg-gray-800/40 transition-colors">
								<FiHome className="h-5 w-5 mr-3 text-indigo-600" />
								<span className="font-medium gradient-text-indigo">
									Back to Home
								</span>
							</Link>
						</div>
					</div>

					<div className="dashboard-card rounded-xl shadow-xl p-6">
						<h2 className="text-xl font-bold mb-5 text-gray-800 dark:text-white tracking-tight">
							Photography Categories
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
								<h3 className="font-semibold text-blue-700 dark:text-blue-300 text-base">
									Birthday Photoshoot
								</h3>
								<p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
									Capture your special day
								</p>
							</div>
							<div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
								<h3 className="font-semibold text-purple-700 dark:text-purple-300 text-base">
									Wedding Pre-nup
								</h3>
								<p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
									Before the big day
								</p>
							</div>
							<div className="bg-pink-50 dark:bg-pink-900/30 p-4 rounded-lg">
								<h3 className="font-semibold text-pink-700 dark:text-pink-300 text-base">
									Debut Photoshoot
								</h3>
								<p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
									Celebrate coming of age
								</p>
							</div>
							<div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
								<h3 className="font-semibold text-green-700 dark:text-green-300 text-base">
									Maternity Photoshoot
								</h3>
								<p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
									Cherish the journey
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
