import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";
import googleLogo from "../assets/images/google-logo.png";

const Register = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		phone: "",
	});
	const [error, setError] = useState("");
	const { register, googleLogin, loading } = useAuth();
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (formData.password.length < 6) {
			setError("Password must be at least 6 characters");
			return;
		}

		const registerData = {
			name: formData.name,
			email: formData.email,
			password: formData.password,
			phone: formData.phone,
		};

		console.log("Sending registration data:", registerData);

		const result = await register(registerData);
		console.log("Register function returned:", result);

		if (result.success) {
			console.log("Registration successful, navigating to home");
			navigate("/");
		} else {
			console.log("Registration failed with error:", result.error);
			setError(result.error);
		}
	};

	const handleGoogleSignup = () => {
		googleLogin();
	};

	return (
		<div className="auth-container">
			<div className="auth-form-container">
				<h2>Create an Account</h2>

				{error && <div className="error-message">{error}</div>}

				<form onSubmit={handleSubmit} className="auth-form">
					<div className="form-group">
						<label htmlFor="name">Full Name</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="phone">Phone Number</label>
						<input
							type="tel"
							id="phone"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
							minLength="6"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="confirmPassword">Confirm Password</label>
						<input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleChange}
							required
							minLength="6"
						/>
					</div>

					<button type="submit" className="btn auth-btn" disabled={loading}>
						{loading ? "Registering..." : "Register"}
					</button>
				</form>

				<div className="auth-divider">
					<span>OR</span>
				</div>

				<button
					onClick={handleGoogleSignup}
					className="btn google-btn"
					type="button">
					<img src={googleLogo} alt="Google logo" className="google-icon" />
					Sign up with Google
				</button>

				<div className="auth-links">
					<p>
						Already have an account? <Link to="/login">Login</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Register;
