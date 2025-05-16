import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { packageApi } from "../services/api";
import "../styles/Home.css";

const Home = () => {
	const [packages, setPackages] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPackages = async () => {
			try {
				const response = await packageApi.getPackages();
				setPackages(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching packages:", error);
				setLoading(false);
			}
		};

		fetchPackages();
	}, []);

	return (
		<div className="home">
			<section className="hero">
				<div className="hero-content">
					<h1>MJ Studios Photo Booth</h1>
					<p>Capture Unforgettable Moments at Your Next Event</p>
					<Link to="/booking" className="btn">
						Book Now
					</Link>
				</div>
			</section>

			<section className="about">
				<div className="container">
					<h2>About Our Photo Booth</h2>
					<p>
						MJ Studios offers premium photo booth experiences for all types of
						events. Our state-of-the-art booths are equipped with high-quality
						cameras and printers to ensure your memories are captured perfectly.
						Whether it's a wedding, birthday, corporate event, or any special
						occasion, we've got you covered!
					</p>
				</div>
			</section>

			<section className="packages">
				<div className="container">
					<h2>Our Packages</h2>

					{loading ? (
						<p>Loading packages...</p>
					) : (
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
					)}
				</div>
			</section>

			<section className="testimonials">
				<div className="container">
					<h2>What Our Clients Say</h2>
					<div className="testimonial-grid">
						<div className="testimonial">
							<p>
								"MJ Studios made our wedding day extra special. The photo booth
								was a hit with all our guests!"
							</p>
							<span>- Sarah & John</span>
						</div>
						<div className="testimonial">
							<p>
								"Professional service and high-quality photos. Would definitely
								book again!"
							</p>
							<span>- Corporate Event Planner</span>
						</div>
						<div className="testimonial">
							<p>
								"The props were amazing and the attendant was so helpful.
								Everyone had a blast!"
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
