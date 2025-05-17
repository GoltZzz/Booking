import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";
import googleLogo from "../assets/images/google-logo.png";

const LoginModal = ({ isOpen, onClose }) => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [loginStatus, setLoginStatus] = useState("idle"); // idle, loading, success, error
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
		setLoginStatus("loading");

		const result = await login(formData);

		if (result.success) {
			setLoginStatus("success");
			// Show success briefly before closing modal
			setTimeout(() => {
				onClose(); // Close the modal
				// Always redirect to landing page regardless of admin status
				navigate("/");
			}, 1000);
		} else {
			setError(result.error);
			setLoginStatus("error");
		}
	};

	const handleGoogleLogin = () => {
		onClose(); // Close the modal before redirecting
		googleLogin();
		// Note: Google redirect will be handled by the GoogleAuthSuccess component
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Sign In">
			{error && (
				<div className="error-message">
					<svg
						viewBox="0 0 24 24"
						width="20"
						height="20"
						style={{ marginRight: "8px" }}>
						<path
							fill="#FF5252"
							d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
						/>
					</svg>
					{error}
				</div>
			)}

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
						disabled={loginStatus === "loading" || loginStatus === "success"}
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
						disabled={loginStatus === "loading" || loginStatus === "success"}
					/>
				</div>

				<button
					type="submit"
					className="btn auth-btn"
					disabled={
						loading || loginStatus === "loading" || loginStatus === "success"
					}>
					{loginStatus === "loading" ? (
						<span className="btn-content">
							<span className="spinner-small"></span>
							Signing In...
						</span>
					) : loginStatus === "success" ? (
						<span className="btn-content">
							<svg
								viewBox="0 0 24 24"
								width="20"
								height="20"
								style={{ marginRight: "8px" }}>
								<path
									fill="#FFFFFF"
									d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
								/>
							</svg>
							Success!
						</span>
					) : (
						"Sign In"
					)}
				</button>
			</form>

			<div className="auth-divider">
				<span>OR</span>
			</div>

			<button
				onClick={handleGoogleLogin}
				className="btn google-btn"
				type="button"
				disabled={loginStatus === "loading" || loginStatus === "success"}>
				<img src={googleLogo} alt="Google logo" className="google-icon" />
				Sign in with Google
			</button>
		</Modal>
	);
};

export default LoginModal;
