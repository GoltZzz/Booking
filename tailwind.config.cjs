/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: "#b8a369", // Gold/bronze color from logo
					light: "#d4c18c",
					dark: "#8e7d4a",
				},
				secondary: {
					DEFAULT: "#a3a8b0", // Silver/gray color from logo
					light: "#d6d9de",
					dark: "#6e7584",
				},
				dark: "#1a1a1a",
			},
			fontFamily: {
				sans: [
					"Circular",
					"Helvetica Neue",
					"Helvetica",
					"Arial",
					"sans-serif",
				],
			},
			backgroundColor: {
				"dark-gradient": "#1a1f25", // Dark background from logo
			},
		},
	},
	plugins: [],
};
