function isLoggedIn() {
	// We can't directly check for HTTP-only cookies, so we'll rely on the server's response
	// We'll keep a flag in sessionStorage to avoid unnecessary API calls
	const authStatus = sessionStorage.getItem("isAuthenticated");
	return authStatus === "true";
}

function getCurrentUser() {
	const userJson = sessionStorage.getItem("user");
	return userJson ? JSON.parse(userJson) : null;
}

function setAuthStatus(isAuthenticated, user) {
	sessionStorage.setItem("isAuthenticated", isAuthenticated);
	if (user) {
		sessionStorage.setItem("user", JSON.stringify(user));
	} else {
		sessionStorage.removeItem("user");
	}
}

async function logout() {
	try {
		// Call the logout endpoint to revoke tokens
		await fetch("/api/users/logout", {
			method: "POST",
			credentials: "include", // Important for cookies
		});

		// Clear session storage
		sessionStorage.removeItem("isAuthenticated");
		sessionStorage.removeItem("user");

		// Redirect to home
		window.location.href = "/";
	} catch (error) {
		console.error("Logout failed:", error);
		// Still clear local data and redirect
		sessionStorage.removeItem("isAuthenticated");
		sessionStorage.removeItem("user");
		window.location.href = "/";
	}
}

async function checkAuth() {
	try {
		const response = await fetch("/api/users/check-auth", {
			credentials: "include", // Important for cookies
		});

		const data = await response.json();

		if (data.isAuthenticated) {
			setAuthStatus(true, data.user);
			return true;
		} else {
			setAuthStatus(false);
			window.location.href =
				"/login?redirect=" + encodeURIComponent(window.location.pathname);
			return false;
		}
	} catch (error) {
		console.error("Auth check failed:", error);
		setAuthStatus(false);
		window.location.href =
			"/login?redirect=" + encodeURIComponent(window.location.pathname);
		return false;
	}
}

async function authenticatedFetch(url, options = {}) {
	try {
		const response = await fetch(url, {
			...options,
			credentials: "include", // Important for cookies
			headers: {
				"Content-Type": "application/json",
				...(options.headers || {}),
			},
		});

		if (response.status === 401) {
			// Try to refresh the token
			const refreshResponse = await fetch("/api/users/refresh", {
				method: "POST",
				credentials: "include",
			});

			if (refreshResponse.ok) {
				// Retry the original request
				return fetch(url, {
					...options,
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						...(options.headers || {}),
					},
				});
			} else {
				// If refresh fails, logout
				logout();
				throw new Error("Your session has expired. Please login again.");
			}
		}

		return response;
	} catch (error) {
		console.error("Request failed:", error);
		throw error;
	}
}

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

// Check auth status when the page loads
document.addEventListener("DOMContentLoaded", async function () {
	// Check auth status with the server
	await fetch("/api/users/check-auth", {
		credentials: "include",
	})
		.then((res) => res.json())
		.then((data) => {
			setAuthStatus(data.isAuthenticated, data.user);
			updateNavigation();
		})
		.catch((err) => {
			console.error("Error checking auth status:", err);
			setAuthStatus(false);
			updateNavigation();
		});

	const logoutBtn = document.getElementById("logoutBtn");
	if (logoutBtn) {
		logoutBtn.addEventListener("click", function (e) {
			e.preventDefault();
			logout();
		});
	}
});
