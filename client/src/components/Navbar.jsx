import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/Navbar.css";

const Navbar = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	return (
		<nav className="navbar">
			<div className="navbar-container">
				<Link to="/" className="navbar-logo">
					MJ Studios
				</Link>

				<div className="nav-menu">
					<Link to="/" className="nav-item">
						Home
					</Link>
					{isLoggedIn ? (
						<>
							<Link to="/dashboard" className="nav-item">
								My Bookings
							</Link>
							<Link to="/booking" className="nav-item">
								Book Now
							</Link>
							<button
								className="nav-item logout-btn"
								onClick={() => setIsLoggedIn(false)}>
								Logout
							</button>
						</>
					) : (
						<>
							<Link to="/login" className="nav-item">
								Login
							</Link>
							<Link to="/register" className="nav-item">
								Register
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
