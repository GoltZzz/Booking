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

const sendBookingConfirmation = (booking, user) => {
	if (!isMailgunConfigured) {
		console.warn("Mailgun not configured. Skipping email notification.");
		return Promise.resolve();
	}

	// Use the direct approach from Sfas project
	const data = {
		from: user.email, // Set the user's email directly as the sender
		to: user.email,
		subject: "Your Booking Request Confirmation",
		text: `Dear ${user.name}, Thank you for submitting your booking request. We have received your request and it is currently being reviewed.`,
		html: `
      <h2>Booking Request Confirmation</h2>
      <p>Dear ${user.name},</p>
      <p>Thank you for submitting your booking request. We have received your request and it is currently being reviewed.</p>
      <p><strong>Booking Details:</strong></p>
      <ul>
        <li>Event Type: ${booking.eventType}</li>
        <li>Date: ${new Date(booking.eventDate).toLocaleDateString()}</li>
        <li>Status: Pending</li>
      </ul>
      <p>We will notify you once your booking has been confirmed.</p>
      <p>Best regards,<br>The Booking Team</p>
    `,
	};

	return mg.messages().send(data);
};

const sendNewBookingNotification = (booking, user, adminEmail) => {
	if (!isMailgunConfigured) {
		console.warn("Mailgun not configured. Skipping email notification.");
		return Promise.resolve();
	}

	const data = {
		from: user.email, // Set the user's email directly as the sender
		to: adminEmail,
		subject: `New Booking Request from ${user.name} <${user.email}>`,
		text: `A new booking request has been submitted by ${user.name}. Email: ${
			user.email
		}. Event Type: ${booking.eventType}. Date: ${new Date(
			booking.eventDate
		).toLocaleDateString()}. Special Request: ${
			booking.specialRequest || "None"
		}.`,
		html: `
      <h2>New Booking Request</h2>
      <p style="font-weight: bold; color: #4a5568; font-size: 16px;">From: ${
				user.name
			} &lt;${user.email}&gt;</p>
      <p>A new booking request has been submitted.</p>
      <p><strong>Customer Information:</strong></p>
      <ul>
        <li>Name: ${user.name}</li>
        <li>Email: ${user.email}</li>
      </ul>
      <p><strong>Booking Details:</strong></p>
      <ul>
        <li>Event Type: ${booking.eventType}</li>
        <li>Date: ${new Date(booking.eventDate).toLocaleDateString()}</li>
        <li>Special Request: ${booking.specialRequest || "None"}</li>
      </ul>
      <p>Please log in to the admin dashboard to review this booking.</p>
    `,
	};

	return mg.messages().send(data);
};

const sendBookingStatusUpdate = (booking, user) => {
	if (!isMailgunConfigured) {
		console.warn("Mailgun not configured. Skipping email notification.");
		return Promise.resolve();
	}

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
      <h2>Booking Confirmation</h2>
      <p>Dear ${user.name},</p>
      <p>We're pleased to inform you that your booking has been confirmed!</p>
      <p><strong>Booking Details:</strong></p>
      <ul>
        <li>Event Type: ${booking.eventType}</li>
        <li>Date: ${new Date(booking.eventDate).toLocaleDateString()}</li>
        <li>Status: Confirmed</li>
      </ul>
      <p>If you need to make any changes to your booking, please contact us.</p>
      <p>We look forward to seeing you!</p>
      <p>Best regards,<br>The Booking Team</p>
    `,
	};

	return mg.messages().send(data);
};

module.exports = {
	sendBookingConfirmation,
	sendNewBookingNotification,
	sendBookingStatusUpdate,
};
