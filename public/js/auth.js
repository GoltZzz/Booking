function isLoggedIn() {
	return localStorage.getItem("token") !== null;
}

function getCurrentUser() {
	const userJson = localStorage.getItem("user");
	return userJson ? JSON.parse(userJson) : null;
}

function getToken() {
	return localStorage.getItem("token");
}

function logout() {
	localStorage.removeItem("token");
	localStorage.removeItem("user");
	window.location.href = "/";
}

function checkAuth() {
	if (!isLoggedIn()) {
		window.location.href =
			"/login?redirect=" + encodeURIComponent(window.location.pathname);
		return false;
	}
	return true;
}

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

	if (response.status === 401) {
		logout();
		throw new Error("Your session has expired. Please login again.");
	}

	return response;
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

document.addEventListener("DOMContentLoaded", function () {
	updateNavigation();

	const logoutBtn = document.getElementById("logoutBtn");
	if (logoutBtn) {
		logoutBtn.addEventListener("click", function (e) {
			e.preventDefault();
			logout();
		});
	}
});
