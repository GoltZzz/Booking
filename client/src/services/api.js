import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			console.log("Attaching token to request");
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
	(response) => {
		if (response.data && response.data.token) {
			console.log("Saving token from response");
			localStorage.setItem("token", response.data.token);
		}
		return response;
	},
	async (error) => {
		if (error.response) {
			console.error("API error:", error.response.status, error.response.data);

			if (error.response.status === 401) {
				console.log("Unauthorized access detected");
				localStorage.removeItem("token");
			}
		}
		return Promise.reject(error);
	}
);

const auth = {
	login: async (credentials) => {
		const response = await axiosInstance.post("/users/login", credentials);
		if (response.data && response.data.token) {
			console.log("Storing token from login response");
			localStorage.setItem("token", response.data.token);
		} else if (response.data && response.data.accessToken) {
			console.log("Storing accessToken from login response");
			localStorage.setItem("token", response.data.accessToken);
		}
		return response;
	},
	register: (userData) => axiosInstance.post("/users/register", userData),
	logout: async () => {
		const response = await axiosInstance.post("/users/logout");
		localStorage.removeItem("token");
		return response;
	},
	getProfile: () => axiosInstance.get("/users/profile"),
	checkAuth: () => axiosInstance.get("/users/profile"),
};

const checkAdminStatus = async () => {
	const response = await axiosInstance.get("/users/profile");
	if (response.data && response.data.user && response.data.user.isAdmin) {
		return true;
	}
	return false;
};

const bookingApi = {
	createBooking: (bookingData) => axiosInstance.post("/bookings", bookingData),
	getUserBookings: () => axiosInstance.get("/bookings"),
	getBookingById: (id) => axiosInstance.get(`/bookings/${id}`),

	getAllBookings: () => axiosInstance.get("/bookings/all"),
	confirmBooking: (id) => axiosInstance.put(`/bookings/${id}/confirm`),
	updateBookingStatus: (id, status) =>
		axiosInstance.put(`/bookings/${id}/status`, { status }),
};

const adminApi = {
	getStats: () => axiosInstance.get("/admin/stats"),

	getAllUsers: () => axiosInstance.get("/admin/users"),
	getUsers: () => axiosInstance.get("/admin/users"),
	updateUser: (id, userData) =>
		axiosInstance.patch(`/admin/users/${id}`, userData),
	deleteUser: (id) => axiosInstance.delete(`/admin/users/${id}`),

	getAllBookings: () => axiosInstance.get("/bookings/all"),
	confirmBooking: (id) => axiosInstance.put(`/bookings/${id}/confirm`),
	updateBookingStatus: (id, status) =>
		axiosInstance.put(`/bookings/${id}/status`, { status }),
};

const api = {
	...auth,
	...bookingApi,
	checkAdminStatus,
};

export { auth, adminApi, bookingApi };
export default api;
