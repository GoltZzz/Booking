import React from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import LoadingSpinner from "./LoadingSpinner";
import { FiLoader } from "react-icons/fi";

/**
 * Loading overlay component for showing loading state over content
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isLoading - Whether the component is in loading state
 * @param {string} props.message - Optional message to display during loading
 * @param {boolean} props.blur - Whether to blur the background content
 * @param {boolean} props.transparent - Whether to use a transparent background
 * @param {React.ReactNode} props.children - Child components to render
 */
const LoadingOverlay = ({
	isLoading,
	message = "Loading...",
	spinnerSize = "large",
	spinnerColor = "primary",
	fullPage = false,
	transparent = false,
	blur = false,
	zIndex = 50,
	onCancel = null,
	containerClassName = "",
	messageClassName = "",
	children,
}) => {
	// If not loading, either render nothing or the children
	if (!isLoading) {
		return children || null;
	}

	// Overlay styles based on props
	const overlayClasses = `
    fixed ${fullPage ? "inset-0" : "inset-0"}
    flex items-center justify-center
    ${
			transparent
				? "bg-opacity-70 bg-gray-900 dark:bg-opacity-80 dark:bg-gray-900"
				: "bg-white dark:bg-[#121212] bg-opacity-90 dark:bg-opacity-90"
		}
    ${blur ? "backdrop-blur-sm" : ""}
    ${containerClassName}
  `;

	// Loading indicator with message
	const loadingContent = (
		<div
			className={overlayClasses}
			style={{ zIndex }}
			role="alert"
			aria-busy="true"
			aria-live="polite">
			<div className="text-center">
				{spinnerSize === "custom" ? (
					<div className="animate-spin mb-4">
						{children || <FiLoader size={48} className="text-[#bb86fc]" />}
					</div>
				) : (
					<LoadingSpinner size={spinnerSize} color={spinnerColor} text="" />
				)}

				{message && (
					<div
						className={`mt-4 ${
							transparent ? "text-white" : "text-gray-700 dark:text-gray-200"
						} ${messageClassName}`}>
						{message}
					</div>
				)}

				{onCancel && (
					<button
						onClick={onCancel}
						className="mt-4 px-4 py-2 bg-[#1e1e1e] text-white rounded-md hover:bg-[#333333] transition-colors"
						aria-label="Cancel operation">
						Cancel
					</button>
				)}
			</div>
		</div>
	);

	// For full page overlay, create a portal to attach it to the document body
	if (fullPage) {
		return createPortal(loadingContent, document.body);
	}

	// For inline overlay, wrap content and the children
	return (
		<div className="relative">
			{/* The content */}
			<div
				className={
					isLoading && blur ? "filter blur-sm transition-all duration-200" : ""
				}>
				{children}
			</div>

			{/* The overlay */}
			{isLoading && (
				<div
					className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-200 z-50 ${
						transparent ? "bg-gray-900/30" : "bg-gray-900/70"
					}`}>
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
					{message && <p className="mt-4 text-white font-medium">{message}</p>}
				</div>
			)}
		</div>
	);
};

LoadingOverlay.propTypes = {
	isLoading: PropTypes.bool.isRequired,
	message: PropTypes.node,
	spinnerSize: PropTypes.oneOf(["small", "medium", "large", "custom"]),
	spinnerColor: PropTypes.oneOf(["primary", "white", "dark"]),
	fullPage: PropTypes.bool,
	transparent: PropTypes.bool,
	blur: PropTypes.bool,
	zIndex: PropTypes.number,
	onCancel: PropTypes.func,
	containerClassName: PropTypes.string,
	messageClassName: PropTypes.string,
	children: PropTypes.node,
};

export default LoadingOverlay;
