import React, { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import Toast from "../components/Toast";

// Create context
const ToastContext = createContext(null);

// Generate unique IDs for toasts
let toastId = 0;

export const ToastProvider = ({ children }) => {
	const [toasts, setToasts] = useState([]);

	// Add a new toast
	const addToast = useCallback((message, options = {}) => {
		const id = ++toastId;

		const toast = {
			id,
			message,
			type: options.type || "info",
			duration: options.duration !== undefined ? options.duration : 3000,
			position: options.position || "bottom-right",
		};

		setToasts((prevToasts) => [...prevToasts, toast]);

		return id;
	}, []);

	// Remove a toast by ID
	const removeToast = useCallback((id) => {
		setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
	}, []);

	// Convenience methods for different toast types
	const success = useCallback(
		(message, options = {}) => {
			return addToast(message, { ...options, type: "success" });
		},
		[addToast]
	);

	const error = useCallback(
		(message, options = {}) => {
			return addToast(message, { ...options, type: "error" });
		},
		[addToast]
	);

	const warning = useCallback(
		(message, options = {}) => {
			return addToast(message, { ...options, type: "warning" });
		},
		[addToast]
	);

	const info = useCallback(
		(message, options = {}) => {
			return addToast(message, { ...options, type: "info" });
		},
		[addToast]
	);

	return (
		<ToastContext.Provider
			value={{ addToast, removeToast, success, error, warning, info }}>
			{children}

			{/* Render all active toasts */}
			{toasts.map((toast) => (
				<Toast
					key={toast.id}
					message={toast.message}
					type={toast.type}
					duration={toast.duration}
					position={toast.position}
					onClose={() => removeToast(toast.id)}
				/>
			))}
		</ToastContext.Provider>
	);
};

ToastProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

// Custom hook to use the toast context
export const useToast = () => {
	const context = useContext(ToastContext);

	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}

	return context;
};

export default ToastContext;
