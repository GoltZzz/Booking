import { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../services/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		const checkAuthStatus = async () => {
			try {
				const response = await auth.getProfile();
				if (response.data && response.data.user) {
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

	const login = async (credentials) => {
		setLoading(true);
		setError(null);
		try {
			const response = await auth.login(credentials);

			if (response.data.isAuthenticated || response.data.user) {
				setUser(response.data.user);
				setIsAuthenticated(true);
				return {
					success: true,
					user: response.data.user,
					message: response.data.message || "Login successful",
				};
			} else {
				throw new Error("Login failed");
			}
		} catch (err) {
			const errorMessage = err.response?.data?.error || "Login failed";
			setError(errorMessage);
			return {
				success: false,
				error: errorMessage,
			};
		} finally {
			setLoading(false);
		}
	};

	const googleLogin = () => {
		window.location.href = "/api/users/auth/google";
	};

	const register = async (userData) => {
		setLoading(true);
		setError(null);
		try {
			const response = await auth.register(userData);

			if (
				response.status === 201 ||
				response.data.isAuthenticated ||
				response.data.user
			) {
				setUser(response.data.user);
				setIsAuthenticated(true);
				return {
					success: true,
					user: response.data.user,
					message: response.data.message || "Registration successful",
				};
			} else {
				throw new Error("Registration failed");
			}
		} catch (err) {
			const errorMessage = err.response?.data?.error || "Registration failed";
			setError(errorMessage);
			return {
				success: false,
				error: errorMessage,
			};
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		setLoading(true);
		try {
			await auth.logout();
			setUser(null);
			setIsAuthenticated(false);
			navigate("/");
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

	const getProfile = async () => {
		setLoading(true);
		try {
			const response = await auth.getProfile();
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

export { AuthContext };
