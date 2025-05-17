import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminSidebar = () => {
	const location = useLocation();
	const { user, logout } = useAuth();

	const isActive = (path) => {
		return location.pathname === path ? "active" : "";
	};

	const handleViewSite = () => {
		window.location.href = "/";
	};

	return (
		<div className="admin-sidebar">
			<div className="sidebar-header">
				<h2>Admin Panel</h2>
				<div className="admin-profile">
					<div className="admin-avatar">
						{user?.profilePicture ? (
							<img src={user.profilePicture} alt={user.name} />
						) : (
							<div className="avatar-placeholder">
								{user?.name?.charAt(0) || "A"}
							</div>
						)}
					</div>
					<div className="admin-info">
						<p className="admin-name">{user?.name}</p>
						<p className="admin-role">Administrator</p>
					</div>
				</div>
			</div>

			<nav className="sidebar-nav">
				<ul>
					<li className={isActive("/admin")}>
						<Link to="/admin">
							<i className="fas fa-tachometer-alt"></i>
							Dashboard
						</Link>
					</li>
					<li className={isActive("/admin/users")}>
						<Link to="/admin/users">
							<i className="fas fa-users"></i>
							User Management
						</Link>
					</li>
					<li className={isActive("/admin/bookings")}>
						<Link to="/admin/bookings">
							<i className="fas fa-calendar-check"></i>
							Bookings
						</Link>
					</li>
					<li className={isActive("/admin/packages")}>
						<Link to="/admin/packages">
							<i className="fas fa-box"></i>
							Packages
						</Link>
					</li>
					<li className={isActive("/admin/settings")}>
						<Link to="/admin/settings">
							<i className="fas fa-cog"></i>
							Settings
						</Link>
					</li>
				</ul>
			</nav>

			<div className="sidebar-footer">
				<button onClick={handleViewSite} className="view-site-btn">
					<i className="fas fa-eye"></i>
					View Site
				</button>
				<button onClick={logout} className="logout-btn">
					<i className="fas fa-sign-out-alt"></i>
					Logout
				</button>
			</div>
		</div>
	);
};

export default AdminSidebar;
