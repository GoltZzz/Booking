import React from "react";
import PropTypes from "prop-types";
import {
	FiAlertCircle,
	FiAlertTriangle,
	FiInfo,
	FiCheckCircle,
} from "react-icons/fi";

const ErrorMessage = ({
	message,
	type = "error",
	dismissable = false,
	onDismiss = () => {},
	className = "",
}) => {
	// Define type configurations
	const types = {
		error: {
			bgColor: "bg-[rgba(255,82,82,0.15)]",
			borderColor: "border-l-[#ff5252]",
			textColor: "text-[#ff5252]",
			icon: <FiAlertCircle size={20} />,
		},
		warning: {
			bgColor: "bg-[rgba(255,193,7,0.15)]",
			borderColor: "border-l-[#ffc107]",
			textColor: "text-[#ffc107]",
			icon: <FiAlertTriangle size={20} />,
		},
		info: {
			bgColor: "bg-[rgba(33,150,243,0.15)]",
			borderColor: "border-l-[#2196f3]",
			textColor: "text-[#2196f3]",
			icon: <FiInfo size={20} />,
		},
		success: {
			bgColor: "bg-[rgba(76,175,80,0.15)]",
			borderColor: "border-l-[#4caf50]",
			textColor: "text-[#4caf50]",
			icon: <FiCheckCircle size={20} />,
		},
	};

	const { bgColor, borderColor, textColor, icon } = types[type];

	return (
		<div
			className={`flex items-center p-4 rounded-lg border-l-4 ${bgColor} ${borderColor} ${className}`}
			role="alert"
			aria-live="assertive">
			<div className={`mr-3 ${textColor}`}>{icon}</div>
			<div className="flex-grow text-sm">{message}</div>
			{dismissable && (
				<button
					onClick={onDismiss}
					className={`ml-3 ${textColor} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${type}`}
					aria-label="Dismiss message">
					&times;
				</button>
			)}
		</div>
	);
};

ErrorMessage.propTypes = {
	message: PropTypes.string.isRequired,
	type: PropTypes.oneOf(["error", "warning", "info", "success"]),
	dismissable: PropTypes.bool,
	onDismiss: PropTypes.func,
	className: PropTypes.string,
};

export default ErrorMessage;
