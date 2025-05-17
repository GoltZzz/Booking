import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../services/api";
import AdminSidebar from "../../components/AdminSidebar";
import "../../styles/admin.css";

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

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				setLoading(true);
				const response = await adminApi.getStats();
				setStats(response.data.stats);
				setRecentBookings(response.data.recentBookings);
				setRecentUsers(response.data.recentUsers);
			} catch (err) {
				setError("Failed to load dashboard data");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	if (loading) {
		return (
			<div className="admin-layout">
				<AdminSidebar />
				<div className="admin-content">
					<h1>Dashboard</h1>
					<div className="loading">Loading dashboard data...</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="admin-layout">
				<AdminSidebar />
				<div className="admin-content">
					<h1>Dashboard</h1>
					<div className="error">{error}</div>
				</div>
			</div>
		);
	}

	return (
		<div className="admin-layout">
			<AdminSidebar />
			<div className="admin-content">
				<h1>Admin Dashboard</h1>

				<div className="stats-cards">
					<div className="stat-card">
						<h3>Total Users</h3>
						<p className="stat-value">{stats.userCount}</p>
						<Link to="/admin/users">View All</Link>
					</div>

					<div className="stat-card">
						<h3>Total Bookings</h3>
						<p className="stat-value">{stats.bookingCount}</p>
						<Link to="/admin/bookings">View All</Link>
					</div>

					<div className="stat-card">
						<h3>Pending Bookings</h3>
						<p className="stat-value">{stats.pendingBookings}</p>
					</div>

					<div className="stat-card">
						<h3>Confirmed Bookings</h3>
						<p className="stat-value">{stats.confirmedBookings}</p>
					</div>
				</div>

				<div className="dashboard-sections">
					<div className="recent-section">
						<h2>Recent Bookings</h2>
						{recentBookings.length > 0 ? (
							<div className="table-container">
								<table className="admin-table">
									<thead>
										<tr>
											<th>Date</th>
											<th>User</th>
											<th>Status</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{recentBookings.map((booking) => (
											<tr key={booking._id}>
												<td>{new Date(booking.date).toLocaleDateString()}</td>
												<td>{booking.user?.name || "Unknown"}</td>
												<td>
													<span className={`status-badge ${booking.status}`}>
														{booking.status}
													</span>
												</td>
												<td>
													<Link to={`/admin/bookings/${booking._id}`}>
														View
													</Link>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<p>No recent bookings found.</p>
						)}
						<Link to="/admin/bookings" className="view-all-link">
							View All Bookings
						</Link>
					</div>

					<div className="recent-section">
						<h2>Recent Users</h2>
						{recentUsers.length > 0 ? (
							<div className="table-container">
								<table className="admin-table">
									<thead>
										<tr>
											<th>Name</th>
											<th>Email</th>
											<th>Joined</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{recentUsers.map((user) => (
											<tr key={user._id}>
												<td>{user.name}</td>
												<td>{user.email}</td>
												<td>{new Date(user.createdAt).toLocaleDateString()}</td>
												<td>
													<Link to={`/admin/users/${user._id}`}>View</Link>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<p>No recent users found.</p>
						)}
						<Link to="/admin/users" className="view-all-link">
							View All Users
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
