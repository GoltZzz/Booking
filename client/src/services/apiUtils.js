import React, { useState, useCallback } from "react";
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
				// Note: This is used when this function is called from a component with the toast hook
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

			// Get the error message from the API response if available
			const apiErrorMessage = err.response?.data?.error || errorMessage;

			// Handle retries if configured
			if (attempts <= retryCount) {
				await new Promise((resolve) => setTimeout(resolve, retryDelay));
				return executeCall();
			}

			if (showErrorToast) {
				// Note: This is used when this function is called from a component with the toast hook
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
 * React hook for using API calls with error handling
 * @param {Function} apiCall - The API call function to execute
 * @param {Object} options - Configuration options
 * @returns {Array} [execute, data, loading, error, reset]
 */
export const useApiCall = (apiCall, options = {}) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const toast = useToast();

	const execute = useCallback(
		async (...args) => {
			setLoading(true);
			setError(null);

			try {
				// For auth operations (registration and login), use the result directly
				if (options.isRegistration || options.isLogin) {
					try {
						const result = await apiCall(...args);
						console.log(
							`apiUtils: ${
								options.isLogin ? "Login" : "Registration"
							} direct result:`,
							result
						);

						if (result && result.success) {
							setData(result);
							if (options.showSuccessToast && toast) {
								toast.success(
									options.successMessage ||
										`${options.isLogin ? "Login" : "Registration"} successful`
								);
							}
							return result;
						} else {
							const errorMsg =
								result?.error ||
								options.errorMessage ||
								`${options.isLogin ? "Login" : "Registration"} failed`;
							setError(errorMsg);
							if (options.showErrorToast && toast) {
								toast.error(errorMsg);
							}
							return null;
						}
					} catch (err) {
						console.error(
							`apiUtils: ${options.isLogin ? "Login" : "Registration"} error:`,
							err
						);
						const errorMsg =
							err.response?.data?.error ||
							options.errorMessage ||
							`${options.isLogin ? "Login" : "Registration"} failed`;
						setError(errorMsg);
						if (options.showErrorToast && toast) {
							toast.error(errorMsg);
						}
						return null;
					}
				} else {
					// For non-auth requests, use the normal error handling
					const result = await withErrorHandling(() => apiCall(...args), {
						...options,
						toast,
					});

					if (result.success) {
						setData(result.data);
						return result.data;
					} else {
						setError(result.error);
						return null;
					}
				}
			} catch (error) {
				console.error("Unexpected API error:", error);
				setError(options.errorMessage || "An unexpected error occurred");
				toast.error(options.errorMessage || "An unexpected error occurred");
				return null;
			} finally {
				setLoading(false);
			}
		},
		[apiCall, options, toast]
	);

	const reset = useCallback(() => {
		setData(null);
		setLoading(false);
		setError(null);
	}, []);

	return [execute, data, loading, error, reset];
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

		// Clear old calls outside the interval
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

	// Error from axios
	if (error.response) {
		// The server responded with a status code outside the 2xx range
		return (
			error.response.data?.error ||
			error.response.data?.message ||
			`Error: ${error.response.status}`
		);
	} else if (error.request) {
		// The request was made but no response was received
		return "Network error. Please check your internet connection.";
	} else {
		// Something happened in setting up the request that triggered an Error
		return error.message || "An unexpected error occurred";
	}
};
