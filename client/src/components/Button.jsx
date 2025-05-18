import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FiLoader } from "react-icons/fi";

const Button = ({
	children,
	variant = "primary",
	size = "medium",
	type = "button",
	disabled = false,
	loading = false,
	fullWidth = false,
	icon = null,
	iconPosition = "left",
	onClick = () => {},
	href = null,
	to = null,
	className = "",
	ariaLabel,
	...rest
}) => {
	// Define variant styles
	const variants = {
		primary:
			"bg-[#bb86fc] hover:bg-[#a06cd5] text-[#121212] focus:ring-[#bb86fc]",
		secondary:
			"bg-[#1e1e1e] hover:bg-[#333333] text-[#e0e0e0] border border-[#333333] focus:ring-[#333333]",
		outline:
			"bg-transparent hover:bg-[#bb86fc] hover:bg-opacity-10 text-[#bb86fc] border border-[#bb86fc] focus:ring-[#bb86fc]",
		text: "bg-transparent hover:bg-[#bb86fc] hover:bg-opacity-10 text-[#bb86fc] focus:ring-[#bb86fc]",
		danger: "bg-[#ff5252] hover:bg-[#ff1744] text-white focus:ring-[#ff5252]",
	};

	// Define size styles
	const sizes = {
		small: "text-xs px-3 py-1.5 rounded",
		medium: "text-sm px-4 py-2 rounded-md",
		large: "text-base px-6 py-3 rounded-lg",
	};

	// Base classes
	const baseClasses =
		"font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center";

	// Disabled and loading classes
	const stateClasses =
		disabled || loading
			? "opacity-70 cursor-not-allowed"
			: "hover:-translate-y-0.5";

	// Width class
	const widthClass = fullWidth ? "w-full" : "";

	// Combine all classes
	const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${stateClasses} ${widthClass} ${className}`;

	// Handle icon positioning
	const renderContent = () => (
		<>
			{loading ? (
				<FiLoader className="animate-spin mr-2" />
			) : (
				icon && iconPosition === "left" && <span className="mr-2">{icon}</span>
			)}
			{children}
			{icon && iconPosition === "right" && !loading && (
				<span className="ml-2">{icon}</span>
			)}
		</>
	);

	// If it's a link to an external URL
	if (href) {
		return (
			<a
				href={href}
				className={buttonClasses}
				aria-label={ariaLabel || children}
				aria-disabled={disabled || loading}
				rel="noopener noreferrer"
				{...rest}>
				{renderContent()}
			</a>
		);
	}

	// If it's a React Router Link
	if (to) {
		return (
			<Link
				to={to}
				className={buttonClasses}
				aria-label={ariaLabel || children}
				aria-disabled={disabled || loading}
				{...rest}>
				{renderContent()}
			</Link>
		);
	}

	// Default button
	return (
		<button
			type={type}
			className={buttonClasses}
			disabled={disabled || loading}
			onClick={onClick}
			aria-label={ariaLabel || children}
			aria-busy={loading}
			{...rest}>
			{renderContent()}
		</button>
	);
};

Button.propTypes = {
	children: PropTypes.node.isRequired,
	variant: PropTypes.oneOf([
		"primary",
		"secondary",
		"outline",
		"text",
		"danger",
	]),
	size: PropTypes.oneOf(["small", "medium", "large"]),
	type: PropTypes.oneOf(["button", "submit", "reset"]),
	disabled: PropTypes.bool,
	loading: PropTypes.bool,
	fullWidth: PropTypes.bool,
	icon: PropTypes.node,
	iconPosition: PropTypes.oneOf(["left", "right"]),
	onClick: PropTypes.func,
	href: PropTypes.string,
	to: PropTypes.string,
	className: PropTypes.string,
	ariaLabel: PropTypes.string,
};

export default Button;
