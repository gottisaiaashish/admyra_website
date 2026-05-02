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
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // We can handle anonymous masking here if needed later
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grievances' });
  }
};

export { reportIssue, getGrievances };
