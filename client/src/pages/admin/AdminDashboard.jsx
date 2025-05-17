import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../services/api";
import AdminSidebar from "../../components/AdminSidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import Button from "../../components/Button";
import { useToast } from "../../context/ToastContext";
import {
	FiUsers,
	FiCalendar,
	FiClock,
	FiCheckCircle,
	FiAlertCircle,
	FiArrowRight,
	FiRefreshCw,
	FiActivity,
} from "react-icons/fi";

const AdminDashboard = () => {
	const [stats, setStats] = useState({
		userCount: 0,
		bookingCount: 0,
		pendingBookings: 0,
		confirmedBookings: 0,
	});
	const [recentBookings, setRecentBookings] = useState([]);
	const [recentUsers, setRecentUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { showToast } = useToast();

	const fetchDashboardData = async () => {
		try {
			setLoading(true);
			const response = await adminApi.getStats();
			setStats(response.data.stats);
			setRecentBookings(response.data.recentBookings);
			setRecentUsers(response.data.recentUsers);
			setError(null);
		} catch (err) {
			const errorMessage = "Failed to load dashboard data";
			setError(errorMessage);
			showToast(errorMessage, "error");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDashboardData();
	}, []);

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
							<FiActivity className="mr-2 text-[#bb86fc]" /> Admin Dashboard
						</h1>
						<Button
							variant="primary"
							size="small"
							onClick={fetchDashboardData}
							loading={loading}
							disabled={loading}
							icon={<FiRefreshCw />}>
							Refresh
						</Button>
					</div>

					{error && (
						<div className="mb-6">
							<ErrorMessage message={error} type="error" />
						</div>
					)}

					{loading ? (
						<div className="flex justify-center items-center py-12">
							<LoadingSpinner size="large" text="Loading dashboard data..." />
						</div>
					) : (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
								<div className="bg-[#252525] rounded-lg p-5 border border-[#333333] hover:border-[#bb86fc] transition-colors">
									<div className="flex items-start justify-between">
										<div>
											<p className="text-gray-400 text-sm">Total Users</p>
											<h3 className="text-3xl font-bold text-[#e0e0e0] mt-1">
												{stats.userCount}
											</h3>
										</div>
										<div className="bg-[#bb86fc] bg-opacity-20 p-3 rounded-full">
											<FiUsers className="text-[#bb86fc] text-xl" />
										</div>
									</div>
									<Link
										to="/admin/users"
										className="text-[#bb86fc] text-sm flex items-center mt-4 hover:underline">
										View All Users <FiArrowRight className="ml-1" size={14} />
									</Link>
								</div>

								<div className="bg-[#252525] rounded-lg p-5 border border-[#333333] hover:border-[#bb86fc] transition-colors">
									<div className="flex items-start justify-between">
										<div>
											<p className="text-gray-400 text-sm">Total Bookings</p>
											<h3 className="text-3xl font-bold text-[#e0e0e0] mt-1">
												{stats.bookingCount}
											</h3>
										</div>
										<div className="bg-[#bb86fc] bg-opacity-20 p-3 rounded-full">
											<FiCalendar className="text-[#bb86fc] text-xl" />
										</div>
									</div>
									<Link
										to="/admin/bookings"
										className="text-[#bb86fc] text-sm flex items-center mt-4 hover:underline">
										View All Bookings{" "}
										<FiArrowRight className="ml-1" size={14} />
									</Link>
								</div>

								<div className="bg-[#252525] rounded-lg p-5 border border-[#333333] hover:border-[#bb86fc] transition-colors">
									<div className="flex items-start justify-between">
										<div>
											<p className="text-gray-400 text-sm">Pending Bookings</p>
											<h3 className="text-3xl font-bold text-[#e0e0e0] mt-1">
												{stats.pendingBookings}
											</h3>
										</div>
										<div className="bg-yellow-500 bg-opacity-20 p-3 rounded-full">
											<FiClock className="text-yellow-500 text-xl" />
										</div>
									</div>
									<Link
										to="/admin/bookings"
										className="text-[#bb86fc] text-sm flex items-center mt-4 hover:underline">
										View Pending <FiArrowRight className="ml-1" size={14} />
									</Link>
								</div>

								<div className="bg-[#252525] rounded-lg p-5 border border-[#333333] hover:border-[#bb86fc] transition-colors">
									<div className="flex items-start justify-between">
										<div>
											<p className="text-gray-400 text-sm">
												Confirmed Bookings
											</p>
											<h3 className="text-3xl font-bold text-[#e0e0e0] mt-1">
												{stats.confirmedBookings}
											</h3>
										</div>
										<div className="bg-green-500 bg-opacity-20 p-3 rounded-full">
											<FiCheckCircle className="text-green-500 text-xl" />
										</div>
									</div>
									<Link
										to="/admin/bookings"
										className="text-[#bb86fc] text-sm flex items-center mt-4 hover:underline">
										View Confirmed <FiArrowRight className="ml-1" size={14} />
									</Link>
								</div>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<div className="bg-[#252525] rounded-lg p-5 border border-[#333333]">
									<h2 className="text-xl font-semibold text-[#e0e0e0] mb-4 flex items-center">
										<FiCalendar className="mr-2 text-[#bb86fc]" /> Recent
										Bookings
									</h2>

									{recentBookings.length > 0 ? (
										<div className="overflow-x-auto">
											<table className="w-full">
												<thead>
													<tr className="border-b border-[#333333]">
														<th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
															Date
														</th>
														<th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
															User
														</th>
														<th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
															Status
														</th>
														<th className="text-right py-3 px-2 text-sm font-medium text-gray-400">
															Actions
														</th>
													</tr>
												</thead>
												<tbody>
													{recentBookings.map((booking) => (
														<tr
															key={booking._id}
															className="border-b border-[#333333] hover:bg-[#2d2d2d]">
															<td className="py-3 px-2 text-[#e0e0e0]">
																{new Date(booking.date).toLocaleDateString()}
															</td>
															<td className="py-3 px-2 text-[#e0e0e0]">
																{booking.user?.name || "Unknown"}
															</td>
															<td className="py-3 px-2">
																<span
																	className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
																		booking.status
																	)}`}>
																	{booking.status}
																</span>
															</td>
															<td className="py-3 px-2 text-right">
																<Button
																	variant="text"
																	size="small"
																	to={`/admin/bookings`}
																	ariaLabel={`View booking details`}>
																	View
																</Button>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									) : (
										<div className="text-center py-6 text-gray-400">
											<FiAlertCircle className="mx-auto mb-2 text-2xl" />
											<p>No recent bookings found.</p>
										</div>
									)}

									<div className="mt-4 text-right">
										<Button
											variant="outline"
											size="small"
											to="/admin/bookings"
											icon={<FiArrowRight />}
											iconPosition="right">
											View All Bookings
										</Button>
									</div>
								</div>

								<div className="bg-[#252525] rounded-lg p-5 border border-[#333333]">
									<h2 className="text-xl font-semibold text-[#e0e0e0] mb-4 flex items-center">
										<FiUsers className="mr-2 text-[#bb86fc]" /> Recent Users
									</h2>

									{recentUsers.length > 0 ? (
										<div className="overflow-x-auto">
											<table className="w-full">
												<thead>
													<tr className="border-b border-[#333333]">
														<th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
															Name
														</th>
														<th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
															Email
														</th>
														<th className="text-left py-3 px-2 text-sm font-medium text-gray-400">
															Joined
														</th>
														<th className="text-right py-3 px-2 text-sm font-medium text-gray-400">
															Actions
														</th>
													</tr>
												</thead>
												<tbody>
													{recentUsers.map((user) => (
														<tr
															key={user._id}
															className="border-b border-[#333333] hover:bg-[#2d2d2d]">
															<td className="py-3 px-2 text-[#e0e0e0]">
																{user.name}
															</td>
															<td className="py-3 px-2 text-[#e0e0e0]">
																{user.email}
															</td>
															<td className="py-3 px-2 text-[#e0e0e0]">
																{new Date(user.createdAt).toLocaleDateString()}
															</td>
															<td className="py-3 px-2 text-right">
																<Button
																	variant="text"
																	size="small"
																	to="/admin/users"
																	ariaLabel={`View user details`}>
																	View
																</Button>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									) : (
										<div className="text-center py-6 text-gray-400">
											<FiAlertCircle className="mx-auto mb-2 text-2xl" />
											<p>No recent users found.</p>
										</div>
									)}

									<div className="mt-4 text-right">
										<Button
											variant="outline"
											size="small"
											to="/admin/users"
											icon={<FiArrowRight />}
											iconPosition="right">
											View All Users
										</Button>
									</div>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
