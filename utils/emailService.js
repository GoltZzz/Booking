const mailgun = require("mailgun-js");
require("dotenv").config();

const mg = mailgun({
	apiKey: process.env.MAILGUN_API_KEY,
	domain: process.env.MAILGUN_DOMAIN,
});
const sendBookingConfirmation = (booking, user) => {
	const data = {
		from: `MJ Studios <noreply@${process.env.MAILGUN_DOMAIN}>`,
		to: user.email,
		subject: "Your Photo Booth Booking Confirmation",
		html: `
      <h2>Booking Confirmation</h2>
      <p>Dear ${user.name},</p>
      <p>Thank you for booking a photo booth session with MJ Studios!</p>
      <p><strong>Booking Details:</strong></p>
      <ul>
        <li>Date: ${new Date(booking.bookingDate).toLocaleDateString()}</li>
        <li>Time: ${booking.startTime} - ${booking.endTime}</li>
        <li>Package: ${booking.packageType}</li>
        <li>Duration: ${booking.duration} hour(s)</li>
        <li>Total Price: ₱${booking.totalPrice}</li>
      </ul>
      <p>If you need to make any changes to your booking, please contact us.</p>
      <p>We look forward to seeing you!</p>
      <p>Best regards,<br>MJ Studios Team</p>
    `,
	};

	return mg.messages().send(data);
};
const sendBookingReminder = (booking, user) => {
	const data = {
		from: `MJ Studios <noreply@${process.env.MAILGUN_DOMAIN}>`,
		to: user.email,
		subject: "Reminder: Your Photo Booth Session Tomorrow",
		html: `
      <h2>Booking Reminder</h2>
      <p>Dear ${user.name},</p>
      <p>This is a friendly reminder about your photo booth session tomorrow.</p>
      <p><strong>Booking Details:</strong></p>
      <ul>
        <li>Date: ${new Date(booking.bookingDate).toLocaleDateString()}</li>
        <li>Time: ${booking.startTime} - ${booking.endTime}</li>
        <li>Package: ${booking.packageType}</li>
      </ul>
      <p>Our address: MJ Studios, Charles M.B Building, Calao East, City of Santiago, Isabela 3311</p>
      <p>We look forward to seeing you!</p>
      <p>Best regards,<br>MJ Studios Team</p>
    `,
	};

	return mg.messages().send(data);
};

module.exports = {
	sendBookingConfirmation,
	sendBookingReminder,
};
