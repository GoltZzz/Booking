import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

/**
 * A utility component that refreshes authentication status on page load.
 * This helps ensure that protected routes have the most up-to-date auth status.
 */
function AuthRefresher() {
	const { setUser, setIsAuthenticated } = useAuth();

	useEffect(() => {
		const refreshAuthStatus = async () => {
			try {
				// Try to get the token from localStorage
				const token = localStorage.getItem("token");
				console.log("Token in localStorage:", token ? "Found" : "Not found");

				// If token exists, set it in the headers for the next request
				if (token) {
					console.log("Setting auth token in headers");
				}

				// Call the profile endpoint to get current user data
				const response = await api.getProfile();

				if (response.data && response.data.user) {
					console.log("Auth refreshed successfully:", response.data.user);
					setUser(response.data.user);
					setIsAuthenticated(true);

					// If there's a new token in the response, update localStorage
					if (response.data.token) {
						localStorage.setItem("token", response.data.token);
					}
				} else {
					console.log("No user data in auth refresh response");
				}
			} catch (error) {
				console.error("Auth refresh failed:", error);
			}
		};

		refreshAuthStatus();
	}, [setUser, setIsAuthenticated]);

	// This component doesn't render anything
	return null;
}

export default AuthRefresher;
