const mailgun = require("mailgun-js");
require("dotenv").config();

// Check if Mailgun is configured
const isMailgunConfigured =
	process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN;

const mg = isMailgunConfigured
	? mailgun({
			apiKey: process.env.MAILGUN_API_KEY,
			domain: process.env.MAILGUN_DOMAIN,
	  })
	: null;

// Check if using a sandbox domain
const isSandboxDomain =
	process.env.MAILGUN_DOMAIN && process.env.MAILGUN_DOMAIN.includes("sandbox");

// List of authorized recipients for sandbox testing
// In production, this would be stored in your .env file or database
const AUTHORIZED_RECIPIENTS = [
	"humbledog01@gmail.com", // Add your own email here
	// Add other authorized emails here
];

/**
 * Check if recipient is authorized (only needed for sandbox domains)
 * @param {string} email - Email to check
 * @returns {boolean} - Whether email is authorized
 */
const isAuthorizedRecipient = (email) => {
	if (!isSandboxDomain) return true; // Only restrict emails on sandbox domains
	return AUTHORIZED_RECIPIENTS.includes(email);
};

const sendBookingConfirmation = (booking, user) => {
	if (!isMailgunConfigured) {
		console.warn("Mailgun not configured. Skipping email notification.");
		return Promise.resolve({ skipped: true, reason: "Mailgun not configured" });
	}

	// Check if recipient is authorized (for sandbox domains)
	if (!isAuthorizedRecipient(user.email)) {
		console.warn(
			`⚠️ Cannot send email to ${user.email} - Not authorized for sandbox domain. Add this email to AUTHORIZED_RECIPIENTS list.`
		);
		return Promise.resolve({
			skipped: true,
			reason: "Email not authorized for sandbox domain",
			mailgunRestriction: true,
		});
	}

	// Format date in a user-friendly way
	const formattedDate = new Date(booking.eventDate).toLocaleDateString(
		"en-US",
		{
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		}
	);

	// Use the direct approach from Sfas project
	const data = {
		from: "MJ Studios Booking <booking@mjstudios.com>", // Use business email for professional appearance
		to: user.email,
		subject: "Your Booking Request Confirmation",
		text: `Dear ${user.name}, Thank you for submitting your booking request. We have received your request and it is currently being reviewed.`,
		html: `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Booking Request Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica', 'Arial', sans-serif; line-height: 1.6; background-color: #f5f5f5; color: #333333;">
	<!-- Header with Logo -->
	<table width="100%" cellpadding="0" cellspacing="0" border="0">
		<tr>
			<td style="background-color: #121212; padding: 20px; text-align: center;">
				<img src="https://i.ibb.co/DkDXbwH/Logo.jpg" alt="MJ Studios Logo" style="max-height: 60px; max-width: 200px;">
				<h1 style="color: #e0e0e0; margin: 10px 0 0; font-size: 24px;">MJ Studios</h1>
			</td>
		</tr>
	</table>

	<!-- Main Content -->
	<table width="100%" cellpadding="0" cellspacing="0" border="0">
		<tr>
			<td style="padding: 20px;">
				<table width="600px" cellpadding="0" cellspacing="0" border="0" align="center" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden; margin: 0 auto;">
					<!-- Hero Section with Background Image -->
					<tr>
						<td style="background-image: url('https://images.unsplash.com/photo-1554941829-202a0b2403b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'); background-size: cover; background-position: center; position: relative; height: 200px;">
							<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(18, 18, 18, 0.7);"></div>
							<table width="100%" height="200px" cellpadding="0" cellspacing="0" border="0">
								<tr>
									<td align="center" valign="middle">
										<h2 style="color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; position: relative; z-index: 1;">Booking Request Confirmation</h2>
									</td>
								</tr>
							</table>
						</td>
					</tr>

					<!-- Content Section -->
					<tr>
						<td style="padding: 30px;">
							<p style="margin-top: 0; font-size: 16px;">Dear ${user.name},</p>
							<p style="font-size: 16px;">Thank you for submitting your booking request with MJ Studios. We have received your request and it is currently being reviewed by our team.</p>

							<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9f9f9; border-radius: 8px; margin: 20px 0; border-left: 4px solid #bb86fc;">
								<tr>
									<td style="padding: 20px;">
										<h3 style="margin-top: 0; color: #333333; font-size: 18px;">Booking Details</h3>
										<table width="100%" cellpadding="5" cellspacing="0" border="0">
											<tr>
												<td width="40%" style="font-weight: bold; color: #555555;">Event Type:</td>
												<td style="color: #333333;">${booking.eventType}</td>
											</tr>
											<tr>
												<td width="40%" style="font-weight: bold; color: #555555;">Date:</td>
												<td style="color: #333333;">${formattedDate}</td>
											</tr>
											<tr>
												<td width="40%" style="font-weight: bold; color: #555555;">Status:</td>
												<td><span style="background-color: #fff6dd; color: #daa520; padding: 4px 8px; border-radius: 20px; font-size: 12px; font-weight: bold;">Pending</span></td>
											</tr>
											${
												booking.specialRequest
													? `
											<tr>
												<td width="40%" style="font-weight: bold; color: #555555;">Special Request:</td>
												<td style="color: #333333;">${booking.specialRequest}</td>
											</tr>
											`
													: ""
											}
										</table>
									</td>
								</tr>
							</table>

							<p style="font-size: 16px;">We will notify you once your booking has been confirmed. Our team aims to review your request within 24 hours.</p>
							<p style="font-size: 16px;">If you have any questions or need to update your request details, please contact us at <a href="mailto:mjtuazon08@gmail.com" style="color: #bb86fc; text-decoration: none;">mjtuazon08@gmail.com</a> or call us at <strong>0939 808 9460</strong>.</p>
							<p style="font-size: 16px; margin-bottom: 0;">Thank you for choosing MJ Studios!</p>
						</td>
					</tr>

					<!-- CTA Button -->
					<tr>
						<td style="padding: 0 30px 30px; text-align: center;">
							<a href="${
								process.env.CLIENT_URL || "http://localhost:3000"
							}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #bb86fc; color: #121212; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">View Your Booking</a>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>

	<!-- Footer -->
	<table width="100%" cellpadding="0" cellspacing="0" border="0">
		<tr>
			<td style="background-color: #1e1e1e; padding: 30px; text-align: center;">
				<p style="color: #e0e0e0; margin: 0 0 10px; font-size: 14px;">MJ Studios | Professional Photo Booth Services</p>
				<p style="color: #9e9e9e; margin: 0 0 5px; font-size: 12px;">Charles M.B Building, Calao East, City of Santiago, Isabela 3311</p>
				<p style="color: #9e9e9e; margin: 0 0 15px; font-size: 12px;">Phone: 0939 808 9460 | Email: mjtuazon08@gmail.com</p>
				<p style="color: #9e9e9e; margin: 0; font-size: 12px;">&copy; ${new Date().getFullYear()} MJ Studios. All rights reserved.</p>
			</td>
		</tr>
	</table>
</body>
</html>
    `,
	};

	console.log(`Attempting to send booking confirmation email to ${user.email}`);

	return mg
		.messages()
		.send(data)
		.then((result) => {
			console.log(`Email sent successfully! Message ID: ${result.id}`);
			return result;
		})
		.catch((error) => {
			console.error("Error sending confirmation email:", error);
			throw error;
		});
};

