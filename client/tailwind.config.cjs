/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#ff385c", // Airbnb-like primary color
				secondary: "#f8c630", // Keep yellow from previous design
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
		},
	},
	plugins: [],
};
