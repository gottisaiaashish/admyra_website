import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import generateToken from '../utils/generateToken.js';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Auth user & get token
// @route   POST /api/auth/login
const authUser = async (req, res) => {
  const { email: emailInput, password } = req.body;
  const email = emailInput.toLowerCase().trim();

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: emailInput.trim() },
          { username: email } // Also check lowercased version
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found. Check your email or signup again.' });
    }

    if (!user.password) {
      return res.status(401).json({ message: 'Account exists via Google. Please use Google Login.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (isMatch) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Incorrect password. If you reset it, please wait 2 mins for deploy.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/signup
const registerUser = async (req, res) => {
  const { name, email: emailInput, password, username } = req.body;
  const email = emailInput.toLowerCase().trim();

  const userExists = await prisma.user.findUnique({ where: { email } });

  if (userExists) {
    res.status(400).json({ message: 'Email is already registered. Please login instead.' });
    return;
  }

  // Username validation rules: small letters, numbers, and underscores only
  const usernameRegex = /^[a-z0-9_]+$/;
  if (username) {
    if (!usernameRegex.test(username)) {
      res.status(400).json({ message: 'Username can only contain small letters, numbers, and underscores (_). No spaces or special characters.' });
      return;
    }

    const usernameExists = await prisma.user.findUnique({ where: { username } });
    if (usernameExists) {
      res.status(400).json({ message: 'Username already taken. Please try another one.' });
      return;
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Special case for user request
  const finalUsername = email === 'teamadmyra@gmail.com' ? 'nani' : username;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      username: finalUsername,
      password: hashedPassword,
      bio: 'bio',
    },
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      token: generateToken(user.id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Auth with Google
const googleAuth = async (req, res) => {
  const { idToken, type } = req.body; // type: 'login' or 'signup'

  try {
    let name, email, picture, googleId;

    console.log('Received token:', idToken.substring(0, 10) + '...', 'Type:', idToken.includes('.') ? 'JWT' : 'Access Token');

    if (idToken.includes('.')) {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      name = payload.name;
      email = payload.email;
      picture = payload.picture;
      googleId = payload.sub;
    } else {
      const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${idToken}`);
      const data = response.data;
      if (!data.email) throw new Error('Invalid access token');
      name = data.name;
      email = data.email;
      picture = data.picture;
      googleId = data.sub;
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      if (type === 'login') {
        return res.status(404).json({ message: 'Account not found. Please Sign up first.' });
      }
      
      // Create user if it's a signup request
      // Generate a default username from email
      const defaultUsername = email.split('@')[0] + Math.floor(Math.random() * 1000);
      
      user = await prisma.user.create({
        data: {
          name,
          email,
          username: defaultUsername,
          googleId,
          avatar: picture,
          bio: 'bio',
        },
      });
    } else if (!user.googleId) {
      // Link google account if user exists but hasn't linked yet
      user = await prisma.user.update({
        where: { email },
        data: { googleId },
      });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error('Google Auth Error:', error.message);
    res.status(401).json({ message: 'Google auth failed' });
  }
};

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  const { identifier } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { username: identifier }
        ]
      }
    });

    if (!user) {
      res.status(404).json({ message: 'User not found with this email or username' });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: otp,
        resetPasswordExpires: otpExpiry
      }
    });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Admyra Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset OTP - Admyra',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #6366f1;">Password Reset Request</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>You requested to reset your password. Use the OTP below to proceed. This OTP is valid for 10 minutes.</p>
          <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1f2937; border-radius: 10px; margin: 20px 0;">
            ${otp}
          </div>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br/>Team Admyra</p>
        </div>
      `
    };

    console.log(`Attempting to send OTP to: ${user.email}`);
    
    // Send Email with 15s timeout
    await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Email sending timed out. Check SMTP credentials.')), 15000))
    ]);

    console.log(`OTP successfully sent to: ${user.email}`);
    res.json({ message: 'OTP sent to your registered email address' });
  } catch (error) {
    console.error('OTP Sending Error:', error);
    res.status(500).json({ message: `Error sending OTP: ${error.message}` });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
export const verifyOTP = async (req, res) => {
  const { identifier, otp } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { username: identifier }
        ],
        resetPasswordToken: otp,
        resetPasswordExpires: { gt: new Date() }
      }
    });
    if (!user) {
      res.status(400).json({ message: 'Invalid or expired OTP' });
      return;
    }
    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  const { identifier, otp, newPassword } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { username: identifier }
        ],
        resetPasswordToken: otp,
        resetPasswordExpires: { gt: new Date() }
      }
    });
    if (!user) {
      res.status(400).json({ message: 'Invalid or expired OTP session' });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });
    res.json({ message: 'Password reset successful. You can now login with your new password.' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password' });
  }
};

export { authUser, registerUser, googleAuth };