const sendNewBookingNotification = (booking, user, adminEmail) => {
	if (!isMailgunConfigured) {
		console.warn("Mailgun not configured. Skipping email notification.");
		return Promise.resolve({ skipped: true, reason: "Mailgun not configured" });
	}

	// Check if recipient is authorized (for sandbox domains)
	if (!isAuthorizedRecipient(adminEmail)) {
		console.warn(
			`⚠️ Cannot send email to ${adminEmail} - Not authorized for sandbox domain. Add this email to AUTHORIZED_RECIPIENTS list.`
		);
		return Promise.resolve({
			skipped: true,
			reason: "Email not authorized for sandbox domain",
			mailgunRestriction: true,
		});
	}

	// Format date in a user-friendly way
	const formattedDate = new Date(booking.eventDate).toLocaleDateString(
		"en-US",
		{
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		}
	);

	const data = {
		from: "MJ Studios Booking <booking@mjstudios.com>", // Use business email for professional appearance
		to: adminEmail,
		subject: `New Booking Request from ${user.name}`,
		text: `A new booking request has been submitted by ${user.name}. Email: ${
			user.email
		}. Event Type: ${booking.eventType}. Date: ${new Date(
			booking.eventDate
		).toLocaleDateString()}. Special Request: ${
			booking.specialRequest || "None"
		}.`,
		html: `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>New Booking Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica', 'Arial', sans-serif; line-height: 1.6; background-color: #f5f5f5; color: #333333;">
	<!-- Header with Logo -->
	<table width="100%" cellpadding="0" cellspacing="0" border="0">
		<tr>
			<td style="background-color: #121212; padding: 20px; text-align: center;">
				<img src="https://i.ibb.co/DkDXbwH/Logo.jpg" alt="MJ Studios Logo" style="max-height: 60px; max-width: 200px;">
				<h1 style="color: #e0e0e0; margin: 10px 0 0; font-size: 24px;">MJ Studios</h1>
			</td>
		</tr>
	</table>

	<!-- Main Content -->
	<table width="100%" cellpadding="0" cellspacing="0" border="0">
		<tr>
			<td style="padding: 20px;">
				<table width="600px" cellpadding="0" cellspacing="0" border="0" align="center" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden; margin: 0 auto;">
					<!-- Hero Section with Accent Color -->
					<tr>
						<td style="background-color: #bb86fc; padding: 30px; text-align: center;">
							<h2 style="color: #121212; font-size: 24px; font-weight: bold; margin: 0;">New Booking Request</h2>
							<p style="color: #121212; font-size: 16px; margin: 10px 0 0;">Action required: Please review and confirm</p>
						</td>
					</tr>

					<!-- Customer Info Section -->
					<tr>
						<td style="padding: 30px 30px 15px;">
							<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9f9f9; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
								<tr>
									<td>
										<h3 style="margin-top: 0; color: #333333; font-size: 18px;">Customer Information</h3>
										<table width="100%" cellpadding="5" cellspacing="0" border="0">
											<tr>
												<td width="30%" style="font-weight: bold; color: #555555;">Name:</td>
												<td style="color: #333333;">${user.name}</td>
											</tr>
											<tr>
												<td width="30%" style="font-weight: bold; color: #555555;">Email:</td>
												<td style="color: #333333;">${user.email}</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>

							<h3 style="color: #333333; font-size: 18px; margin-bottom: 15px;">Booking Details</h3>
							<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9f9f9; border-radius: 8px; border-left: 4px solid #bb86fc;">
								<tr>
									<td style="padding: 20px;">
										<table width="100%" cellpadding="5" cellspacing="0" border="0">
											<tr>
												<td width="40%" style="font-weight: bold; color: #555555;">Event Type:</td>
												<td style="color: #333333;">${booking.eventType}</td>
											</tr>
											<tr>
												<td width="40%" style="font-weight: bold; color: #555555;">Date:</td>
												<td style="color: #333333;">${formattedDate}</td>
											</tr>
											<tr>
												<td width="40%" style="font-weight: bold; color: #555555;">Status:</td>
												<td><span style="background-color: #fff6dd; color: #daa520; padding: 4px 8px; border-radius: 20px; font-size: 12px; font-weight: bold;">Pending</span></td>
											</tr>
											<tr>
												<td width="40%" style="font-weight: bold; color: #555555; vertical-align: top;">Special Request:</td>
												<td style="color: #333333;">${booking.specialRequest || "None"}</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>

					<!-- Admin Actions -->
					<tr>
						<td style="padding: 0 30px 30px; text-align: center;">
							<p style="font-size: 16px; margin-bottom: 20px;">Please review this booking request and take appropriate action.</p>
							<a href="${
								process.env.CLIENT_URL || "http://localhost:3000"
							}/admin/bookings" style="display: inline-block; padding: 12px 24px; background-color: #bb86fc; color: #121212; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">Go to Admin Dashboard</a>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>

	<!-- Footer -->
	<table width="100%" cellpadding="0" cellspacing="0" border="0">
		<tr>
			<td style="background-color: #1e1e1e; padding: 30px; text-align: center;">
				<p style="color: #e0e0e0; margin: 0 0 10px; font-size: 14px;">MJ Studios | Professional Photo Booth Services</p>
				<p style="color: #9e9e9e; margin: 0 0 5px; font-size: 12px;">Charles M.B Building, Calao East, City of Santiago, Isabela 3311</p>
				<p style="color: #9e9e9e; margin: 0 0 15px; font-size: 12px;">Phone: 0939 808 9460 | Email: mjtuazon08@gmail.com</p>
				<p style="color: #9e9e9e; margin: 0; font-size: 12px;">&copy; ${new Date().getFullYear()} MJ Studios. All rights reserved.</p>
			</td>
		</tr>
	</table>
</body>
</html>
    `,
	};

	console.log(`Attempting to send notification email to admin (${adminEmail})`);

	return mg
		.messages()
		.send(data)
		.then((result) => {
			console.log(
				`Admin notification email sent successfully! Message ID: ${result.id}`
			);
			return result;
		})
		.catch((error) => {
			console.error("Error sending admin notification email:", error);
			throw error;
		});
};

