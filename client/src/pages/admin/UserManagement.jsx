import { useState, useEffect } from "react";
import { adminApi } from "../../services/api";
import AdminSidebar from "../../components/AdminSidebar";

const UserManagement = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [editingUser, setEditingUser] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		isAdmin: false,
	});
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const response = await adminApi.getUsers();
			setUsers(response.data);
		} catch (err) {
			setError("Failed to load users");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleEditClick = (user) => {
		setEditingUser(user);
		setFormData({
			name: user.name,
			email: user.email,
			phone: user.phone || "",
			isAdmin: user.isAdmin || false,
		});
	};

	const handleCancelEdit = () => {
		setEditingUser(null);
		setFormData({
			name: "",
			email: "",
			phone: "",
			isAdmin: false,
		});
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await adminApi.updateUser(editingUser._id, formData);
			setEditingUser(null);
			fetchUsers(); // Refresh the user list
		} catch (err) {
			setError("Failed to update user");
			console.error(err);
		}
	};

	const handleDeleteUser = async (userId) => {
		if (!window.confirm("Are you sure you want to delete this user?")) {
			return;
		}

		try {
			await adminApi.deleteUser(userId);
			fetchUsers(); // Refresh the user list
		} catch (err) {
			setError("Failed to delete user");
			console.error(err);
		}
	};

	const filteredUsers = users.filter(
		(user) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (loading && users.length === 0) {
		return (
			<div className="admin-layout">
				<AdminSidebar />
				<div className="admin-content">
					<h1>User Management</h1>
					<div className="loading">Loading users...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="admin-layout">
			<AdminSidebar />
			<div className="admin-content">
				<h1>User Management</h1>

				{error && <div className="error-message">{error}</div>}

				<div className="admin-actions">
					<div className="search-box">
						<input
							type="text"
							placeholder="Search users..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>

				<div className="table-container">
					<table className="admin-table">
						<thead>
							<tr>
								<th>Name</th>
								<th>Email</th>
								<th>Phone</th>
								<th>Auth Method</th>
								<th>Admin</th>
								<th>Joined</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredUsers.map((user) => (
								<tr key={user._id}>
									<td>{user.name}</td>
									<td>{user.email}</td>
									<td>{user.phone || "-"}</td>
									<td>{user.authMethod}</td>
									<td>{user.isAdmin ? "Yes" : "No"}</td>
									<td>{new Date(user.createdAt).toLocaleDateString()}</td>
									<td>
										<button
											className="action-btn edit"
											onClick={() => handleEditClick(user)}>
											Edit
										</button>
										<button
											className="action-btn delete"
											onClick={() => handleDeleteUser(user._id)}>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{editingUser && (
					<div className="modal-overlay">
						<div className="edit-user-modal">
							<h2>Edit User</h2>
							<form onSubmit={handleSubmit}>
								<div className="form-group">
									<label htmlFor="name">Name</label>
									<input
										type="text"
										id="name"
										name="name"
										value={formData.name}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="form-group">
									<label htmlFor="email">Email</label>
									<input
										type="email"
										id="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="form-group">
									<label htmlFor="phone">Phone</label>
									<input
										type="tel"
										id="phone"
										name="phone"
										value={formData.phone}
										onChange={handleChange}
									/>
								</div>

								<div className="form-group checkbox">
									<input
										type="checkbox"
										id="isAdmin"
										name="isAdmin"
										checked={formData.isAdmin}
										onChange={handleChange}
									/>
									<label htmlFor="isAdmin">Administrator</label>
								</div>

								<div className="form-actions">
									<button
										type="button"
										className="cancel-btn"
										onClick={handleCancelEdit}>
										Cancel
									</button>
									<button type="submit" className="save-btn">
										Save Changes
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default UserManagement;
