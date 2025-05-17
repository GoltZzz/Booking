import React from "react";
import PropTypes from "prop-types";

const LoadingSpinner = ({
	size = "medium",
	color = "primary",
	fullPage = false,
	text = "Loading...",
}) => {
	// Define sizes
	const sizes = {
		small: "w-5 h-5",
		medium: "w-8 h-8",
		large: "w-12 h-12",
	};

	// Define colors
	const colors = {
		primary: "border-t-[#bb86fc]",
		white: "border-t-white",
		dark: "border-t-[#121212]",
	};

	const spinnerClasses = `rounded-full border-4 border-[rgba(255,255,255,0.2)] ${colors[color]} animate-spin ${sizes[size]}`;

	if (fullPage) {
		return (
			<div className="fixed inset-0 bg-[#121212] bg-opacity-75 flex flex-col items-center justify-center z-50">
				<div className={spinnerClasses} role="status" aria-live="polite"></div>
				{text && (
					<p className="mt-4 text-[#e0e0e0]" aria-live="polite">
						{text}
					</p>
				)}
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center">
			<div className={spinnerClasses} role="status" aria-live="polite"></div>
			{text && (
				<p className="mt-2 text-sm" aria-live="polite">
					{text}
				</p>
			)}
		</div>
	);
};

LoadingSpinner.propTypes = {
	size: PropTypes.oneOf(["small", "medium", "large"]),
	color: PropTypes.oneOf(["primary", "white", "dark"]),
	fullPage: PropTypes.bool,
	text: PropTypes.string,
};

export default LoadingSpinner;
