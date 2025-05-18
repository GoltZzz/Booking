import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import googleLogo from "../assets/images/google-logo.png";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";
import "../styles/Auth.css";

const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState({});
	const { login, googleLogin, loading, user } = useAuth();
	const toast = useToast();
	const navigate = useNavigate();

	useEffect(() => {
		console.log("Login Page - Current User:", user);
	}, [user]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));

		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: null,
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		try {
			console.log("Logging in with:", formData);
			const result = await login(formData);
			console.log("Login result:", result);

			if (result.success) {
				toast.success("Login successful!");

				if (result.user && result.user.isAdmin) {
					console.log("Admin user detected, redirecting to admin panel");
					navigate("/admin/bookings");
				} else {
					console.log("Regular user detected, redirecting to dashboard");
					navigate("/dashboard");
				}
			} else {
				toast.error(result.error || "Login failed. Please try again.");
				setErrors({ general: result.error });
			}
		} catch (error) {
			console.error("Login error:", error);
			toast.error("An unexpected error occurred. Please try again.");
			setErrors({ general: "An unexpected error occurred" });
		}
	};

	const handleGoogleLogin = () => {
		googleLogin();
	};

	return (
		<div className="auth-container">
			<div className="auth-form-container">
				<h1 className="text-center text-2xl font-bold mb-6">
					Login to Your Account
				</h1>

				{errors.general && (
					<ErrorMessage
						message={errors.general}
						type="error"
						className="mb-4"
					/>
				)}

				<form
					onSubmit={handleSubmit}
					className="auth-form space-y-4"
					noValidate>
					<FormInput
						id="email"
						label="Email Address"
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
						error={errors.email}
						autoComplete="email"
						disabled={loading}
					/>

					<FormInput
						id="password"
						label="Password"
						type="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						required
						error={errors.password}
						autoComplete="current-password"
						disabled={loading}
					/>

					<Button
						type="submit"
						fullWidth
						loading={loading}
						disabled={loading}
						className="mt-6">
						{loading ? "Logging in..." : "Login"}
					</Button>
				</form>

				<div className="auth-divider">
					<span>OR</span>
				</div>

				<Button
					onClick={handleGoogleLogin}
					variant="outline"
					fullWidth
					disabled={loading}
					icon={<img src={googleLogo} alt="" className="w-5 h-5" />}
					className="google-btn">
					Sign in with Google
				</Button>

				<div className="auth-links">
					<p>
						Don't have an account?{" "}
						<Link
							to="/register"
							className="text-[#bb86fc] hover:text-[#a06cd5]">
							Register
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
