import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';

// @desc    Get user profile
// @route   GET /api/users/profile/:id
const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatar: true,
        bio: true,
        createdAt: true,
        grievances: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        posts: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            _count: {
              select: { likes: true, comments: true }
            }
          }
        },
        likes: {
          select: { postId: true }
        },
        saves: {
          select: { postId: true }
        }
      },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateUserProfile = async (req, res) => {
  const { name, username, bio, avatar } = req.body;

  try {
    // Check if username is taken
    if (username) {
      const existingUser = await prisma.user.findUnique({ where: { username } });
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ message: 'Username is already exists' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || undefined,
        username: username || undefined,
        bio: bio !== undefined ? bio : undefined,
        avatar: avatar || undefined,
      },
    });

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.password) {
      return res.status(400).json({ message: 'User signed up via social login. Password cannot be changed this way.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password' });
  }
};

export { getUserProfile, updateUserProfile, changePassword };