const sendBookingStatusUpdate = (booking, user) => {
	if (!isMailgunConfigured) {
		console.warn("Mailgun not configured. Skipping email notification.");
		return Promise.resolve({ skipped: true, reason: "Mailgun not configured" });
	}

	// Check if recipient is authorized (for sandbox domains)
	if (!isAuthorizedRecipient(user.email)) {
		console.warn(
			`⚠️ Cannot send email to ${user.email} - Not authorized for sandbox domain. Add this email to AUTHORIZED_RECIPIENTS list.`
		);
		console.warn(
			`To fix this: Log into Mailgun and add ${user.email} as an authorized recipient for your sandbox domain.`
		);
		return Promise.resolve({
			skipped: true,
			reason: "Email not authorized for sandbox domain",
			mailgunRestriction: true,
		});
	}

	// Format date in a user-friendly way
	const formattedDate = new Date(booking.eventDate).toLocaleDateString(
		"en-US",
		{
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		}
	);

	const data = {
		from: "MJ Studios Booking <booking@mjstudios.com>", // For status updates, use a business email
		to: user.email,
		subject: "Your Booking Has Been Confirmed",
		text: `Dear ${
			user.name
		}, We're pleased to inform you that your booking has been confirmed! Event Type: ${
			booking.eventType
		}. Date: ${new Date(booking.eventDate).toLocaleDateString()}.`,
		html: `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Booking Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica', 'Arial', sans-serif; line-height: 1.6; background-color: #f5f5f5; color: #333333;">
	<!-- Header with Logo -->
	<table width="100%" cellpadding="0" cellspacing="0" border="0">
		<tr>
			<td style="background-color: #121212; padding: 20px; text-align: center;">
				<img src="https://i.ibb.co/DkDXbwH/Logo.jpg" alt="MJ Studios Logo" style="max-height: 60px; max-width: 200px;">
				<h1 style="color: #e0e0e0; margin: 10px 0 0; font-size: 24px;">MJ Studios</h1>
			</td>
		</tr>
	</table>

	<!-- Main Content -->
	<table width="100%" cellpadding="0" cellspacing="0" border="0">
		<tr>
			<td style="padding: 20px;">
				<table width="600px" cellpadding="0" cellspacing="0" border="0" align="center" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden; margin: 0 auto;">
					<!-- Hero Section with Background Image -->
					<tr>
						<td style="background-image: url('https://images.unsplash.com/photo-1532712938310-34cb3982ef74?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'); background-size: cover; background-position: center; position: relative; height: 200px;">
							<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(18, 18, 18, 0.7);"></div>
							<table width="100%" height="200px" cellpadding="0" cellspacing="0" border="0">
								<tr>
									<td align="center" valign="middle">
										<h2 style="color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; position: relative; z-index: 1;">Your Booking is Confirmed!</h2>
									</td>
								</tr>
							</table>
						</td>
					</tr>

					<!-- Content Section -->
					<tr>
						<td style="padding: 30px;">
							<p style="margin-top: 0; font-size: 16px;">Dear ${user.name},</p>
							<p style="font-size: 16px;">We're pleased to inform you that your booking with MJ Studios has been <strong>confirmed</strong>! We look forward to seeing you soon.</p>

							<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9f9f9; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
								<tr>
									<td style="padding: 20px;">
										<h3 style="margin-top: 0; color: #333333; font-size: 18px;">Booking Details</h3>
										<table width="100%" cellpadding="5" cellspacing="0" border="0">
											<tr>
												<td width="40%" style="font-weight: bold; color: #555555;">Event Type:</td>
												<td style="color: #333333;">${booking.eventType}</td>
											</tr>
											<tr>
												<td width="40%" style="font-weight: bold; color: #555555;">Date:</td>
												<td style="color: #333333;">${formattedDate}</td>
											</tr>
											<tr>
												<td width="40%" style="font-weight: bold; color: #555555;">Status:</td>
												<td><span style="background-color: #e8f5e9; color: #2e7d32; padding: 4px 8px; border-radius: 20px; font-size: 12px; font-weight: bold;">Confirmed</span></td>
											</tr>
											${
												booking.specialRequest
													? `
											<tr>
												<td width="40%" style="font-weight: bold; color: #555555;">Special Request:</td>
												<td style="color: #333333;">${booking.specialRequest}</td>
											</tr>
											`
													: ""
											}
										</table>
									</td>
								</tr>
							</table>

							<h3 style="color: #333333; font-size: 18px;">What's Next?</h3>
							<ol style="color: #333333; padding-left: 20px;">
								<li style="margin-bottom: 8px;">Mark your calendar for ${formattedDate}</li>
								<li style="margin-bottom: 8px;">Prepare for your photo session</li>
								<li style="margin-bottom: 8px;">Arrive at our studio 15 minutes before your appointment</li>
							</ol>

							<p style="font-size: 16px;">If you need to make any changes to your booking or have any questions, please contact us at <a href="mailto:mjtuazon08@gmail.com" style="color: #bb86fc; text-decoration: none;">mjtuazon08@gmail.com</a> or call us at <strong>0939 808 9460</strong>.</p>
							<p style="font-size: 16px; margin-bottom: 0;">We look forward to creating amazing photos with you!</p>
						</td>
					</tr>

					<!-- CTA Button -->
					<tr>
						<td style="padding: 0 30px 30px; text-align: center;">
							<a href="${
								process.env.CLIENT_URL || "http://localhost:3000"
							}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #4caf50; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">View Your Booking</a>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>

	<!-- Footer -->
	<table width="100%" cellpadding="0" cellspacing="0" border="0">
		<tr>
			<td style="background-color: #1e1e1e; padding: 30px; text-align: center;">
				<p style="color: #e0e0e0; margin: 0 0 10px; font-size: 14px;">MJ Studios | Professional Photo Booth Services</p>
				<p style="color: #9e9e9e; margin: 0 0 5px; font-size: 12px;">Charles M.B Building, Calao East, City of Santiago, Isabela 3311</p>
				<p style="color: #9e9e9e; margin: 0 0 15px; font-size: 12px;">Phone: 0939 808 9460 | Email: mjtuazon08@gmail.com</p>
				<p style="color: #9e9e9e; margin: 0; font-size: 12px;">&copy; ${new Date().getFullYear()} MJ Studios. All rights reserved.</p>
			</td>
		</tr>
	</table>
</body>
</html>
    `,
	};

	console.log(
		`Attempting to send booking confirmation email to ${user.email} for booking ID: ${booking._id}`
	);
	console.log(`Email will be sent from: ${data.from}`);

	return mg
		.messages()
		.send(data)
		.then((result) => {
			console.log(
				`✅ Status update email sent successfully! Message ID: ${result.id}`
			);
			console.log(`Message details: ${JSON.stringify(result)}`);
			return result;
		})
		.catch((error) => {
			console.error("❌ Error sending status update email:", error);
			if (error.details) {
				console.error("Error details:", error.details);
			}
			throw error;
		});
};

module.exports = {
	sendBookingConfirmation,
	sendNewBookingNotification,
	sendBookingStatusUpdate,
	isAuthorizedRecipient, // Export for testing
};
