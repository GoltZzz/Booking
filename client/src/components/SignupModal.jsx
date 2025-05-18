import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiPhone, FiRefreshCw } from "react-icons/fi";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";
import FormInput from "./FormInput";
import Button from "./Button";
import ErrorMessage from "./ErrorMessage";
import ErrorBoundary from "./ErrorBoundary";
import LoadingOverlay from "./LoadingOverlay";
import googleLogo from "../assets/images/google-logo.png";
import { useApiCall } from "../services/apiUtils";

const SignupModal = ({ isOpen, onClose }) => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		phone: "",
	});
	const [errors, setErrors] = useState({});
	const [signupStatus, setSignupStatus] = useState("idle"); // idle, loading, success, error
	const { register, googleLogin } = useAuth();
	const navigate = useNavigate();

	// Use API call hook for registration
	const [
		executeRegister,
		,
		registerLoading,
		registerError,
		resetRegisterState,
	] = useApiCall(
		async (userData) => {
			// Call register and log the result for debugging
			const result = await register(userData);
			console.log("Direct result from register:", result);
			return result; // Return the entire result object
		},
		{
			errorMessage:
				"Registration failed. Please check your information and try again.",
			successMessage: "Account created successfully!",
			showSuccessToast: true,
			isRegistration: true,
		}
	);

	// Reset the modal state when it opens or closes
	useEffect(() => {
		// When the modal is opened, reset all form fields and states
		if (isOpen) {
			setFormData({
				name: "",
				email: "",
				password: "",
				confirmPassword: "",
				phone: "",
			});
			setErrors({});
			setSignupStatus("idle");
			resetRegisterState();
		}
	}, [isOpen, resetRegisterState]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));

		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: null,
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		// Name validation
		if (!formData.name) {
			newErrors.name = "Full name is required";
		}

		// Email validation
		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}

		// Phone validation
		if (!formData.phone) {
			newErrors.phone = "Phone number is required";
		}

		// Password validation
		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		// Confirm password validation
		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			setSignupStatus("error");
			return;
		}

		setSignupStatus("loading");

		try {
			// Create a new object with only the fields needed for registration
			const registerData = {
				name: formData.name,
				email: formData.email,
				password: formData.password,
				phone: formData.phone,
			};

			console.log("SignupModal - Sending registration data:", registerData);

			// Execute registration
			const result = await executeRegister(registerData);

			console.log("SignupModal - Registration result:", result);

			// Consider registration successful if the result has a success property that is true
			if (result && result.success === true) {
				console.log("SignupModal - Registration successful");
				setSignupStatus("success");

				// Show success briefly before closing modal
				setTimeout(() => {
					onClose(); // Close the modal
					navigate("/");
				}, 1000);
			} else {
				console.log("SignupModal - Registration failed with result:", result);
				setErrors({ general: registerError || "Registration failed" });
				setSignupStatus("error");
			}
		} catch (error) {
			console.error("SignupModal - Unexpected error:", error);
			setErrors({ general: "An unexpected error occurred. Please try again." });
			setSignupStatus("error");
		}
	};

	const handleRetry = useCallback(() => {
		resetRegisterState();
		setErrors({});
		setSignupStatus("idle");
	}, [resetRegisterState]);

	const handleGoogleSignup = () => {
		onClose(); // Close the modal before redirecting
		googleLogin();
		// Note: Google redirect will be handled by the GoogleAuthSuccess component
	};

	const isDisabled =
		signupStatus === "loading" || signupStatus === "success" || registerLoading;

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Join Our Community">
			<ErrorBoundary
				message="Registration Error"
				description="We couldn't process your registration request."
				resetButtonText="Try Again"
				onReset={handleRetry}>
				<LoadingOverlay
					isLoading={signupStatus === "loading"}
					message="Creating your account..."
					transparent
					blur>
					{errors.general && (
						<div className="mb-4">
							<ErrorMessage
								message={errors.general}
								type="error"
								action={{
									label: "Try Again",
									onClick: handleRetry,
									icon: <FiRefreshCw size={14} />,
								}}
							/>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4" noValidate>
						<FormInput
							id="modal-name"
							label="Full Name"
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
							error={errors.name}
							autoComplete="name"
							disabled={isDisabled}
							icon={<FiUser size={18} />}
							placeholder="John Doe"
						/>

						<FormInput
							id="modal-email"
							label="Email Address"
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
							error={errors.email}
							autoComplete="email"
							disabled={isDisabled}
							icon={<FiMail size={18} />}
							placeholder="your.email@example.com"
						/>

						<FormInput
							id="modal-phone"
							label="Phone Number"
							type="tel"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							required
							error={errors.phone}
							autoComplete="tel"
							disabled={isDisabled}
							icon={<FiPhone size={18} />}
							placeholder="(123) 456-7890"
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormInput
								id="modal-password"
								label="Password"
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								required
								minLength="6"
								error={errors.password}
								helperText="Password must be at least 6 characters"
								autoComplete="new-password"
								disabled={isDisabled}
								icon={<FiLock size={18} />}
								placeholder="Create password"
							/>

							<FormInput
								id="modal-confirm-password"
								label="Confirm Password"
								type="password"
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleChange}
								required
								minLength="6"
								error={errors.confirmPassword}
								autoComplete="new-password"
								disabled={isDisabled}
								icon={<FiLock size={18} />}
								placeholder="Confirm password"
							/>
						</div>

						<Button
							type="submit"
							fullWidth
							loading={signupStatus === "loading"}
							disabled={isDisabled}
							className="mt-4">
							{signupStatus === "success" ? "Success!" : "Create Account"}
						</Button>
					</form>

					<div className="auth-divider">
						<span>OR</span>
					</div>

					<Button
						onClick={handleGoogleSignup}
						variant="outline"
						fullWidth
						disabled={isDisabled}
						icon={<img src={googleLogo} alt="" className="w-5 h-5" />}
						className="google-btn">
						Sign up with Google
					</Button>
				</LoadingOverlay>
			</ErrorBoundary>
		</Modal>
	);
};

export default SignupModal;
