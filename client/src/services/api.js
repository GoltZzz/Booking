import axios from "axios";

const api = axios.create({
	baseURL: "/api",
	headers: {
		"Content-Type": "application/json",
	},
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// User related API calls
export const userApi = {
	login: (credentials) => api.post("/users/login", credentials),
	register: (userData) => api.post("/users/register", userData),
	getProfile: () => api.get("/users/profile"),
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

export default api;
