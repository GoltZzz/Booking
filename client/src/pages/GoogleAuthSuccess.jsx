import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import googleLogo from "../assets/images/google-logo.png";

const GoogleAuthSuccess = () => {
	const { getProfile } = useAuth();
	const [processingMessage, setProcessingMessage] = useState(
		"Processing your login..."
	);
	const [status, setStatus] = useState("processing"); // "processing", "success", "error"
	const navigate = useNavigate();

	useEffect(() => {
		// Extract the token from URL in a CSP-compliant way
		const processAuth = async () => {
			try {
				// Get the token from the URL query parameters
				const params = new URLSearchParams(window.location.search);
				const token = params.get("token");

				if (token) {
					// Store token in localStorage
					localStorage.setItem("token", token);

					setProcessingMessage("Authentication successful! Redirecting...");
					setStatus("success");

					// Get user profile to check admin status
					const profileResult = await getProfile();

					if (profileResult.success) {
						// Always redirect to landing page regardless of admin status
						setTimeout(() => {
							navigate("/");
						}, 2000);
					} else {
						// If we can't get the profile, redirect to home
						setTimeout(() => {
							navigate("/");
						}, 2000);
					}
				} else {
					setProcessingMessage("Authentication failed. No token received.");
					setStatus("error");
					setTimeout(() => {
						navigate("/login");
					}, 2500);
				}
			} catch (error) {
				console.error("Error processing authentication:", error);
				setProcessingMessage("Authentication error. Please try again.");
				setStatus("error");
				setTimeout(() => {
					navigate("/login");
				}, 2500);
			}
		};

		processAuth();
	}, [navigate, getProfile]);

	return (
		<div className="auth-container">
			<div className="auth-form-container">
				<div className="text-center">
					<img
						src={googleLogo}
						alt="Google"
						style={{
							width: "40px",
							height: "40px",
							marginBottom: "15px",
							animation: "fadeIn 0.5s",
						}}
					/>
					<h2>Google Authentication</h2>

					{status === "processing" && (
						<div className="processing-status">
							<p>{processingMessage}</p>
							<div className="spinner"></div>
						</div>
					)}

					{status === "success" && (
						<div
							className="success-status"
							style={{ animation: "fadeIn 0.5s" }}>
							<div className="success-icon">
								<svg viewBox="0 0 24 24" width="60" height="60">
									<path
										fill="#4CAF50"
										d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
									/>
								</svg>
							</div>
							<p className="success-message">{processingMessage}</p>
						</div>
					)}

					{status === "error" && (
						<div className="error-status" style={{ animation: "fadeIn 0.5s" }}>
							<div className="error-icon">
								<svg viewBox="0 0 24 24" width="60" height="60">
									<path
										fill="#FF5252"
										d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
									/>
								</svg>
							</div>
							<p className="error-message">{processingMessage}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default GoogleAuthSuccess;
