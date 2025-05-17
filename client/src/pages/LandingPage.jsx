import { useState } from "react";
import { Link } from "react-router-dom";
import {
	FiSearch,
	FiStar,
	FiMapPin,
	FiCalendar,
	FiCamera,
} from "react-icons/fi";
import LogoImage from "../assets/images/Logo.jpg";
import BirthdayImage from "../assets/images/birthday.jpg";
import WeddingImage from "../assets/images/wedding pre-nup.jpg";
import DebutImage from "../assets/images/debut.jpg";
import MaternityImage from "../assets/images/maternity.jpg";
import MainNavbar from "../components/MainNavbar";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
	const [searchData, setSearchData] = useState({
		location: "",
		date: "",
		service: "",
	});
	const { isAuthenticated } = useAuth();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setSearchData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSearch = (e) => {
		e.preventDefault();
		console.log("Search data:", searchData);
	};

	const featuredListings = [
		{
			id: 1,
			title: "Birthday Photoshoot",
			location: "MJ Studios, City of Santiago",
			rating: 4.9,
			reviewCount: 124,
			price: 150,
			image: BirthdayImage,
		},
		{
			id: 2,
			title: "Wedding Pre-nup Photography",
			location: "MJ Studios, City of Santiago",
			rating: 4.8,
			reviewCount: 98,
			price: 175,
			image: WeddingImage,
		},
		{
			id: 3,
			title: "Debut Photoshoot",
			location: "MJ Studios, City of Santiago",
			rating: 4.95,
			reviewCount: 156,
			price: 180,
			image: DebutImage,
		},
		{
			id: 4,
			title: "Maternity Photoshoot",
			location: "MJ Studios, City of Santiago",
			rating: 4.85,
			reviewCount: 112,
			price: 160,
			image: MaternityImage,
		},
	];

	// Mock data for testimonials
	const testimonials = [
		{
			id: 1,
			content:
				"The studio was perfect for our family photoshoot. Great lighting and the host was very professional!",
			author: "Emily Johnson",
			role: "Family Portraits",
			avatar: "https://randomuser.me/api/portraits/women/32.jpg",
		},
		{
			id: 2,
			content:
				"As a professional photographer, I'm picky about studios. This one exceeded my expectations for a client shoot.",
			author: "Michael Rodriguez",
			role: "Professional Photographer",
			avatar: "https://randomuser.me/api/portraits/men/41.jpg",
		},
		{
			id: 3,
			content:
				"I booked this space for product photography and it had everything I needed. Will definitely book again!",
			author: "Sarah Thompson",
			role: "E-commerce Business Owner",
			avatar: "https://randomuser.me/api/portraits/women/54.jpg",
		},
	];

	return (
		<div className="landing-page bg-[#121212]">
			<MainNavbar />

			<section
				className="relative h-[600px] bg-cover bg-center"
				style={{
					backgroundImage:
						"url('https://images.unsplash.com/photo-1554941829-202a0b2403b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')",
				}}>
				<div className="absolute inset-0 bg-[#121212] bg-opacity-80"></div>
				<div className="container-custom relative z-1 h-full flex flex-col justify-center items-center text-center">
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#e0e0e0]">
						Book Your Perfect Photoshoot
					</h1>
					<p className="text-xl md:text-2xl max-w-2xl mb-8 text-gray-300">
						Find and book the perfect studio space or photographer for your next
						photoshoot
					</p>

					<form
						onSubmit={handleSearch}
						className="w-full max-w-4xl bg-[#1e1e1e] rounded-lg shadow-xl overflow-hidden border border-[#333333]">
						<div className="flex flex-col md:flex-row">
							<div className="flex-1 border-b md:border-b-0 md:border-r border-[#333333]">
								<div className="flex items-center px-6 py-4">
									<FiMapPin className="text-[#bb86fc] mr-3" size={20} />
									<input
										type="text"
										name="location"
										placeholder="Where are you looking to shoot?"
										className="w-full outline-none text-[#e0e0e0] bg-transparent placeholder-gray-500"
										value={searchData.location}
										onChange={handleInputChange}
									/>
								</div>
							</div>

							<div className="flex-1 border-b md:border-b-0 md:border-r border-[#333333]">
								<div className="flex items-center px-6 py-4">
									<FiCalendar className="text-[#bb86fc] mr-3" size={20} />
									<input
										type="text"
										name="date"
										placeholder="When do you need it?"
										className="w-full outline-none text-[#e0e0e0] bg-transparent placeholder-gray-500"
										value={searchData.date}
										onChange={handleInputChange}
									/>
								</div>
							</div>

							<div className="flex-1">
								<div className="flex items-center px-6 py-4">
									<FiCamera className="text-[#bb86fc] mr-3" size={20} />
									<input
										type="text"
										name="service"
										placeholder="What type of photoshoot?"
										className="w-full outline-none text-[#e0e0e0] bg-transparent placeholder-gray-500"
										value={searchData.service}
										onChange={handleInputChange}
									/>
								</div>
							</div>

							<button
								type="submit"
								className="bg-[#bb86fc] text-[#121212] px-8 md:px-6 py-4 flex items-center justify-center hover:bg-[#a06cd5] transition-colors">
								<FiSearch size={20} />
								<span className="ml-2 hidden md:inline">Search</span>
							</button>
						</div>
					</form>
				</div>
			</section>

			<section className="py-16 bg-[#121212]">
				<div className="container-custom">
					<div className="mb-10">
						<h2 className="text-3xl font-bold mb-2 text-[#e0e0e0]">
							Photography Categories
						</h2>
						<p className="text-gray-400">
							Explore our specialized photoshoot services for every occasion
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
						{featuredListings.map((listing) => (
							<div
								key={listing.id}
								className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-md transition-transform duration-300 hover:-translate-y-2 border border-[#333333]">
								<div className="relative h-60">
									<img
										src={listing.image}
										alt={listing.title}
										className="w-full h-full object-cover"
									/>
								</div>
								<div className="p-4">
									<div className="flex justify-between items-start mb-2">
										<h3 className="font-semibold text-lg text-[#e0e0e0]">
											{listing.title}
										</h3>
										<div className="flex items-center">
											<FiStar className="text-[#bb86fc] mr-1" size={16} />
											<span className="text-sm text-gray-300">
												{listing.rating}
											</span>
										</div>
									</div>
									<div className="flex items-center text-gray-400 mb-3">
										<FiMapPin size={14} className="mr-1" />
										<span className="text-sm">{listing.location}</span>
									</div>
									<div className="text-sm text-gray-400 mb-3">
										<span className="text-[#bb86fc] font-bold">
											₱{listing.price}
										</span>{" "}
										/ session
									</div>
									<Link
										to="/booking"
										className="block text-center py-2 px-4 border border-[#bb86fc] text-[#bb86fc] rounded-md hover:bg-[#bb86fc] hover:text-[#121212] transition-colors">
										Book Now
									</Link>
								</div>
							</div>
						))}
					</div>

					<div className="mt-12 text-center">
						<Link
							to="/explore"
							className="bg-[#bb86fc] text-[#121212] px-8 py-3 rounded-md hover:bg-[#a06cd5] transition-colors">
							Book a Session
						</Link>
					</div>
				</div>
			</section>

			<section className="py-16 bg-[#1e1e1e]">
				<div className="container-custom">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold mb-3 text-[#e0e0e0]">
							How It Works
						</h2>
						<p className="text-gray-400 max-w-2xl mx-auto">
							Book your perfect photography space in just a few simple steps
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="text-center px-4">
							<div className="w-16 h-16 bg-[#bb86fc] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
								<FiSearch className="text-[#bb86fc]" size={24} />
							</div>
							<h3 className="text-xl font-semibold mb-2 text-[#e0e0e0]">
								Search
							</h3>
							<p className="text-gray-400">
								Browse through our wide selection of photography spaces and
								filter by your specific needs.
							</p>
						</div>

						<div className="text-center px-4">
							<div className="w-16 h-16 bg-[#bb86fc] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
								<FiCalendar className="text-[#bb86fc]" size={24} />
							</div>
							<h3 className="text-xl font-semibold mb-2 text-[#e0e0e0]">
								Book
							</h3>
							<p className="text-gray-400">
								Select your desired date and time, and book instantly with our
								secure payment system.
							</p>
						</div>

						<div className="text-center px-4">
							<div className="w-16 h-16 bg-[#bb86fc] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
								<FiCamera className="text-[#bb86fc]" size={24} />
							</div>
							<h3 className="text-xl font-semibold mb-2 text-[#e0e0e0]">
								Shoot
							</h3>
							<p className="text-gray-400">
								Arrive at your booked space and create amazing photos in a
								professional environment.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 bg-[#121212]">
				<div className="container-custom">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold mb-3 text-[#e0e0e0]">
							What Our Customers Say
						</h2>
						<p className="text-gray-400 max-w-2xl mx-auto">
							Hear from photographers and clients who have used our platform
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{testimonials.map((testimonial) => (
							<div
								key={testimonial.id}
								className="bg-[#1e1e1e] rounded-xl p-6 shadow-md border border-[#333333]">
								<div className="mb-4">
									{[...Array(5)].map((_, i) => (
										<FiStar
											key={i}
											className="inline-block text-[#bb86fc]"
											size={18}
										/>
									))}
								</div>
								<p className="text-gray-300 mb-6">"{testimonial.content}"</p>
								<div className="flex items-center">
									<img
										src={testimonial.avatar}
										alt={testimonial.author}
										className="w-12 h-12 rounded-full mr-4"
									/>
									<div>
										<h4 className="font-semibold text-[#e0e0e0]">
											{testimonial.author}
										</h4>
										<p className="text-sm text-gray-400">{testimonial.role}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="py-16 bg-[#03dac6]">
				<div className="container-custom text-center">
					<h2 className="text-3xl font-bold mb-4 text-[#121212]">
						Ready to Book Your Next Photoshoot?
					</h2>
					<p className="text-xl max-w-2xl mx-auto mb-8 text-[#121212]">
						Join thousands of photographers and clients who trust MJ Studios for
						their photography needs
					</p>
					{isAuthenticated ? (
						<Link
							to="/booking"
							className="inline-block bg-[#121212] text-[#e0e0e0] font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-[#2d2d2d] transition-colors">
							Book a Session Now
						</Link>
					) : (
						<Link
							to="/register"
							className="inline-block bg-[#121212] text-[#e0e0e0] font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-[#2d2d2d] transition-colors">
							Get Started Today
						</Link>
					)}
				</div>
			</section>

			<footer className="bg-[#1e1e1e] text-gray-400">
				<div className="container-custom py-12">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div>
							<div className="flex items-center mb-4">
								<img
									src={LogoImage}
									alt="MJ Studios Logo"
									className="h-10 w-auto mr-2"
								/>
								<h3 className="text-xl font-bold text-[#e0e0e0]">MJ Studios</h3>
							</div>
							<p className="text-gray-400">
								Find and book the perfect photography space for your next shoot.
							</p>
							<div className="mt-4">
								<p className="text-gray-400">Charles M.B Building</p>
								<p className="text-gray-400">Calao East, City of Santiago</p>
								<p className="text-gray-400">Isabela 3311</p>
								<p className="text-gray-400">Phone: 0939 808 9460</p>
								<p className="text-gray-400">Email: mjtuazon08@gmail.com</p>
							</div>
						</div>

						<div>
							<h4 className="text-lg font-semibold mb-4 text-[#e0e0e0]">
								Company
							</h4>
							<ul className="space-y-2">
								<li>
									<Link
										to="/about"
										className="text-gray-400 hover:text-[#bb86fc] transition-colors">
										About Us
									</Link>
								</li>
								<li>
									<Link
										to="/careers"
										className="text-gray-400 hover:text-[#bb86fc] transition-colors">
										Careers
									</Link>
								</li>
								<li>
									<Link
										to="/blog"
										className="text-gray-400 hover:text-[#bb86fc] transition-colors">
										Blog
									</Link>
								</li>
								<li>
									<Link
										to="/press"
										className="text-gray-400 hover:text-[#bb86fc] transition-colors">
										Press
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="text-lg font-semibold mb-4 text-[#e0e0e0]">
								Support
							</h4>
							<ul className="space-y-2">
								<li>
									<Link
										to="/help"
										className="text-gray-400 hover:text-[#bb86fc] transition-colors">
										Help Center
									</Link>
								</li>
								<li>
									<Link
										to="/contact"
										className="text-gray-400 hover:text-[#bb86fc] transition-colors">
										Contact Us
									</Link>
								</li>
								<li>
									<Link
										to="/safety"
										className="text-gray-400 hover:text-[#bb86fc] transition-colors">
										Safety Information
									</Link>
								</li>
								<li>
									<Link
										to="/accessibility"
										className="text-gray-400 hover:text-[#bb86fc] transition-colors">
										Accessibility
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="text-lg font-semibold mb-4 text-[#e0e0e0]">
								Legal
							</h4>
							<ul className="space-y-2">
								<li>
									<Link
										to="/terms"
										className="text-gray-400 hover:text-[#bb86fc] transition-colors">
										Terms of Service
									</Link>
								</li>
								<li>
									<Link
										to="/privacy"
										className="text-gray-400 hover:text-[#bb86fc] transition-colors">
										Privacy Policy
									</Link>
								</li>
								<li>
									<Link
										to="/cookies"
										className="text-gray-400 hover:text-[#bb86fc] transition-colors">
										Cookie Policy
									</Link>
								</li>
							</ul>
						</div>
					</div>

					<div className="border-t border-[#333333] mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
						<p className="text-gray-500 text-sm">
							© {new Date().getFullYear()} MJ Studios. All rights reserved.
						</p>
						<div className="flex space-x-6 mt-4 md:mt-0">
							<a
								href="#"
								className="text-gray-400 hover:text-[#bb86fc] transition-colors">
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true">
									<path
										fillRule="evenodd"
										d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
										clipRule="evenodd"></path>
								</svg>
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-[#bb86fc] transition-colors">
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true">
									<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
								</svg>
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-[#bb86fc] transition-colors">
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true">
									<path
										fillRule="evenodd"
										d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
										clipRule="evenodd"></path>
								</svg>
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default LandingPage;
