import prisma from '../config/prisma.js';

// @desc    Create a new story
// @route   POST /api/stories
const createStory = async (req, res) => {
  const { mediaUrl } = req.body;

  try {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Expires in 24 hours

    const story = await prisma.story.create({
      data: {
        userId: req.user.id,
        mediaUrl,
        expiresAt,
      },
    });

    res.status(201).json(story);
  } catch (error) {
    res.status(400).json({ message: 'Error creating story' });
  }
};

// @desc    Get all active stories
// @route   GET /api/stories
const getStories = async (req, res) => {
  try {
    const now = new Date();
    const stories = await prisma.story.findMany({
      where: {
        expiresAt: {
          gt: now, // Only get stories that haven't expired
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Group stories by user (optional, for a bubble UI)
    const groupedStories = stories.reduce((acc, story) => {
      const userId = story.userId;
      if (!acc[userId]) {
        acc[userId] = {
          user: story.user,
          items: [],
        };
      }
      acc[userId].items.push(story);
      return acc;
    }, {});

    res.json(Object.values(groupedStories));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stories' });
  }
};

export { createStory, getStories };
