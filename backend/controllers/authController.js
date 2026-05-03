import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import generateToken from '../utils/generateToken.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Auth user & get token
// @route   POST /api/auth/login
const authUser = async (req, res) => {
  const { email: emailInput, password } = req.body;
  const email = emailInput.toLowerCase().trim();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: email, mode: 'insensitive' } },
        { username: { equals: emailInput.trim(), mode: 'insensitive' } }
      ]
    }
  });

  if (user) {
    if (!user.password) {
      return res.status(401).json({ message: 'Account exists via Social Login. Please use Google to login.' });
    }
    
    if (await bcrypt.compare(password, user.password)) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid password. Please try again.' });
    }
  } else {
    res.status(401).json({ message: 'User not found. Please Sign up first.' });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/signup
const registerUser = async (req, res) => {
  const { name, email: emailInput, password, username } = req.body;
  const email = emailInput.toLowerCase().trim();

  const userExists = await prisma.user.findFirst({ 
    where: { 
      email: { equals: email, mode: 'insensitive' } 
    } 
  });

  if (userExists) {
    res.status(400).json({ message: 'Email is already registered. Please login instead.' });
    return;
  }

  // Also check if username is taken
  if (username) {
    const usernameExists = await prisma.user.findUnique({ where: { username } });
    if (usernameExists) {
      res.status(400).json({ message: 'Username is already exists' });
      return;
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      username,
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
      user = await prisma.user.create({
        data: {
          name,
          email,
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

export { authUser, registerUser, googleAuth };
