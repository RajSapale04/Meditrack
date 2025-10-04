const passport= require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models/index');


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with Google ID
    let user = await User.findOne({ 
      where: { googleId: profile.id } 
    });
    
    if (user) {
      return done(null, user);
    }

    // Check if user exists with same email
    user = await User.findOne({ 
      where: { email: profile.emails[0].value.toLowerCase() } 
    });
    
    if (user) {
      // Link Google account to existing user
      await user.update({
        googleId: profile.id,
        avatar: profile.photos[0]?.value,
        provider: 'google',
      });
      return done(null, user);
    }

    // Create new user
    user = await User.create({
      googleId: profile.id,
      email: profile.emails[0].value.toLowerCase(),
      name: profile.displayName,
      avatar: profile.photos[0]?.value,
      provider: 'google',
    });

    return done(null, user);
  } catch (error) {
    console.error('Google OAuth error:', error);
    return done(error);
  }
}));

module.exports = passport;