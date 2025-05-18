import React from "react";
import PropTypes from "prop-types";

const SkeletonLoader = ({
	type = "text",
	lines = 1,
	width,
	height,
	className = "",
	animate = true,
}) => {
	// Base classes for skeleton elements
	const baseClasses = `bg-gray-200 dark:bg-gray-700 rounded ${
		animate ? "animate-pulse" : ""
	} ${className}`;

	// Generate a text skeleton with multiple lines
	const renderTextSkeleton = () => {
		const textLines = [];
		for (let i = 0; i < lines; i++) {
			// Vary the width of lines for more natural appearance
			const lineWidth = i === lines - 1 && lines > 1 ? "75%" : "100%";
			textLines.push(
				<div
					key={i}
					className={`${baseClasses} h-4 mb-2`}
					style={{ width: width || lineWidth }}></div>
			);
		}
		return <div>{textLines}</div>;
	};

	// Generate a card skeleton
	const renderCardSkeleton = () => {
		return (
			<div
				className={`${baseClasses} rounded-lg overflow-hidden`}
				style={{ width, height }}>
				<div className="h-48 bg-gray-300 dark:bg-gray-600"></div>
				<div className="p-4">
					<div className={`${baseClasses} h-4 w-2/3 mb-2`}></div>
					<div className={`${baseClasses} h-4 mb-2`}></div>
					<div className={`${baseClasses} h-4 w-4/5 mb-4`}></div>
					<div className={`${baseClasses} h-8 mt-4`}></div>
				</div>
			</div>
		);
	};

	// Generate a profile skeleton
	const renderProfileSkeleton = () => {
		return (
			<div className="flex items-center">
				<div className={`${baseClasses} rounded-full h-12 w-12 mr-4`}></div>
				<div className="flex-1">
					<div className={`${baseClasses} h-4 w-1/3 mb-2`}></div>
					<div className={`${baseClasses} h-3 w-2/3`}></div>
				</div>
			</div>
		);
	};

	// Generate an input skeleton
	const renderInputSkeleton = () => {
		return (
			<div>
				<div className={`${baseClasses} h-4 w-1/4 mb-2`}></div>
				<div className={`${baseClasses} h-10 rounded-md`}></div>
			</div>
		);
	};

	// Generate a table skeleton
	const renderTableSkeleton = () => {
		const tableRows = [];
		for (let i = 0; i < lines; i++) {
			tableRows.push(
				<tr key={i} className="border-b border-gray-200 dark:border-gray-700">
					<td className="py-3 px-4">
						<div className={`${baseClasses} h-4 w-full`}></div>
					</td>
					<td className="py-3 px-4">
						<div className={`${baseClasses} h-4 w-full`}></div>
					</td>
					<td className="py-3 px-4">
						<div className={`${baseClasses} h-4 w-full`}></div>
					</td>
					<td className="py-3 px-4">
						<div className={`${baseClasses} h-4 w-full`}></div>
					</td>
				</tr>
			);
		}

		return (
			<table className="w-full">
				<thead>
					<tr className="border-b border-gray-200 dark:border-gray-700">
						<th className="py-3 px-4">
							<div className={`${baseClasses} h-4 w-3/4`}></div>
						</th>
						<th className="py-3 px-4">
							<div className={`${baseClasses} h-4 w-3/4`}></div>
						</th>
						<th className="py-3 px-4">
							<div className={`${baseClasses} h-4 w-3/4`}></div>
						</th>
						<th className="py-3 px-4">
							<div className={`${baseClasses} h-4 w-3/4`}></div>
						</th>
					</tr>
				</thead>
				<tbody>{tableRows}</tbody>
			</table>
		);
	};

	// Generate a custom shape skeleton
	const renderCustomSkeleton = () => {
		return (
			<div
				className={baseClasses}
				style={{ width: width || "100%", height: height || "100px" }}></div>
		);
	};

	// Render appropriate skeleton based on type
	switch (type) {
		case "text":
			return renderTextSkeleton();
		case "card":
			return renderCardSkeleton();
		case "profile":
			return renderProfileSkeleton();
		case "input":
			return renderInputSkeleton();
		case "table":
			return renderTableSkeleton();
		case "custom":
			return renderCustomSkeleton();
		default:
			return renderTextSkeleton();
	}
};

SkeletonLoader.propTypes = {
	type: PropTypes.oneOf([
		"text",
		"card",
		"profile",
		"input",
		"table",
		"custom",
	]),
	lines: PropTypes.number,
	width: PropTypes.string,
	height: PropTypes.string,
	className: PropTypes.string,
	animate: PropTypes.bool,
};

export default SkeletonLoader;
