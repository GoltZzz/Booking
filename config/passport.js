const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../model/User");
require("dotenv").config();

passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
		},
		async (email, password, done) => {
			try {
				// Find the user by email
				const user = await User.findOne({ email });

				// If user doesn't exist
				if (!user) {
					return done(null, false, { message: "Incorrect email or password." });
				}

				// Check if password is correct
				const isMatch = await user.comparePassword(password);
				if (!isMatch) {
					return done(null, false, { message: "Incorrect email or password." });
				}

				// If credentials are valid, return the user
				return done(null, user);
			} catch (err) {
				return done(err);
			}
		}
	)
);

// Configure Google Strategy only if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: "/api/users/auth/google/callback",
				scope: ["profile", "email"],
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					// Check if user already exists with this Google ID
					let user = await User.findOne({ googleId: profile.id });

					if (user) {
						return done(null, user);
					}

					// Check if user exists with the same email
					user = await User.findOne({ email: profile.emails[0].value });

					if (user) {
						// Update existing user with Google info
						user.googleId = profile.id;
						user.authMethod = "google";
						if (
							!user.profilePicture &&
							profile.photos &&
							profile.photos.length > 0
						) {
							user.profilePicture = profile.photos[0].value;
						}
						await user.save();
						return done(null, user);
					}

					// Check if this is the first user being registered
					const userCount = await User.countDocuments();
					const isFirstUser = userCount === 0;

					// Create a new user
					const newUser = new User({
						name: profile.displayName,
						email: profile.emails[0].value,
						googleId: profile.id,
						profilePicture: profile.photos[0].value,
						authMethod: "google",
						isAdmin: isFirstUser, // First user gets admin privileges
					});

					await newUser.save();
					return done(null, newUser);
				} catch (err) {
					return done(err);
				}
			}
		)
	);
} else {
	console.log(
		"Google OAuth credentials not found. Google authentication is disabled."
	);
}

// Serialize user for the session
passport.serializeUser((user, done) => {
	done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (err) {
		done(err);
	}
});

module.exports = passport;
