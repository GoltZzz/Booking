import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";
import LogoutButton from "./LogoutButton";
import LogoImage from "../assets/images/Logo.jpg";

const MainNavbar = () => {
	const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { isAuthenticated, user } = useAuth();
	const navigate = useNavigate();

	const openSignupModal = () => {
		setIsSignupModalOpen(true);
		setIsLoginModalOpen(false);
		setMobileMenuOpen(false);
	};

	const closeSignupModal = () => {
		setIsSignupModalOpen(false);
	};

	const openLoginModal = () => {
		setIsLoginModalOpen(true);
		setIsSignupModalOpen(false);
		setMobileMenuOpen(false);
	};

	const closeLoginModal = () => {
		setIsLoginModalOpen(false);
	};

	const handleAdminPortal = () => {
		navigate("/admin");
		setMobileMenuOpen(false);
	};

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	return (
		<>
			<header className="bg-[#1e1e1e] shadow-md sticky top-0 z-10">
				<div className="container-custom py-3 flex justify-between items-center">
					<Link to="/" className="flex items-center">
						<img
							src={LogoImage}
							alt="MJ Studios Logo"
							className="h-12 w-auto mr-3"
						/>
						<span className="text-xl font-bold text-[#e0e0e0]">MJ Studios</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-6">
						<Link
							to="/explore"
							className="font-medium text-gray-300 hover:text-[#bb86fc] transition-colors">
							Explore
						</Link>
						<Link
							to="/how-it-works"
							className="font-medium text-gray-300 hover:text-[#bb86fc] transition-colors">
							How it works
						</Link>

						{isAuthenticated ? (
							<>
								<Link
									to="/dashboard"
									className="font-medium text-gray-300 hover:text-[#bb86fc] transition-colors">
									<FiUser className="inline mr-1" />
									My Bookings
								</Link>

								{user && user.isAdmin && (
									<button
										onClick={handleAdminPortal}
										className="font-medium bg-[#bb86fc] text-[#121212] px-4 py-2 rounded-md hover:bg-[#a06cd5] transition-colors">
										Admin Portal
									</button>
								)}

								<LogoutButton className="font-medium text-gray-300 hover:text-[#bb86fc] transition-colors" />
							</>
						) : (
							<>
								<button
									onClick={openLoginModal}
									className="font-medium text-gray-300 hover:text-[#bb86fc] transition-colors">
									Sign in
								</button>
								<button
									onClick={openSignupModal}
									className="bg-[#bb86fc] text-[#121212] px-4 py-2 rounded-md hover:bg-[#a06cd5] transition-colors">
									Sign up
								</button>
							</>
						)}
					</nav>

					{/* Mobile Menu Button */}
					<button
						className="md:hidden text-gray-300"
						onClick={toggleMobileMenu}>
						{mobileMenuOpen ? (
							<FiX className="h-6 w-6" />
						) : (
							<FiMenu className="h-6 w-6" />
						)}
					</button>
				</div>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className="md:hidden bg-[#1e1e1e] border-t border-[#333333] py-4">
						<div className="container-custom flex flex-col space-y-4">
							<Link
								to="/explore"
								className="font-medium text-gray-300 hover:text-[#bb86fc] transition-colors py-2"
								onClick={() => setMobileMenuOpen(false)}>
								Explore
							</Link>
							<Link
								to="/how-it-works"
								className="font-medium text-gray-300 hover:text-[#bb86fc] transition-colors py-2"
								onClick={() => setMobileMenuOpen(false)}>
								How it works
							</Link>

							{isAuthenticated ? (
								<>
									<Link
										to="/dashboard"
										className="font-medium text-gray-300 hover:text-[#bb86fc] transition-colors py-2"
										onClick={() => setMobileMenuOpen(false)}>
										<FiUser className="inline mr-1" />
										My Bookings
									</Link>

									{user && user.isAdmin && (
										<button
											onClick={handleAdminPortal}
											className="font-medium bg-[#bb86fc] text-[#121212] px-4 py-2 rounded-md hover:bg-[#a06cd5] transition-colors text-left">
											Admin Portal
										</button>
									)}

									<LogoutButton
										className="font-medium text-gray-300 hover:text-[#bb86fc] transition-colors py-2 text-left"
										onLogoutComplete={() => setMobileMenuOpen(false)}
									/>
								</>
							) : (
								<>
									<button
										onClick={openLoginModal}
										className="font-medium text-gray-300 hover:text-[#bb86fc] transition-colors py-2 text-left">
										Sign in
									</button>
									<button
										onClick={openSignupModal}
										className="bg-[#bb86fc] text-[#121212] px-4 py-2 rounded-md hover:bg-[#a06cd5] transition-colors">
										Sign up
									</button>
								</>
							)}
						</div>
					</div>
				)}
			</header>

			{/* Modals */}
			<SignupModal isOpen={isSignupModalOpen} onClose={closeSignupModal} />
			<LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
		</>
	);
};

export default MainNavbar;
