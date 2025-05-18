import { useState, useCallback } from "react";
import { useToast } from "../context/ToastContext";

/**
 * A wrapper that provides consistent error handling for API calls
 * @param {Function} apiCall - The API call function to wrap
 * @param {Object} options - Configuration options
 * @returns {Object} Result containing data, error state, and reset function
 */
export const withErrorHandling = async (apiCall, options = {}) => {
	const {
		errorMessage = "An error occurred. Please try again.",
		showErrorToast = true,
		showSuccessToast = false,
		successMessage = "Operation completed successfully.",
		transformResponse = (data) => data,
		retryCount = 0,
		retryDelay = 1000,
		onError = null,
		onSuccess = null,
	} = options;

	let attempts = 0;

	const executeCall = async () => {
		try {
			const response = await apiCall();
			const transformedData = transformResponse(response.data);

			if (showSuccessToast) {
				if (options.toast) {
					options.toast.success(successMessage);
				}
			}

			if (onSuccess) {
				onSuccess(transformedData);
			}

			return {
				data: transformedData,
				success: true,
				error: null,
				statusCode: response.status,
			};
		} catch (err) {
			attempts++;

			const apiErrorMessage = err.response?.data?.error || errorMessage;

			if (attempts <= retryCount) {
				await new Promise((resolve) => setTimeout(resolve, retryDelay));
				return executeCall();
			}

			if (showErrorToast) {
				if (options.toast) {
					options.toast.error(apiErrorMessage);
				}
			}

			if (onError) {
				onError(err);
			}

			return {
				data: null,
				success: false,
				error: apiErrorMessage,
				statusCode: err.response?.status,
				rawError: err,
			};
		}
	};

	return executeCall();
};

/**
 * Custom hook for managing API calls with loading and error states
 *
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Options for the API call
 * @param {string} options.errorMessage - Default error message to show
 * @param {string} options.successMessage - Success message to show on successful API call
 * @param {boolean} options.showSuccessToast - Whether to show a success toast
 * @param {boolean} options.showErrorToast - Whether to show an error toast
 * @param {Function} options.onSuccess - Callback for successful API call
 * @param {Function} options.onError - Callback for API call errors
 * @returns {Array} - [executeCall, data, loading, error, resetState]
 */
export const useApiCall = (apiFunction, options = {}) => {
	const {
		errorMessage = "An error occurred",
		successMessage = "Operation completed successfully",
		showSuccessToast = false,
		showErrorToast = true,
		onSuccess,
		onError,
		isLogin = false,
	} = options;

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const toast = useToast();

	// Reset state function
	const resetState = useCallback(() => {
		setData(null);
		setLoading(false);
		setError(null);
	}, []);

	// Execute the API call
	const executeCall = useCallback(
		async (...args) => {
			setLoading(true);
			setError(null);

			try {
				const result = await apiFunction(...args);
				setData(result);

				if (showSuccessToast && !isLogin) {
					toast.success(successMessage);
				}

				if (onSuccess) {
					onSuccess(result);
				}

				setLoading(false);
				return result;
			} catch (err) {
				console.error("API call error:", err);

				const errorMsg = err.response?.data?.error || errorMessage;
				setError(errorMsg);

				if (showErrorToast && !isLogin) {
					toast.error(errorMsg);
				}

				if (onError) {
					onError(err);
				}

				setLoading(false);
				throw err;
			}
		},
		[
			apiFunction,
			errorMessage,
			successMessage,
			showSuccessToast,
			showErrorToast,
			onSuccess,
			onError,
			toast,
			isLogin,
		]
	);

	return [executeCall, data, loading, error, resetState];
};

/**
 * Create an error response object for consistent error formats
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {any} details - Additional error details
 * @returns {Object} Formatted error response
 */
export const createErrorResponse = (
	message,
	statusCode = 500,
	details = null
) => {
	return {
		success: false,
		error: message,
		statusCode,
		details,
		timestamp: new Date().toISOString(),
	};
};

/**
 * Rate limiter utility for API calls
 * @param {number} limit - Number of calls allowed
 * @param {number} interval - Time interval in milliseconds
 * @returns {Function} Rate limited function
 */
export const rateLimiter = (limit, interval) => {
	const calls = [];

	return async (fn) => {
		const now = Date.now();

		while (calls.length > 0 && calls[0] < now - interval) {
			calls.shift();
		}

		if (calls.length >= limit) {
			throw new Error(
				`Rate limit exceeded. Try again in ${Math.ceil(
					(calls[0] + interval - now) / 1000
				)} seconds.`
			);
		}

		calls.push(now);
		return fn();
	};
};

/**
 * Helper to extract and normalize API error messages
 * @param {Error} error - The caught error
 * @returns {string} Normalized error message
 */
export const getErrorMessage = (error) => {
	if (!error) return "An unknown error occurred";

	if (error.response) {
		return (
			error.response.data?.error ||
			error.response.data?.message ||
			`Error: ${error.response.status}`
		);
	} else if (error.request) {
		return "Network error. Please check your internet connection.";
	} else {
		return error.message || "An unexpected error occurred";
	}
};

/**
 * Format date string to a human-readable format
 *
 * @param {string} dateString - ISO date string
 * @param {Object} options - Format options
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
	if (!dateString) return "";

	const date = new Date(dateString);

	// Default options
	const defaultOptions = {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		...options,
	};

	return date.toLocaleDateString(undefined, defaultOptions);
};

/**
 * Safely access nested object properties
 *
 * @param {Object} obj - The object to access
 * @param {string} path - Dot notation path to the property
 * @param {any} defaultValue - Default value if property doesn't exist
 * @returns {any} - The property value or default value
 */
export const getProperty = (obj, path, defaultValue = "") => {
	if (!obj || !path) return defaultValue;

	const keys = path.split(".");
	let result = obj;

	for (const key of keys) {
		if (
			result === null ||
			result === undefined ||
			!Object.prototype.hasOwnProperty.call(result, key)
		) {
			return defaultValue;
		}
		result = result[key];
	}

	return result === null || result === undefined ? defaultValue : result;
};

export default {
	useApiCall,
	formatDate,
	getProperty,
};
