import { createContext, useState, useEffect, useContext } from "react";
import { userApi } from "../services/api";
import { useNavigate } from "react-router-dom";

// Create the context
const AuthContext = createContext();

// Hook for using the context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Always call hooks at the top level
	const navigate = useNavigate();

	// Check authentication status on mount
	useEffect(() => {
		const checkAuthStatus = async () => {
			try {
				const response = await userApi.checkAuth();
				if (response.data.isAuthenticated) {
					setUser(response.data.user);
					setIsAuthenticated(true);
				} else {
					setUser(null);
					setIsAuthenticated(false);
				}
			} catch (err) {
				setError(
					err.response?.data?.error || "Failed to check authentication status"
				);
				setUser(null);
				setIsAuthenticated(false);
			} finally {
				setLoading(false);
			}
		};

		checkAuthStatus();
	}, []);

	// Login function
	const login = async (credentials) => {
		setLoading(true);
		setError(null);
		try {
			console.log("Login with credentials:", credentials);
			const response = await userApi.login(credentials);
			console.log("Login response:", response.data);
			console.log("Response status:", response.status);
			console.log("isAuthenticated value:", response.data.isAuthenticated);
			console.log("Full response object:", response);

			if (response.data.isAuthenticated) {
				console.log(
					"Authentication successful, setting user:",
					response.data.user
				);
				setUser(response.data.user);
				setIsAuthenticated(true);
				// Return the response data with success flag to ensure the modal gets the right info
				return {
					success: true,
					user: response.data.user,
					message: response.data.message || "Login successful",
				};
			} else {
				console.log("Login unsuccessful");
				throw new Error("Login failed");
			}
		} catch (err) {
			console.error("Login error:", err);
			const errorMessage = err.response?.data?.error || "Login failed";
			console.error("Error message being set:", errorMessage);
			setError(errorMessage);
			return {
				success: false,
				error: errorMessage,
			};
		} finally {
			setLoading(false);
		}
	};

	// Google login function
	const googleLogin = () => {
		window.location.href = "/api/users/auth/google";
	};

	// Register function
	const register = async (userData) => {
		setLoading(true);
		setError(null);
		try {
			console.log("Registering with data:", userData);
			const response = await userApi.register(userData);
			console.log("Registration response:", response.data);
			console.log("Response status:", response.status);
			console.log("isAuthenticated value:", response.data.isAuthenticated);
			console.log("Full response object:", response);

			// If we get a successful response (201 Created), consider it successful
			// regardless of the isAuthenticated field
			if (response.status === 201 || response.data.isAuthenticated) {
				console.log(
					"Authentication successful, setting user:",
					response.data.user
				);
				setUser(response.data.user);
				setIsAuthenticated(true);
				// Return the response data with success flag to ensure the modal gets the right info
				return {
					success: true,
					user: response.data.user,
					message: response.data.message || "Registration successful",
				};
			} else {
				console.log("Registration unsuccessful");
				throw new Error("Registration failed");
			}
		} catch (err) {
			console.error("Registration error:", err);
			const errorMessage = err.response?.data?.error || "Registration failed";
			console.error("Error message being set:", errorMessage);
			setError(errorMessage);
			return {
				success: false,
				error: errorMessage,
			};
		} finally {
			setLoading(false);
		}
	};

	// Logout function
	const logout = async () => {
		setLoading(true);
		try {
			await userApi.logout();
			setUser(null);
			setIsAuthenticated(false);
			navigate("/"); // Navigate to home page after logout
			return { success: true };
		} catch (err) {
			setError(err.response?.data?.error || "Logout failed");
			return {
				success: false,
				error: err.response?.data?.error || "Logout failed",
			};
		} finally {
			setLoading(false);
		}
	};

	// Get user profile
	const getProfile = async () => {
		setLoading(true);
		try {
			const response = await userApi.getProfile();
			setUser(response.data.user);
			return { success: true, user: response.data.user };
		} catch (err) {
			setError(err.response?.data?.error || "Failed to fetch profile");
			return {
				success: false,
				error: err.response?.data?.error || "Failed to fetch profile",
			};
		} finally {
			setLoading(false);
		}
	};

	const value = {
		user,
		isAuthenticated,
		loading,
		error,
		login,
		googleLogin,
		register,
		logout,
		getProfile,
		setUser,
		setIsAuthenticated,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export the context as named export instead of default
export { AuthContext };
