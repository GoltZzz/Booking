import React, { Component } from "react";
import PropTypes from "prop-types";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import Button from "./Button";

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
		};
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		// You can log the error to an error reporting service
		console.error("ErrorBoundary caught an error:", error, errorInfo);
		this.setState({ errorInfo });

		// Report to your error tracking service here
		if (this.props.onError) {
			this.props.onError(error, errorInfo);
		}
	}

	resetErrorBoundary = () => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
		});

		if (this.props.onReset) {
			this.props.onReset();
		}
	};

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return this.props.fallback ? (
				this.props.fallback({
					error: this.state.error,
					resetErrorBoundary: this.resetErrorBoundary,
				})
			) : (
				<div className="w-full p-6 bg-[#1e1e1e] dark:bg-[#121212] rounded-lg border border-[#333333] text-center">
					<div className="mb-4 text-[#ff5252]">
						<FiAlertTriangle size={48} className="mx-auto" />
					</div>
					<h2 className="text-xl font-semibold mb-3 text-[#e0e0e0]">
						{this.props.message || "Something went wrong"}
					</h2>
					<p className="text-[#9e9e9e] mb-4">
						{this.props.description ||
							"We're sorry, but we encountered an unexpected error."}
					</p>

					{import.meta.env.MODE !== "production" && this.state.error && (
						<div className="mb-4 p-3 bg-[#121212] rounded-md text-left overflow-auto max-h-32">
							<p className="text-[#ff5252] font-mono text-sm">
								{this.state.error.toString()}
							</p>
						</div>
					)}

					<Button
						onClick={this.resetErrorBoundary}
						variant="primary"
						icon={<FiRefreshCw />}>
						{this.props.resetButtonText || "Try Again"}
					</Button>
				</div>
			);
		}

		return this.props.children;
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.node.isRequired,
	fallback: PropTypes.func,
	onError: PropTypes.func,
	onReset: PropTypes.func,
	message: PropTypes.string,
	description: PropTypes.string,
	resetButtonText: PropTypes.string,
};

export default ErrorBoundary;
