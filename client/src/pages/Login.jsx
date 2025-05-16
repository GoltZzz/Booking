import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userApi } from "../services/api";
import "../styles/Auth.css";

const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
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
		setLoading(true);

		try {
			const response = await userApi.login(formData);
			localStorage.setItem("token", response.data.token);
			navigate("/dashboard");
		} catch (err) {
			setError(
				err.response?.data?.message || "Login failed. Please try again."
			);
		} finally {
			setLoading(false);
		}
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
