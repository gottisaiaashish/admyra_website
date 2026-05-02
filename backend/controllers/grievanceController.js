import prisma from '../config/prisma.js';

// @desc    Report a new issue
const reportIssue = async (req, res) => {
  const { college, issueType, description, isAnonymous } = req.body;

  try {
    const grievance = await prisma.grievance.create({
      data: {
        userId: req.user.id,
        college,
        issueType,
        description,
        isAnonymous,
      },
    });

    res.status(201).json(grievance);
  } catch (error) {
    res.status(400).json({ message: 'Invalid grievance data' });
  }
};

// @desc    Get all grievances
const getGrievances = async (req, res) => {
  try {
    const grievances = await prisma.grievance.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            avatar: true,
            username: true,
          },
        },
        _count: {
          select: { agrees_list: true }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grievances' });
  }
};

// @desc    Toggle Agree on an issue
// @route   POST /api/grievances/:id/agree
const toggleAgree = async (req, res) => {
  const grievanceId = req.params.id;
  const userId = req.user.id;

  try {
    const existingAgree = await prisma.grievanceAgree.findUnique({
      where: {
        userId_grievanceId: { userId, grievanceId }
      }
    });

    if (existingAgree) {
      await prisma.grievanceAgree.delete({
        where: {
          userId_grievanceId: { userId, grievanceId }
        }
      });
      // Decrement counter
      await prisma.grievance.update({
        where: { id: grievanceId },
        data: { agrees: { decrement: 1 } }
      });
      res.json({ agreed: false });
    } else {
      await prisma.grievanceAgree.create({
        data: { userId, grievanceId }
      });
      // Increment counter
      await prisma.grievance.update({
        where: { id: grievanceId },
        data: { agrees: { increment: 1 } }
      });
      res.json({ agreed: true });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error toggling agreement' });
  }
};

// @desc    Mark grievance as cleared
// @route   PUT /api/grievances/:id/resolve
const resolveGrievance = async (req, res) => {
  const grievanceId = req.params.id;
  const userId = req.user.id;

  try {
    const grievance = await prisma.grievance.findUnique({
      where: { id: grievanceId }
    });

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    if (grievance.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to resolve this grievance' });
    }

    const updatedGrievance = await prisma.grievance.update({
      where: { id: grievanceId },
      data: { status: 'Cleared' }
    });

    res.json(updatedGrievance);
  } catch (error) {
    res.status(400).json({ message: 'Error resolving grievance' });
  }
};

export { reportIssue, getGrievances, toggleAgree, resolveGrievance };
