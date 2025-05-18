import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../services/api";
import AdminSidebar from "../../components/AdminSidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import Button from "../../components/Button";
import SkeletonLoader from "../../components/SkeletonLoader";
import ErrorBoundary from "../../components/ErrorBoundary";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useApiCall } from "../../services/apiUtils";
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

const StatCard = ({ title, value, icon, color, linkTo, linkText }) => (
	<div className="bg-[#252525] rounded-lg p-5 border border-[#333333] hover:border-[#bb86fc] transition-colors">
		<div className="flex items-start justify-between">
			<div>
				<p className="text-gray-400 text-sm">{title}</p>
				<h3 className="text-3xl font-bold text-[#e0e0e0] mt-1">{value}</h3>
			</div>
			<div className={`bg-${color}-500 bg-opacity-20 p-3 rounded-full`}>
				{icon}
			</div>
		</div>
		<Link
			to={linkTo}
			className="text-[#bb86fc] text-sm flex items-center mt-4 hover:underline">
			{linkText} <FiArrowRight className="ml-1" size={14} />
		</Link>
	</div>
);

const StatCardSkeleton = () => (
	<div className="bg-[#252525] rounded-lg p-5 border border-[#333333]">
		<div className="flex items-start justify-between">
			<div className="w-full">
				<SkeletonLoader type="text" width="40%" className="mb-2" />
				<SkeletonLoader type="text" height="2rem" className="mb-2" />
			</div>
			<SkeletonLoader
				type="custom"
				width="40px"
				height="40px"
				className="rounded-full"
			/>
		</div>
		<SkeletonLoader type="text" width="40%" className="mt-4" />
	</div>
);

const AdminDashboard = () => {
	const [stats, setStats] = useState({
		userCount: 0,
		bookingCount: 0,
		pendingBookings: 0,
		confirmedBookings: 0,
	});
	const [recentBookings, setRecentBookings] = useState([]);
	const [recentUsers, setRecentUsers] = useState([]);

	// Use the API call hook
	const [fetchDashboardData, dashboardData, loading, error, resetFetchState] =
		useApiCall(
			async () => {
				const response = await adminApi.getStats();
				return response.data;
			},
			{
				errorMessage: "Failed to load dashboard data",
				onError: (err) => console.error(err),
			}
		);

	// Update state when data is received
	useEffect(() => {
		if (dashboardData) {
			setStats(dashboardData.stats);
			setRecentBookings(dashboardData.recentBookings);
			setRecentUsers(dashboardData.recentUsers);
		}
	}, [dashboardData]);

	// Initial data fetch
	useEffect(() => {
		fetchDashboardData();
	}, [fetchDashboardData]);

	const handleRetry = useCallback(() => {
		resetFetchState();
		fetchDashboardData();
	}, [resetFetchState, fetchDashboardData]);

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
				<ErrorBoundary
					message="Dashboard Error"
					description="We couldn't load your dashboard data."
					resetButtonText="Reload Dashboard"
					onReset={handleRetry}>
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
								<ErrorMessage
									message={error}
									type="error"
									action={{
										label: "Try Again",
										onClick: handleRetry,
										icon: <FiRefreshCw size={14} />,
									}}
								/>
							</div>
						)}

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
							{loading ? (
								<>
									<StatCardSkeleton />
									<StatCardSkeleton />
									<StatCardSkeleton />
									<StatCardSkeleton />
								</>
							) : (
								<>
									<StatCard
										title="Total Users"
										value={stats.userCount}
										icon={<FiUsers className="text-[#bb86fc] text-xl" />}
										color="purple"
										linkTo="/admin/users"
										linkText="View All Users"
									/>

									<StatCard
										title="Total Bookings"
										value={stats.bookingCount}
										icon={<FiCalendar className="text-[#bb86fc] text-xl" />}
										color="purple"
										linkTo="/admin/bookings"
										linkText="View All Bookings"
									/>

									<StatCard
										title="Pending Bookings"
										value={stats.pendingBookings}
										icon={<FiClock className="text-yellow-500 text-xl" />}
										color="yellow"
										linkTo="/admin/bookings"
										linkText="View Pending"
									/>

									<StatCard
										title="Confirmed Bookings"
										value={stats.confirmedBookings}
										icon={<FiCheckCircle className="text-green-500 text-xl" />}
										color="green"
										linkTo="/admin/bookings"
										linkText="View Confirmed"
									/>
								</>
							)}
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<div className="bg-[#252525] rounded-lg p-5 border border-[#333333]">
								<h2 className="text-xl font-semibold text-[#e0e0e0] mb-4 flex items-center">
									<FiCalendar className="mr-2 text-[#bb86fc]" /> Recent Bookings
								</h2>

								{loading ? (
									<SkeletonLoader type="table" lines={5} className="w-full" />
								) : recentBookings.length > 0 ? (
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
															{booking.user?.name || "Unknown User"}
														</td>
														<td className="py-3 px-2">
															<span
																className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
																	booking.status
																)}`}>
																{booking.status.charAt(0).toUpperCase() +
																	booking.status.slice(1)}
															</span>
														</td>
														<td className="py-3 px-2 text-right">
															<Button
																variant="text"
																size="small"
																to={`/admin/bookings/${booking._id}`}
																ariaLabel={`View booking details for ${booking._id}`}>
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

								{loading ? (
									<SkeletonLoader type="table" lines={5} className="w-full" />
								) : recentUsers.length > 0 ? (
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
																to={`/admin/users/${user._id}`}
																ariaLabel={`View user details for ${user.name}`}>
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
					</div>
				</ErrorBoundary>
			</div>
		</div>
	);
};

export default AdminDashboard;
