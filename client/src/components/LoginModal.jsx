import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	FiMail,
	FiLock,
	FiUser,
	FiAlertCircle,
	FiRefreshCw,
} from "react-icons/fi";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import FormInput from "./FormInput";
import Button from "./Button";
import ErrorMessage from "./ErrorMessage";
import ErrorBoundary from "./ErrorBoundary";
import LoadingOverlay from "./LoadingOverlay";
import googleLogo from "../assets/images/google-logo.png";
import { useApiCall } from "../services/apiUtils";

const LoginModal = ({ isOpen, onClose }) => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState({});
	const [loginStatus, setLoginStatus] = useState("idle");
	const { login, googleLogin } = useAuth();
	const toast = useToast();
	const navigate = useNavigate();

	const [executeLogin, , loginLoading, loginError, resetLoginState] =
		useApiCall(
			async (credentials) => {
				const result = await login(credentials);
				return result;
			},
			{
				errorMessage:
					"Login failed. Please check your credentials and try again.",
				successMessage: "Login successful!",
				showSuccessToast: true,
				isLogin: true,
			}
		);

	useEffect(() => {
		if (isOpen) {
			setFormData({
				email: "",
				password: "",
			});
			setErrors({});
			setLoginStatus("idle");
			resetLoginState();
		}
	}, [isOpen, resetLoginState]);

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

		if (!validateForm()) {
			setLoginStatus("error");
			return;
		}

		setLoginStatus("loading");

		try {
			const result = await executeLogin(formData);

			if (result && result.success === true) {
				setLoginStatus("success");

				setTimeout(() => {
					setLoginStatus("redirecting");

					setTimeout(() => {
						onClose();
						navigate("/");
					}, 1500);
				}, 1000);
			} else {
				setErrors({ general: loginError || "Login failed" });
				setLoginStatus("error");
			}
		} catch {
			setErrors({ general: "An unexpected error occurred. Please try again." });
			setLoginStatus("error");
		}
	};

	const handleRetry = useCallback(() => {
		resetLoginState();
		setErrors({});
		setLoginStatus("idle");
	}, [resetLoginState]);

	const handleGoogleLogin = () => {
		onClose();
		googleLogin();
	};

	const isDisabled =
		loginStatus === "loading" ||
		loginStatus === "success" ||
		loginStatus === "redirecting" ||
		loginLoading;

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Welcome Back">
			<ErrorBoundary
				message="Something went wrong"
				description="We couldn't process your login request."
				resetButtonText="Try Again"
				onReset={handleRetry}>
				<LoadingOverlay
					isLoading={loginStatus === "loading"}
					message="Signing you in..."
					transparent
					blur>
					<LoadingOverlay
						isLoading={loginStatus === "redirecting"}
						message="Welcome back! Taking you to our homepage..."
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
								id="modal-password"
								label="Password"
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								required
								error={errors.password}
								autoComplete="current-password"
								disabled={isDisabled}
								icon={<FiLock size={18} />}
								placeholder="Enter your password"
							/>

							<div className="flex justify-end mb-2">
								<button
									type="button"
									className="text-sm text-[#bb86fc] hover:underline"
									onClick={() => {
										toast.info("Password reset functionality coming soon!");
									}}>
									Forgot Password?
								</button>
							</div>

							<Button
								type="submit"
								fullWidth
								loading={loginStatus === "loading"}
								disabled={isDisabled}
								className="mt-4">
								{loginStatus === "success" ? "Success!" : "Sign In"}
							</Button>
						</form>

						<div className="auth-divider">
							<span>OR</span>
						</div>

						<Button
							onClick={handleGoogleLogin}
							variant="outline"
							fullWidth
							disabled={isDisabled}
							icon={<img src={googleLogo} alt="" className="w-5 h-5" />}
							className="google-btn">
							Sign in with Google
						</Button>
					</LoadingOverlay>
				</LoadingOverlay>
			</ErrorBoundary>
		</Modal>
	);
};

export default LoginModal;
