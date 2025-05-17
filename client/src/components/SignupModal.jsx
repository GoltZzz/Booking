import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";
import googleLogo from "../assets/images/google-logo.png";

const SignupModal = ({ isOpen, onClose }) => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		phone: "",
	});
	const [error, setError] = useState("");
	const [signupStatus, setSignupStatus] = useState("idle"); // idle, loading, success, error
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
		setSignupStatus("loading");

		// Validate passwords match
		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			setSignupStatus("error");
			return;
		}

		// Create a new object with only the fields needed for registration
		const registerData = {
			name: formData.name,
			email: formData.email,
			password: formData.password,
			phone: formData.phone,
		};

		const result = await register(registerData);

		if (result.success) {
			setSignupStatus("success");
			// Show success briefly before closing modal
			setTimeout(() => {
				onClose(); // Close the modal
				// Always redirect to landing page regardless of admin status
				navigate("/");
			}, 1000);
		} else {
			setError(result.error);
			setSignupStatus("error");
		}
	};

	const handleGoogleSignup = () => {
		onClose(); // Close the modal before redirecting
		googleLogin();
		// Note: Google redirect will be handled by the GoogleAuthSuccess component
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Create an Account">
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
					<label htmlFor="name">Full Name</label>
					<input
						type="text"
						id="name"
						name="name"
						value={formData.name}
						onChange={handleChange}
						required
						disabled={signupStatus === "loading" || signupStatus === "success"}
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
						disabled={signupStatus === "loading" || signupStatus === "success"}
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
						disabled={signupStatus === "loading" || signupStatus === "success"}
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
						disabled={signupStatus === "loading" || signupStatus === "success"}
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
						disabled={signupStatus === "loading" || signupStatus === "success"}
					/>
				</div>

				<button
					type="submit"
					className="btn auth-btn"
					disabled={
						loading || signupStatus === "loading" || signupStatus === "success"
					}>
					{signupStatus === "loading" ? (
						<span className="btn-content">
							<span className="spinner-small"></span>
							Registering...
						</span>
					) : signupStatus === "success" ? (
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
						"Register"
					)}
				</button>
			</form>

			<div className="auth-divider">
				<span>OR</span>
			</div>

			<button
				onClick={handleGoogleSignup}
				className="btn google-btn"
				type="button"
				disabled={signupStatus === "loading" || signupStatus === "success"}>
				<img src={googleLogo} alt="Google logo" className="google-icon" />
				Sign up with Google
			</button>
		</Modal>
	);
};

export default SignupModal;
