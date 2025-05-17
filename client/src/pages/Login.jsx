import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import googleLogo from "../assets/images/google-logo.png";
import "../styles/Auth.css";

const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const { login, googleLogin, loading } = useAuth();
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

		const result = await login(formData);

		if (result.success) {
			navigate("/dashboard");
		} else {
			setError(result.error);
		}
	};

	const handleGoogleLogin = () => {
		googleLogin();
	};

	return (
		<div className="auth-container">
			<div className="auth-form-container">
				<h2>Login to Your Account</h2>

				{error && <div className="error-message">{error}</div>}

				<form onSubmit={handleSubmit} className="auth-form">
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
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
						/>
					</div>

					<button type="submit" className="btn auth-btn" disabled={loading}>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>

				<div className="auth-divider">
					<span>OR</span>
				</div>

				<button
					onClick={handleGoogleLogin}
					className="btn google-btn"
					type="button">
					<img src={googleLogo} alt="Google logo" className="google-icon" />
					Sign in with Google
				</button>

				<div className="auth-links">
					<p>
						Don't have an account? <Link to="/register">Register</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
