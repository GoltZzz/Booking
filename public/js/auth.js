/**
 * Authentication utilities for MJ Studios Photo Booth Booking
 */

// Check if user is logged in
function isLoggedIn() {
	return localStorage.getItem("token") !== null;
}

// Get current user
function getCurrentUser() {
	const userJson = localStorage.getItem("user");
	return userJson ? JSON.parse(userJson) : null;
}

// Get auth token
function getToken() {
	return localStorage.getItem("token");
}

// Logout user
function logout() {
	localStorage.removeItem("token");
	localStorage.removeItem("user");
	window.location.href = "/";
}

// Protected route check
function checkAuth() {
	if (!isLoggedIn()) {
		window.location.href =
			"/login?redirect=" + encodeURIComponent(window.location.pathname);
		return false;
	}
	return true;
}

// API request with authentication
async function authenticatedFetch(url, options = {}) {
	const token = getToken();

	if (!token) {
		throw new Error("No authentication token found");
	}

	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
		...(options.headers || {}),
	};

	const response = await fetch(url, {
		...options,
		headers,
	});

	// Handle unauthorized response
	if (response.status === 401) {
		logout();
		throw new Error("Your session has expired. Please login again.");
	}

	return response;
}

// Update navigation based on auth status
function updateNavigation() {
	const isAuthenticated = isLoggedIn();
	const loginLink = document.getElementById("loginLink");
	const registerLink = document.getElementById("registerLink");
	const logoutLink = document.getElementById("logoutLink");
	const dashboardLink = document.getElementById("dashboardLink");

	if (isAuthenticated) {
		if (loginLink) loginLink.style.display = "none";
		if (registerLink) registerLink.style.display = "none";
		if (logoutLink) logoutLink.style.display = "block";
		if (dashboardLink) dashboardLink.style.display = "block";
	} else {
		if (loginLink) loginLink.style.display = "block";
		if (registerLink) registerLink.style.display = "block";
		if (logoutLink) logoutLink.style.display = "none";
		if (dashboardLink) dashboardLink.style.display = "none";
	}
}

// Initialize auth on page load
document.addEventListener("DOMContentLoaded", function () {
	updateNavigation();

	// Add logout event listener
	const logoutBtn = document.getElementById("logoutBtn");
	if (logoutBtn) {
		logoutBtn.addEventListener("click", function (e) {
			e.preventDefault();
			logout();
		});
	}
});
