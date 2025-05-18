import { useState, useEffect } from "react";
import { adminApi } from "../../services/api";
import AdminSidebar from "../../components/AdminSidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import Button from "../../components/Button";
import FormInput from "../../components/FormInput";
import Modal from "../../components/Modal";
import { useToast } from "../../context/ToastContext";
import {
	FiSearch,
	FiEdit2,
	FiTrash2,
	FiUsers,
	FiCheck,
	FiX,
} from "react-icons/fi";

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
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { showToast } = useToast();

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const response = await adminApi.getUsers();
			setUsers(response.data);
			setError(null);
		} catch (err) {
			const errorMessage = "Failed to load users";
			setError(errorMessage);
			showToast(errorMessage, "error");
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
		setIsSubmitting(true);

		try {
			await adminApi.updateUser(editingUser._id, formData);
			setEditingUser(null);
			showToast("User updated successfully", "success");
			fetchUsers(); // Refresh the user list
		} catch (err) {
			const errorMessage = "Failed to update user";
			setError(errorMessage);
			showToast(errorMessage, "error");
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteUser = async (userId, userName) => {
		if (
			!window.confirm(
				`Are you sure you want to delete ${userName}? This action cannot be undone.`
			)
		) {
			return;
		}

		try {
			await adminApi.deleteUser(userId);
			showToast("User deleted successfully", "success");
			fetchUsers(); // Refresh the user list
		} catch (err) {
			const errorMessage = "Failed to delete user";
			setError(errorMessage);
			showToast(errorMessage, "error");
			console.error(err);
		}
	};

	const filteredUsers = users.filter(
		(user) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="flex h-screen bg-[#121212]">
			<AdminSidebar />
			<div className="flex-1 overflow-auto p-6">
				<div className="bg-[#1e1e1e] rounded-lg p-6 shadow-lg border border-[#333333] min-h-[calc(100vh-3rem)]">
					<div className="flex items-center justify-between mb-6">
						<h1 className="text-2xl font-bold text-[#e0e0e0] flex items-center">
							<FiUsers className="mr-2 text-[#bb86fc]" /> User Management
						</h1>
						<Button
							variant="primary"
							size="small"
							onClick={fetchUsers}
							loading={loading}
							disabled={loading}>
							Refresh
						</Button>
					</div>

					{error && (
						<div className="mb-6">
							<ErrorMessage message={error} type="error" />
						</div>
					)}

					<div className="mb-6">
						<div className="relative">
							<FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
							<input
								type="text"
								placeholder="Search users by name or email..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 bg-[#121212] border border-[#333333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#bb86fc] text-[#e0e0e0] placeholder-gray-500"
								aria-label="Search users"
							/>
						</div>
					</div>

					{loading && users.length === 0 ? (
						<div className="flex justify-center items-center py-12">
							<LoadingSpinner size="large" text="Loading users..." />
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full border-collapse">
								<thead>
									<tr className="bg-[#2d2d2d] text-left">
										<th className="px-4 py-3 text-[#e0e0e0] font-medium rounded-tl-md">
											Name
										</th>
										<th className="px-4 py-3 text-[#e0e0e0] font-medium">
											Email
										</th>
										<th className="px-4 py-3 text-[#e0e0e0] font-medium hidden md:table-cell">
											Phone
										</th>
										<th className="px-4 py-3 text-[#e0e0e0] font-medium hidden sm:table-cell">
											Auth Method
										</th>
										<th className="px-4 py-3 text-[#e0e0e0] font-medium text-center">
											Admin
										</th>
										<th className="px-4 py-3 text-[#e0e0e0] font-medium hidden md:table-cell">
											Joined
										</th>
										<th className="px-4 py-3 text-[#e0e0e0] font-medium rounded-tr-md text-right">
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{filteredUsers.length === 0 ? (
										<tr>
											<td
												colSpan="7"
												className="px-4 py-8 text-center text-gray-400">
												{searchTerm
													? "No users match your search"
													: "No users found"}
											</td>
										</tr>
									) : (
										filteredUsers.map((user, index) => (
											<tr
												key={user._id}
												className={`border-b border-[#333333] ${
													index % 2 === 1 ? "bg-[#1a1a1a]" : ""
												} hover:bg-[#2d2d2d]`}>
												<td className="px-4 py-3 text-[#e0e0e0]">
													{user.name}
												</td>
												<td className="px-4 py-3 text-[#e0e0e0]">
													{user.email}
												</td>
												<td className="px-4 py-3 text-[#e0e0e0] hidden md:table-cell">
													{user.phone || "-"}
												</td>
												<td className="px-4 py-3 text-[#e0e0e0] hidden sm:table-cell">
													<span
														className={`inline-block px-2 py-1 rounded-full text-xs ${
															user.authMethod === "google"
																? "bg-green-100 text-green-800"
																: "bg-blue-100 text-blue-800"
														}`}>
														{user.authMethod}
													</span>
												</td>
												<td className="px-4 py-3 text-center">
													{user.isAdmin ? (
														<FiCheck className="inline-block text-green-500" />
													) : (
														<FiX className="inline-block text-red-500" />
													)}
												</td>
												<td className="px-4 py-3 text-[#e0e0e0] hidden md:table-cell">
													{new Date(user.createdAt).toLocaleDateString()}
												</td>
												<td className="px-4 py-3 text-right space-x-2">
													<Button
														variant="text"
														size="small"
														icon={<FiEdit2 />}
														onClick={() => handleEditClick(user)}
														ariaLabel={`Edit ${user.name}`}>
														Edit
													</Button>
													<Button
														variant="danger"
														size="small"
														icon={<FiTrash2 />}
														onClick={() =>
															handleDeleteUser(user._id, user.name)
														}
														ariaLabel={`Delete ${user.name}`}>
														Delete
													</Button>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>

			{editingUser && (
				<Modal
					isOpen={!!editingUser}
					onClose={handleCancelEdit}
					title="Edit User"
					size="medium">
					<form onSubmit={handleSubmit} className="space-y-4">
						<FormInput
							id="name"
							label="Name"
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							placeholder="Enter user's full name"
							required
						/>

						<FormInput
							id="email"
							label="Email"
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="Enter user's email address"
							required
						/>

						<FormInput
							id="phone"
							label="Phone"
							type="tel"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							placeholder="Enter user's phone number (optional)"
						/>

						<div className="flex items-center space-x-2 py-2">
							<input
								type="checkbox"
								id="isAdmin"
								name="isAdmin"
								checked={formData.isAdmin}
								onChange={handleChange}
								className="h-4 w-4 text-[#bb86fc] rounded border-[#333333] focus:ring-[#bb86fc] bg-[#121212]"
							/>
							<label
								htmlFor="isAdmin"
								className="text-sm font-medium text-[#e0e0e0]">
								Administrator (gives full access to system)
							</label>
						</div>

						<div className="flex justify-end space-x-3 pt-2">
							<Button
								type="button"
								variant="secondary"
								onClick={handleCancelEdit}>
								Cancel
							</Button>
							<Button
								type="submit"
								variant="primary"
								loading={isSubmitting}
								disabled={isSubmitting}>
								Save Changes
							</Button>
						</div>
					</form>
				</Modal>
			)}
		</div>
	);
};

export default UserManagement;
