import prisma from '../config/prisma.js';

// @desc    Add a comment to a post or grievance
// @route   POST /api/comments
const addComment = async (req, res) => {
  const { text, postId, grievanceId } = req.body;

  try {
    const comment = await prisma.comment.create({
      data: {
        text,
        userId: req.user.id,
        postId: postId || undefined,
        grievanceId: grievanceId || undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          }
        }
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: 'Error adding comment' });
  }
};

// @desc    Get comments for a post or grievance
// @route   GET /api/comments
const getComments = async (req, res) => {
  const { postId, grievanceId } = req.query;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId || undefined,
        grievanceId: grievanceId || undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          }
        }
      },
      orderBy: {
        createdAt: 'asc',
      }
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments' });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
const deleteComment = async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: req.params.id }
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this comment' });
    }

    await prisma.comment.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment' });
  }
};

export { addComment, getComments, deleteComment };
