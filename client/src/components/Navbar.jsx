import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Navbar.css";
import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";
import LogoutButton from "./LogoutButton";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
	const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const { isAuthenticated, user, getProfile } = useAuth();
	const [isAdmin, setIsAdmin] = useState(false);

	// Direct console log outside of useEffect to ensure it runs on every render
	console.log("NAVBAR RENDER - Auth state:", {
		isAuthenticated,
		user: user
			? {
					id: user.id,
					name: user.name,
					email: user.email,
					isAdmin: user.isAdmin,
			  }
			: "No user data",
	});

	// Fetch user profile on component mount and when authentication state changes
	useEffect(() => {
		console.log("NAVBAR EFFECT - Auth changed, fetching profile if needed");

		const fetchUserProfile = async () => {
			if (isAuthenticated) {
				console.log("NAVBAR - User is authenticated");
				try {
					// First check if user object already has admin status
					if (user && user.isAdmin !== undefined) {
						console.log("NAVBAR - Using existing user data:", user);
						setIsAdmin(user.isAdmin);
						console.log("NAVBAR - Set isAdmin to:", user.isAdmin);
					} else {
						// If not, fetch fresh profile data
						console.log("NAVBAR - Fetching fresh profile data");
						const result = await getProfile();
						console.log("NAVBAR - Profile API response:", result);
						if (result.success) {
							setIsAdmin(result.user && result.user.isAdmin);
							console.log(
								"NAVBAR - Set isAdmin to:",
								result.user && result.user.isAdmin
							);
						}
					}
				} catch (error) {
					console.error("NAVBAR - Error fetching user profile:", error);
				}
			} else {
				// Reset admin status when logged out
				console.log("NAVBAR - User not authenticated, resetting isAdmin");
				setIsAdmin(false);
			}
		};

		fetchUserProfile();
	}, [isAuthenticated, user, getProfile]);

	// Debug logs
	useEffect(() => {
		console.log("NAVBAR - Admin status changed:", {
			isAuthenticated,
			user: user
				? {
						id: user.id,
						name: user.name,
						email: user.email,
						isAdmin: user.isAdmin,
				  }
				: "No user data",
			isAdmin,
		});
	}, [isAuthenticated, user, isAdmin]);

	const openSignupModal = () => {
		setIsSignupModalOpen(true);
		setIsLoginModalOpen(false);
	};

	const closeSignupModal = () => {
		setIsSignupModalOpen(false);
	};

	const openLoginModal = () => {
		setIsLoginModalOpen(true);
		setIsSignupModalOpen(false);
	};

	const closeLoginModal = () => {
		setIsLoginModalOpen(false);
	};

	// Force admin check from user object as a backup
	const adminStatus = isAdmin || (user && user.isAdmin);

	// Log the final admin status determination
	console.log("NAVBAR - Final admin status:", adminStatus);

	return (
		<>
			<nav className="navbar">
				<div className="navbar-container">
					<Link to="/" className="navbar-logo">
						MJ Studios
					</Link>

					<div className="nav-menu">
						<Link to="/" className="nav-item">
							Home
						</Link>
						{isAuthenticated ? (
							<>
								<Link to="/dashboard" className="nav-item">
									My Bookings
								</Link>
								<Link to="/booking" className="nav-item">
									Book Now
								</Link>
								{adminStatus && (
									<Link to="/admin" className="nav-item admin-link">
										Admin Portal
									</Link>
								)}
								<LogoutButton className="nav-item logout-btn" />
							</>
						) : (
							<>
								<button onClick={openLoginModal} className="nav-item">
									Login
								</button>
								<button
									onClick={openSignupModal}
									className="nav-item register-btn">
									Register
								</button>
							</>
						)}
					</div>
				</div>
			</nav>

			<SignupModal isOpen={isSignupModalOpen} onClose={closeSignupModal} />
			<LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
		</>
	);
};

export default Navbar;
