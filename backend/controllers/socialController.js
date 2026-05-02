import prisma from '../config/prisma.js';

// @desc    Follow a user
// @route   POST /api/social/follow/:id
const followUser = async (req, res) => {
  const followingId = req.params.id;
  const followerId = req.user.id;

  if (followingId === followerId) {
    return res.status(400).json({ message: 'You cannot follow yourself' });
  }

  try {
    const follow = await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });
    res.status(201).json(follow);
  } catch (error) {
    res.status(400).json({ message: 'Already following or user not found' });
  }
};

// @desc    Unfollow a user
// @route   DELETE /api/social/unfollow/:id
const unfollowUser = async (req, res) => {
  const followingId = req.params.id;
  const followerId = req.user.id;

  try {
    await prisma.follow.delete({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });
    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Not following this user' });
  }
};

// @desc    Get user followers/following
// @route   GET /api/social/connections/:id
const getConnections = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        followers: {
          include: {
            follower: {
              select: { id: true, name: true, username: true, avatar: true }
            }
          }
        },
        following: {
          include: {
            following: {
              select: { id: true, name: true, username: true, avatar: true }
            }
          }
        }
      }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      followers: user.followers.map(f => f.follower),
      following: user.following.map(f => f.following)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching connections' });
  }
};

export { followUser, unfollowUser, getConnections };
