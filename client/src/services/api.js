import axios from "axios";

const api = axios.create({
	baseURL: "/api",
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true, // Enable sending cookies with requests
});

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		// If the error is 401 and we haven't already tried to refresh
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// Try to refresh the token
				await axios.post("/api/users/refresh", {}, { withCredentials: true });

				// Retry the original request
				return api(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login
				window.location.href = "/login";
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

// User related API calls
export const userApi = {
	login: (credentials) => api.post("/users/login", credentials),
	register: (userData) => api.post("/users/register", userData),
	logout: () => api.post("/users/logout"),
	getProfile: () => api.get("/users/profile"),
	checkAuth: () => api.get("/users/check-auth"),
	refreshToken: () => api.post("/users/refresh"),
};

// Booking related API calls
export const bookingApi = {
	getBookings: () => api.get("/bookings"),
	createBooking: (bookingData) => api.post("/bookings", bookingData),
	getBooking: (id) => api.get(`/bookings/${id}`),
	updateBooking: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
	deleteBooking: (id) => api.delete(`/bookings/${id}`),
};

// Package related API calls
export const packageApi = {
	getPackages: () => api.get("/packages"),
	getPackage: (id) => api.get(`/packages/${id}`),
};

// Admin related API calls
export const adminApi = {
	// Dashboard statistics
	getStats: () => api.get("/admin/stats"),

	// User management
	getUsers: () => api.get("/admin/users"),
	getUser: (id) => api.get(`/admin/users/${id}`),
	updateUser: (id, userData) => api.patch(`/admin/users/${id}`, userData),
	deleteUser: (id) => api.delete(`/admin/users/${id}`),

	// Booking management
	getAllBookings: () => api.get("/admin/bookings"),
	getBookingDetails: (id) => api.get(`/admin/bookings/${id}`),
	updateBookingDetails: (id, bookingData) =>
		api.patch(`/admin/bookings/${id}`, bookingData),
	deleteBooking: (id) => api.delete(`/admin/bookings/${id}`),
};

export default api;
