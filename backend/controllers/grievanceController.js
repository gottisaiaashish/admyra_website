import prisma from '../config/prisma.js';

// @desc    Report a new issue
const reportIssue = async (req, res) => {
  const { college, issueType, description, isAnonymous } = req.body;

  const grievance = await prisma.grievance.create({
    data: {
      userId: req.user.id,
      college,
      issueType,
      description,
      isAnonymous,
    },
  });

  if (grievance) {
    res.status(201).json(grievance);
  } else {
    res.status(400).json({ message: 'Invalid grievance data' });
  }
};

// @desc    Get all grievances
const getGrievances = async (req, res) => {
  const grievances = await prisma.grievance.findMany({
    include: {
      user: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  const maskedGrievances = grievances.map(g => {
    if (g.isAnonymous) {
      return { ...g, user: { name: 'Anonymous Student' } };
    }
    return g;
  });

  res.json(maskedGrievances);
};

export { reportIssue, getGrievances };
