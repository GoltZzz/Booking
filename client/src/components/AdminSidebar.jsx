import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";
import {
	FiHome,
	FiUsers,
	FiCalendar,
	FiPackage,
	FiSettings,
	FiEye,
	FiLogOut,
	FiGrid,
} from "react-icons/fi";

const AdminSidebar = () => {
	const location = useLocation();
	const { user, logout } = useAuth();

	const isActive = (path) => {
		return location.pathname === path;
	};

	const handleViewSite = () => {
		window.location.href = "/";
	};

	const menuItems = [
		{ path: "/admin", icon: <FiGrid />, label: "Dashboard" },
		{ path: "/admin/users", icon: <FiUsers />, label: "User Management" },
		{ path: "/admin/bookings", icon: <FiCalendar />, label: "Bookings" },
		{ path: "/admin/packages", icon: <FiPackage />, label: "Packages" },
		{ path: "/admin/settings", icon: <FiSettings />, label: "Settings" },
	];

	return (
		<div className="w-64 bg-[#121212] border-r border-[#333333] h-screen flex flex-col">
			<div className="p-6 border-b border-[#333333]">
				<h2 className="text-xl font-bold text-[#e0e0e0] mb-4">Admin Panel</h2>
				<div className="flex items-center">
					<div className="w-10 h-10 rounded-full bg-[#bb86fc] bg-opacity-20 flex items-center justify-center mr-3">
						{user?.profilePicture ? (
							<img
								src={user.profilePicture}
								alt={user.name}
								className="w-full h-full rounded-full object-cover"
							/>
						) : (
							<span className="text-[#bb86fc] font-medium text-lg">
								{user?.name?.charAt(0) || "A"}
							</span>
						)}
					</div>
					<div>
						<p className="font-medium text-[#e0e0e0]">{user?.name}</p>
						<p className="text-sm text-gray-400">Administrator</p>
					</div>
				</div>
			</div>

			<nav className="flex-1 py-4">
				<ul className="space-y-1">
					{menuItems.map((item) => (
						<li key={item.path}>
							<Link
								to={item.path}
								className={`flex items-center px-6 py-3 text-sm ${
									isActive(item.path)
										? "bg-[#bb86fc] bg-opacity-10 text-[#bb86fc] border-l-2 border-[#bb86fc]"
										: "text-gray-400 hover:bg-[#1e1e1e]"
								} transition-colors`}>
								<span className="mr-3">{item.icon}</span>
								{item.label}
							</Link>
						</li>
					))}
				</ul>
			</nav>

			<div className="p-4 border-t border-[#333333] space-y-2">
				<Button
					variant="outline"
					size="small"
					fullWidth
					onClick={handleViewSite}
					icon={<FiEye />}>
					View Site
				</Button>
				<Button
					variant="danger"
					size="small"
					fullWidth
					onClick={logout}
					icon={<FiLogOut />}>
					Logout
				</Button>
			</div>
		</div>
	);
};

export default AdminSidebar;
