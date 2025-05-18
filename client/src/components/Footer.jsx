import "../styles/Footer.css";

const Footer = () => {
	return (
		<footer className="footer">
			<div className="footer-container">
				<div className="footer-section">
					<h3>MJ Studios</h3>
					<p>Professional Photo Booth Services for Every Occasion</p>
				</div>
				<div className="footer-section">
					<h3>Contact Us</h3>
					<p>Email: mjtuazon08@gmail.com</p>
					<p>Phone: 0939 808 9460</p>
					<p>
						Address: Charles M.B Building, Calao East, City of Santiago, Isabela
						3311
					</p>
				</div>
				<div className="footer-section">
					<h3>Follow Us</h3>
					<div className="social-links">
						<a href="#" target="_blank" rel="noopener noreferrer">
							Instagram
						</a>
						<a href="#" target="_blank" rel="noopener noreferrer">
							Facebook
						</a>
						<a href="#" target="_blank" rel="noopener noreferrer">
							Twitter
						</a>
					</div>
				</div>
			</div>
			<div className="footer-bottom">
				<p>
					&copy; {new Date().getFullYear()} MJ Studios. All rights reserved.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
