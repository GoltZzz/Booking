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
	const [signupStatus, setSignupStatus] = useState("idle");
	const { register, googleLogin } = useAuth();
	const navigate = useNavigate();

	const [
		executeRegister,
		,
		registerLoading,
		registerError,
		resetRegisterState,
	] = useApiCall(
		async (userData) => {
			const result = await register(userData);
			return result;
		},
		{
			errorMessage:
				"Registration failed. Please check your information and try again.",
			successMessage: "Account created successfully!",
			showSuccessToast: true,
			isRegistration: true,
		}
	);

	useEffect(() => {
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

		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: null,
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.name) {
			newErrors.name = "Full name is required";
		}

		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}

		if (!formData.phone) {
			newErrors.phone = "Phone number is required";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

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
			const registerData = {
				name: formData.name,
				email: formData.email,
				password: formData.password,
				phone: formData.phone,
			};

			const result = await executeRegister(registerData);

			if (result && result.success === true) {
				setSignupStatus("success");

				setTimeout(() => {
					setSignupStatus("redirecting");

					setTimeout(() => {
						onClose();
						navigate("/");
					}, 1500);
				}, 1000);
			} else {
				setErrors({ general: registerError || "Registration failed" });
				setSignupStatus("error");
			}
		} catch {
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
		onClose();
		googleLogin();
	};

	const isDisabled =
		signupStatus === "loading" ||
		signupStatus === "success" ||
		signupStatus === "redirecting" ||
		registerLoading;

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
					<LoadingOverlay
						isLoading={signupStatus === "redirecting"}
						message="Welcome aboard! Taking you to our homepage..."
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
				</LoadingOverlay>
			</ErrorBoundary>
		</Modal>
	);
};

export default SignupModal;
