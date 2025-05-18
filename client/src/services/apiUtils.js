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
				if (options.isRegistration || options.isLogin) {
					try {
						const result = await apiCall(...args);

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
			} catch {
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
