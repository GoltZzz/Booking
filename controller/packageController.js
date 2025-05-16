const Package = require("../model/Package");

const getAllPackages = async (req, res) => {
	try {
		const packages = await Package.find({ isAvailable: true });
		res.json(packages);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getPackageById = async (req, res) => {
	try {
		const package = await Package.findById(req.params.id);

		if (!package) {
			return res.status(404).json({ error: "Package not found" });
		}

		res.json(package);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const createDefaultPackages = async () => {
	try {
		const count = await Package.countDocuments();

		if (count === 0) {
			const defaultPackages = [
				{
					name: "Basic",
					description: "Standard photo booth experience for 1 hour",
					price: 199,
					duration: 1,
					features: [
						"Unlimited photos",
						"Basic props",
						"Digital copies",
						"Online gallery",
					],
					isAvailable: true,
				},
				{
					name: "Standard",
					description: "Enhanced photo booth experience for 2 hours",
					price: 299,
					duration: 2,
					features: [
						"Unlimited photos",
						"Premium props",
						"Digital copies",
						"Online gallery",
						"Custom backdrop",
						"Social media sharing",
					],
					isAvailable: true,
				},
				{
					name: "Premium",
					description: "Ultimate photo booth experience for 3 hours",
					price: 399,
					duration: 3,
					features: [
						"Unlimited photos",
						"Premium props",
						"Digital copies",
						"Online gallery",
						"Custom backdrop",
						"Social media sharing",
						"Photo album",
						"On-site attendant",
						"Video messages",
					],
					isAvailable: true,
				},
			];

			await Package.insertMany(defaultPackages);
			console.log("Default packages created");
		}
	} catch (error) {
		console.error("Error creating default packages:", error);
	}
};

module.exports = {
	getAllPackages,
	getPackageById,
	createDefaultPackages,
};
