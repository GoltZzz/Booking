import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

// Create an axios instance with credentials support
const axiosInstance = axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

// Add interceptor to attach auth token from localStorage if available
axiosInstance.interceptors.request.use(
	(config) => {
		// Check if token exists in localStorage or cookies (depends on your auth implementation)
		const token = localStorage.getItem("token");
		if (token) {
			console.log("Attaching token to request");
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Add interceptor to handle token refresh or authentication errors
axiosInstance.interceptors.response.use(
	(response) => {
		// Check if this is a login response with a token
		if (response.data && response.data.token) {
			console.log("Saving token from response");
			localStorage.setItem("token", response.data.token);
		}
		return response;
	},
	async (error) => {
		if (error.response) {
			console.error("API error:", error.response.status, error.response.data);

			// Handle 401 Unauthorized errors
			if (error.response.status === 401) {
				console.log("Unauthorized access, redirecting to login");
				localStorage.removeItem("token");
				// Only redirect if not already on login page
				if (window.location.pathname !== "/login") {
					window.location.href = "/login";
				}
			}
		}
		return Promise.reject(error);
	}
);

// Auth-related API calls
const auth = {
	login: async (credentials) => {
		const response = await axiosInstance.post("/users/login", credentials);
		// Store token if returned from login
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
	// For backward compatibility
	checkAuth: () => axiosInstance.get("/users/profile"),
};

// Add this function to directly check admin status
const checkAdminStatus = async () => {
	const response = await axiosInstance.get("/users/profile");
	if (response.data && response.data.user && response.data.user.isAdmin) {
		return true;
	}
	return false;
};

// Booking-related API calls
const bookingApi = {
	// User booking endpoints
	createBooking: (bookingData) => axiosInstance.post("/bookings", bookingData),
	getUserBookings: () => axiosInstance.get("/bookings"),
	getBookingById: (id) => axiosInstance.get(`/bookings/${id}`),

	// Admin booking endpoints
	getAllBookings: () => axiosInstance.get("/bookings/all"),
	confirmBooking: (id) => axiosInstance.put(`/bookings/${id}/confirm`),
	updateBookingStatus: (id, status) =>
		axiosInstance.put(`/bookings/${id}/status`, { status }),
};

// Admin-related API calls
const adminApi = {
	// Dashboard statistics
	getStats: () => axiosInstance.get("/admin/stats"),

	// User management
	getAllUsers: () => axiosInstance.get("/admin/users"),
	getUsers: () => axiosInstance.get("/admin/users"),
	updateUser: (id, userData) =>
		axiosInstance.patch(`/admin/users/${id}`, userData),
	deleteUser: (id) => axiosInstance.delete(`/admin/users/${id}`),

	// Booking management
	getAllBookings: () => axiosInstance.get("/bookings/all"),
	confirmBooking: (id) => axiosInstance.put(`/bookings/${id}/confirm`),
	updateBookingStatus: (id, status) =>
		axiosInstance.put(`/bookings/${id}/status`, { status }),
};

// Combine all API methods
const api = {
	...auth,
	...bookingApi,
	checkAdminStatus,
};

export { auth, adminApi, bookingApi };
export default api;
