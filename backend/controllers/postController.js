import prisma from '../config/prisma.js';

// @desc    Create a new post
// @route   POST /api/posts
const createPost = async (req, res) => {
  const { type, mediaUrl, caption, collegeTag } = req.body;

  try {
    const post = await prisma.post.create({
      data: {
        userId: req.user.id,
        type: type || 'photo',
        mediaUrl,
        caption,
        collegeTag,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: 'Error creating post' });
  }
};

// @desc    Like/Unlike a post
// @route   POST /api/posts/:id/like
const toggleLike = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_postId: { userId, postId },
        },
      });
      res.json({ liked: false });
    } else {
      await prisma.like.create({
        data: { userId, postId },
      });
      res.json({ liked: true });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error toggling like' });
  }
};

// @desc    Save/Unsave a post
// @route   POST /api/posts/:id/save
const toggleSave = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const existingSave = await prisma.save.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existingSave) {
      await prisma.save.delete({
        where: {
          userId_postId: { userId, postId },
        },
      });
      res.json({ saved: false });
    } else {
      await prisma.save.create({
        data: { userId, postId },
      });
      res.json({ saved: true });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error toggling save' });
  }
};

// @desc    Get posts by college tag (Gallery)
// @route   GET /api/posts/college/:tagName
const getPostsByCollege = async (req, res) => {
  const { tagName } = req.params;

  try {
    const posts = await prisma.post.findMany({
      where: { collegeTag: tagName },
      include: {
        user: {
          select: {
            name: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching college gallery' });
  }
};

// @desc    Get all posts for home feed
// @route   GET /api/posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            name: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: { likes: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching posts' });
  }
};

export { 
  createPost, 
  toggleLike, 
  toggleSave, 
  getPostsByCollege, 
  getAllPosts 
};
