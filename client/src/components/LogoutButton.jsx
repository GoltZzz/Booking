import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { FiLogOut, FiLoader } from "react-icons/fi";
import LogoutConfirmationModal from "./LogoutConfirmationModal";

const LogoutButton = ({
	className = "",
	onLogoutStart,
	onLogoutComplete,
	children,
}) => {
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const { logout } = useAuth();
	const toast = useToast();

	const openConfirmation = () => {
		setShowConfirmation(true);
	};

	const closeConfirmation = () => {
		setShowConfirmation(false);
	};

	const handleLogout = async () => {
		try {
			setIsLoggingOut(true);

			// Call the callback if provided
			if (onLogoutStart) {
				onLogoutStart();
			}

			// Slight delay for better UX
			await new Promise((resolve) => setTimeout(resolve, 300));

			const result = await logout();

			if (result.success) {
				toast.success("Logged out successfully!");
			} else {
				toast.error(result.error || "Failed to log out. Please try again.");
			}
		} catch (error) {
			toast.error("An unexpected error occurred during logout.");
			console.error("Logout error:", error);
		} finally {
			setIsLoggingOut(false);
			setShowConfirmation(false);

			// Call the callback if provided
			if (onLogoutComplete) {
				onLogoutComplete();
			}
		}
	};

	return (
		<>
			<button
				onClick={openConfirmation}
				disabled={isLoggingOut}
				className={`${className} relative`}
				aria-label="Logout">
				{children || (
					<>
						<FiLogOut className="inline mr-1" />
						<span>Logout</span>
					</>
				)}
			</button>

			<LogoutConfirmationModal
				isOpen={showConfirmation}
				onClose={closeConfirmation}
				onConfirm={handleLogout}
				isLoading={isLoggingOut}
			/>
		</>
	);
};

export default LogoutButton;
