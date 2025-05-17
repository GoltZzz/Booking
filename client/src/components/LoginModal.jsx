import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import FormInput from "./FormInput";
import Button from "./Button";
import ErrorMessage from "./ErrorMessage";
import googleLogo from "../assets/images/google-logo.png";

const LoginModal = ({ isOpen, onClose }) => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState({});
	const [loginStatus, setLoginStatus] = useState("idle"); // idle, loading, success, error
	const { login, googleLogin } = useAuth();
	const toast = useToast();
	const navigate = useNavigate();

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

		// Email validation
		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}

		// Password validation
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
			const result = await login(formData);

			if (result.success) {
				setLoginStatus("success");
				toast.success("Login successful!");

				// Show success briefly before closing modal
				setTimeout(() => {
					onClose(); // Close the modal
					// Always redirect to landing page regardless of admin status
					navigate("/");
				}, 1000);
			} else {
				toast.error(result.error || "Login failed");
				setErrors({ general: result.error });
				setLoginStatus("error");
			}
		} catch {
			toast.error("An unexpected error occurred");
			setErrors({ general: "An unexpected error occurred. Please try again." });
			setLoginStatus("error");
		}
	};

	const handleGoogleLogin = () => {
		onClose(); // Close the modal before redirecting
		googleLogin();
		// Note: Google redirect will be handled by the GoogleAuthSuccess component
	};

	const isDisabled = loginStatus === "loading" || loginStatus === "success";

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Sign In">
			{errors.general && (
				<ErrorMessage message={errors.general} type="error" className="mb-4" />
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
				/>

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
		</Modal>
	);
};

export default LoginModal;
