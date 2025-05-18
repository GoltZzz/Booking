import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
	// Hardcoded packages instead of fetching them since we're focused on the booking system
	const packages = [
		{
			_id: "1",
			name: "Basic",
			price: 199,
			duration: 2,
			features: [
				"2-hour photo booth rental",
				"Unlimited prints",
				"Digital gallery",
				"Basic props",
			],
		},
		{
			_id: "2",
			name: "Standard",
			price: 299,
			duration: 3,
			features: [
				"3-hour photo booth rental",
				"Unlimited prints",
				"Digital gallery",
				"Premium props",
				"Custom backdrop",
			],
		},
		{
			_id: "3",
			name: "Premium",
			price: 399,
			duration: 4,
			features: [
				"4-hour photo booth rental",
				"Unlimited prints",
				"Digital gallery",
				"Premium props",
				"Custom backdrop",
				"Photo guest book",
				"USB with all images",
			],
		},
	];

	return (
		<div className="home">
			<section className="hero">
				<div className="hero-content">
					<h1>Event Booking System</h1>
					<p>Schedule and Manage Your Events with Ease</p>
					<Link to="/booking" className="btn">
						Book Now
					</Link>
				</div>
			</section>

			<section className="about">
				<div className="container">
					<h2>About Our Booking System</h2>
					<p>
						Our booking system makes it easy to schedule and manage events of
						all types. Whether you're planning a wedding, corporate event, or
						private party, our streamlined process ensures your event is
						organized perfectly. With real-time availability, email
						notifications, and a user-friendly interface, booking has never been
						easier!
					</p>
				</div>
			</section>

			<section className="packages">
				<div className="container">
					<h2>Our Packages</h2>
					<div className="package-grid">
						{packages.map((pkg) => (
							<div className="package-card" key={pkg._id}>
								<h3>{pkg.name}</h3>
								<p className="price">${pkg.price}</p>
								<p className="duration">{pkg.duration} hours</p>
								<ul className="features">
									{pkg.features.map((feature, index) => (
										<li key={index}>{feature}</li>
									))}
								</ul>
								<Link to="/booking" className="btn btn-outline">
									Select Package
								</Link>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="testimonials">
				<div className="container">
					<h2>What Our Clients Say</h2>
					<div className="testimonial-grid">
						<div className="testimonial">
							<p>
								"This booking system made our wedding planning so much easier!
								The email confirmations kept everyone on the same page."
							</p>
							<span>- Sarah & John</span>
						</div>
						<div className="testimonial">
							<p>
								"Professional service and an intuitive interface. Would
								definitely recommend!"
							</p>
							<span>- Corporate Event Planner</span>
						</div>
						<div className="testimonial">
							<p>
								"The booking process was seamless and the admin was very
								responsive to our requests."
							</p>
							<span>- Birthday Celebration</span>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;
