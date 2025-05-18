import React, { useState } from "react";
import PropTypes from "prop-types";
import { FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";

const FormInput = ({
	id,
	label,
	type = "text",
	value,
	onChange,
	name,
	placeholder,
	required = false,
	disabled = false,
	error = null,
	helperText = null,
	fullWidth = true,
	className = "",
	min,
	max,
	pattern,
	autoComplete,
	onBlur,
	onFocus,
	icon = null,
	...rest
}) => {
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const handleFocus = (e) => {
		if (onFocus) onFocus(e);
	};

	const handleBlur = (e) => {
		if (onBlur) onBlur(e);
	};

	// Base classes
	const inputWrapperClasses = `relative ${
		fullWidth ? "w-full" : ""
	} ${className}`;

	const labelClasses = `block text-sm font-semibold mb-2 ${
		disabled ? "text-gray-500" : "text-gray-800 dark:text-gray-100"
	}`;

	const inputClasses = `
    w-full px-3 py-2 rounded-md
    ${icon ? "pl-10" : "pl-3"}
    ${
			disabled
				? "bg-gray-100 text-gray-400 cursor-not-allowed"
				: "bg-white dark:bg-[#1e1e1e]"
		}
    ${
			error
				? "border-[#ff5252] focus:border-[#ff5252] focus:ring-[#ff5252]"
				: "border-gray-300 dark:border-[#333333] focus:border-[#bb86fc] focus:ring-[#bb86fc]"
		}
    border focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors
  `;

	return (
		<div className={inputWrapperClasses}>
			{label && (
				<label htmlFor={id} className={labelClasses}>
					{label}
					{required && <span className="text-[#ff5252] ml-1">*</span>}
				</label>
			)}

			<div className="relative">
				{icon && (
					<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
						{icon}
					</span>
				)}

				<input
					id={id}
					type={type === "password" && showPassword ? "text" : type}
					name={name}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					disabled={disabled}
					required={required}
					className={inputClasses}
					aria-invalid={!!error}
					aria-describedby={
						error ? `${id}-error` : helperText ? `${id}-helper` : undefined
					}
					min={min}
					max={max}
					pattern={pattern}
					autoComplete={autoComplete}
					onFocus={handleFocus}
					onBlur={handleBlur}
					{...rest}
				/>

				{type === "password" && (
					<button
						type="button"
						onClick={togglePasswordVisibility}
						className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 focus:outline-none hover:text-[#bb86fc]"
						aria-label={showPassword ? "Hide password" : "Show password"}
						tabIndex="-1">
						{showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
					</button>
				)}
			</div>

			{error && (
				<div
					id={`${id}-error`}
					className="flex items-center mt-1 text-xs text-[#ff5252]"
					role="alert">
					<FiAlertCircle size={12} className="mr-1" />
					<span>{error}</span>
				</div>
			)}

			{!error && helperText && (
				<div
					id={`${id}-helper`}
					className="mt-1 text-xs text-gray-600 dark:text-gray-300">
					{helperText}
				</div>
			)}
		</div>
	);
};

FormInput.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	type: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onChange: PropTypes.func.isRequired,
	name: PropTypes.string,
	placeholder: PropTypes.string,
	required: PropTypes.bool,
	disabled: PropTypes.bool,
	error: PropTypes.string,
	helperText: PropTypes.string,
	fullWidth: PropTypes.bool,
	className: PropTypes.string,
	min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	pattern: PropTypes.string,
	autoComplete: PropTypes.string,
	onBlur: PropTypes.func,
	onFocus: PropTypes.func,
	icon: PropTypes.node,
};

export default FormInput;
