import prisma from '../config/prisma.js';

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
        return res.status(400).json({ message: 'Username is already taken' });
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

export { getUserProfile, updateUserProfile };
