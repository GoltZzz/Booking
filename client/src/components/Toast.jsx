import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
	FiAlertCircle,
	FiCheckCircle,
	FiInfo,
	FiAlertTriangle,
	FiX,
} from "react-icons/fi";
import { createPortal } from "react-dom";

const Toast = ({
	message,
	type = "info",
	duration = 3000,
	position = "bottom-right",
	onClose,
}) => {
	const [isVisible, setIsVisible] = useState(true);

	// Define type configurations
	const types = {
		success: {
			bgColor: "bg-[#4caf50]",
			icon: <FiCheckCircle size={20} />,
		},
		error: {
			bgColor: "bg-[#ff5252]",
			icon: <FiAlertCircle size={20} />,
		},
		warning: {
			bgColor: "bg-[#ffc107]",
			icon: <FiAlertTriangle size={20} />,
		},
		info: {
			bgColor: "bg-[#2196f3]",
			icon: <FiInfo size={20} />,
		},
	};

	// Define position styles
	const positions = {
		"top-right": "top-4 right-4",
		"top-left": "top-4 left-4",
		"bottom-right": "bottom-4 right-4",
		"bottom-left": "bottom-4 left-4",
		"top-center": "top-4 left-1/2 transform -translate-x-1/2",
		"bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
	};

	// Auto-close toast after duration
	useEffect(() => {
		if (duration !== 0) {
			const timer = setTimeout(() => {
				handleClose();
			}, duration);

			return () => clearTimeout(timer);
		}
	}, [duration]);

	const handleClose = () => {
		setIsVisible(false);
		setTimeout(() => {
			onClose && onClose();
		}, 300); // Wait for animation to complete
	};

	if (!isVisible) return null;

	const { bgColor, icon } = types[type];
	const positionClass = positions[position];

	// Create portal to render toast at the root level
	return createPortal(
		<div
			className={`fixed ${positionClass} z-50 flex items-center transform transition-all duration-300 ${
				isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
			}`}
			role="alert"
			aria-live="assertive">
			<div
				className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center max-w-md`}>
				<div className="mr-3">{icon}</div>
				<p className="mr-8">{message}</p>
				<button
					onClick={handleClose}
					className="ml-auto text-white hover:text-gray-200 focus:outline-none"
					aria-label="Close notification">
					<FiX size={18} />
				</button>
			</div>
		</div>,
		document.body
	);
};

Toast.propTypes = {
	message: PropTypes.string.isRequired,
	type: PropTypes.oneOf(["success", "error", "warning", "info"]),
	duration: PropTypes.number,
	position: PropTypes.oneOf([
		"top-right",
		"top-left",
		"bottom-right",
		"bottom-left",
		"top-center",
		"bottom-center",
	]),
	onClose: PropTypes.func,
};

export default Toast;
