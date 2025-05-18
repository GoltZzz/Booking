import React from "react";
import PropTypes from "prop-types";

/**
 * Skeleton loader component for different content types
 *
 * @param {Object} props - Component props
 * @param {string} props.type - Type of skeleton ('text', 'circle', 'table', 'card', 'custom')
 * @param {string} props.width - Width of the skeleton
 * @param {string} props.height - Height of the skeleton
 * @param {number} props.lines - Number of lines for text or table skeletons
 * @param {string} props.className - Additional CSS classes
 */
const SkeletonLoader = ({ type, width, height, lines, className }) => {
	const baseClass = "animate-pulse bg-gray-700 rounded";
	const classes = className ? `${baseClass} ${className}` : baseClass;

	// For multi-line text or table skeletons
	if ((type === "text" || type === "table") && lines > 1) {
		return (
			<div className="space-y-2">
				{Array.from({ length: lines }).map((_, index) => (
					<div
						key={index}
						className={classes}
						style={{
							width: width || Math.random() * 30 + 70 + "%",
							height: height || "1rem",
						}}
					/>
				))}
			</div>
		);
	}

	// For single line text skeleton
	if (type === "text") {
		return (
			<div
				className={classes}
				style={{
					width: width || "100%",
					height: height || "1rem",
				}}
			/>
		);
	}

	// For circle skeleton (profile images, avatars)
	if (type === "circle") {
		return (
			<div
				className={`${classes} rounded-full`}
				style={{
					width: width || "3rem",
					height: height || "3rem",
				}}
			/>
		);
	}

	// For card skeleton
	if (type === "card") {
		return (
			<div
				className={`${classes} w-full`}
				style={{ height: height || "10rem" }}
			/>
		);
	}

	// For custom skeleton with specific dimensions
	return (
		<div
			className={classes}
			style={{
				width: width || "100%",
				height: height || "1rem",
			}}
		/>
	);
};

SkeletonLoader.propTypes = {
	type: PropTypes.oneOf(["text", "circle", "table", "card", "custom"]),
	width: PropTypes.string,
	height: PropTypes.string,
	lines: PropTypes.number,
	className: PropTypes.string,
};

SkeletonLoader.defaultProps = {
	type: "text",
	lines: 1,
};

export default SkeletonLoader;
