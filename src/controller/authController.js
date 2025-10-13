const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const { validationResult } = require("express-validator");
const {
  prepareUserData,
  validateUserData,
  hashPassword,
  createUserResponse,
  validateLoginCredentials,
  comparePassword,
  generateTokens,
  generateResetToken,
} = require("../utilis/authUtilis");
const user = require("../models/user");
const { sendResetPasswordEmail } = require("../utilis/emailutils");
const client = require('../config/OAuth2');
const redirectToGoogle = (req, res) => {
  const scope = ["openid", "profile", "email"];
  const authorizeUrl = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scope,
    redirect_uri: "http://localhost:5000/api/auth/google/callback",
  });
  res.redirect(authorizeUrl);
};
const handleGoogleCallback = async (req, res, next) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.status(400).send("Missing code");
    }
    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience:
        "438068886409-db51m54rujs0gg0698eoh4si8b0qtu1l.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();
    const {
      email,
      picture,
      sub: googleId,
      given_name,
      family_name,
      email_verified,
    } = payload;
    let User = await user.findOne({ email: email.toLowerCase() });
    if (!User) {
      // Create new user
      User = new user({
        firstName: given_name,
        lastName: family_name,
        middleName: "",
        age: 0,
        gender: "other",
        email: email.toLowerCase(),
        password: "",
        photoUrl: picture,
        isGoogle: email_verified || false,
        googleId: googleId,
      });
      User.isGoogle = true;
      await User.save();
    }
    User.photoUrl = picture;
    await User.save();
    const { accessToken, refreshToken } = generateTokens(User._id, User.email);
    const hashedRefreshToken = await require("bcryptjs").hash(refreshToken, 12);
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await user.findByIdAndUpdate(User._id, {
      refreshToken: hashedRefreshToken,
      refreshTokenExpiresAt: refreshTokenExpiry,
      $push: {
        refreshTokens: {
          token: hashedRefreshToken,
          expiresAt: refreshTokenExpiry,
          deviceInfo: req.headers["user-agent"] || "unknown",
        },
      },
    });
    const userResponse = createUserResponse(User);
    return res.status(200).json({
      success: true,
      message: "Google SSO successful",
      data: {
        user: userResponse,
        accessToken,
        refreshToken,
        expiresIn: {
          accessToken: "15m",
          refreshToken: "7d",
        },
      },
    });
  } catch (error) {
    console.error("Google callback error", error);
    return next(error);
  }
};
const registerHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.status = 400;
      error.errors = errors.array();
      return next(error);
    }
    const userData = prepareUserData(req.body);
    const additionalErrors = validateUserData(userData);
    if (additionalErrors.length > 0) {
      const error = new Error("Validation failed");
      error.status = 400;
      error.errors = additionalErrors;
      return next(error);
    }
    const existinUser = await user.findOne({ email: userData.email });
    if (existinUser) {
      const error = new Error("User with this email already exists");
      error.status = 400;
      return next(error);
    }
    const hashedPassword = await hashPassword(userData.password);
    userData.password = hashedPassword;
    // Create new user
    const newUser = new user(userData);
    // Save user to database
    await newUser.save();
    // Return success response
    const userResponse = createUserResponse(newUser);
    res
      .status(201)
      .json({
        success: true,
        message: "User registered successfully",
        user: userResponse,
      });
  } catch (error) {
    console.error("Error during registration:", error);
    next(error);
  }
};
const loginHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.status = 400;
      error.errors = errors.array();
      return next(error);
    }
    const { email, password } = req.body;
    const additionalErrors = validateLoginCredentials(req.body);
    if (additionalErrors.length > 0) {
      const error = new Error("Validation failed");
      error.status = 400;
      error.errors = additionalErrors;
      return next(error);
    }
    const User = await user.findOne({ email: email.toLowerCase() });
    if (!User) {
      return res.send({
        success: false,
        message: "Invalid email or password",
      });
    }
    const isMatch = await comparePassword(password, User.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const { accessToken, refreshToken } = generateTokens(User._id, User.email);
    const hashedRefreshToken = await require("bcryptjs").hash(refreshToken, 12);
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await user.findByIdAndUpdate(User._id, {
      refreshToken: hashedRefreshToken,
      refreshTokenExpiresAt: refreshTokenExpiry,
      $push: {
        refreshTokens: {
          token: hashedRefreshToken,
          expiresAt: refreshTokenExpiry,
          deviceInfo: req.headers["user-agent"] || "unknown",
        },
      },
    });
    // Create login response with both tokens
    const userResponse = createUserResponse(User);
    const loginResponse = {
      user: userResponse,
      accessToken,
      refreshToken,
      expiresIn: {
        accessToken: "15m",
        refreshToken: "7d",
      },
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: loginResponse,
    });
  } catch (error) {
    next(error);
  }
};
const forgetPasswordHandler = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.status = 400;
      error.errors = errors.array();
      return next(error);
    }

    const { email, captchaToken } = req.body;
    const User = await user.findOne({ email: email.toLowerCase() });
    if (!User) {
      return res.status(200).json({
        success: true,
        message: "If an account exists, you will receive a password reset link shortly."
      });
    }

    // Generate reset token
    const { token, hashedToken, expiresAt } = generateResetToken();
    User.passwordResetToken = hashedToken;
    User.passwordResetExpires = new Date(expiresAt);
    await User.save();

    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${token}&email=${User.email}`;
    
    try {
      await sendResetPasswordEmail(User.email, resetLink);
      return res.status(200).json({
        success: true,
        message: "If an account exists, you will receive a password reset link shortly."
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return res.status(500).json({
        success: false,
        message: "Error sending reset email. Please try again later."
      });
    }

  } catch (error) {
    return next(error);
  }
};
const resetPasswordHandler = async (req, res, next) => {
     try{
         const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const error = new Error("Validation failed");
                error.status = 400;
                error.errors = errors.array();
                return next(error);
            }
            const {  email, newPassword } = req.body;
               const token = req.params.token;

        const User = await user.findOne({ email: email.toLowerCase() });
            if (!User || !User.passwordResetToken) {
            return res.status(400).json({ success: false, message: "Invalid or expired password reset token." });
        }
         // Hash token sent by user and compare
        const crypto = require("crypto");
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        if (hashedToken !== User.passwordResetToken || User.passwordResetExpires < Date.now()) {
            return res.status(400).json({ success: false, message: "Invalid or expired password reset token." });
        }
          User.password = await hashPassword(newPassword);
           // Clear reset token fields
        User.passwordResetToken = undefined;
        User.passwordResetExpires = undefined;
        User.refreshTokens = [];
        User.refreshToken = null;
        User.refreshTokenExpiresAt = null;

        await User.save();

        return res.status(200).json({ success: true, message: "Password reset successful. Please login with your new password." });    
     }
     catch(error){
        next(error);
     }
}
module.exports = {
  registerHandler,
  loginHandler,
  redirectToGoogle,
  handleGoogleCallback,
  forgetPasswordHandler,
  resetPasswordHandler
};
