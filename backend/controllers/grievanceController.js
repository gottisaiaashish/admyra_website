import Grievance from '../models/Grievance.js';

// @desc    Report a new issue
// @route   POST /api/grievances
// @access  Private
const reportIssue = async (req, res) => {
  const { college, issueType, description, isAnonymous } = req.body;

  const grievance = await Grievance.create({
    user: req.user._id,
    college,
    issueType,
    description,
    isAnonymous,
  });

  if (grievance) {
    res.status(201).json(grievance);
  } else {
    res.status(400).json({ message: 'Invalid grievance data' });
  }
};

// @desc    Get all grievances (for the wall)
// @route   GET /api/grievances
// @access  Public
const getGrievances = async (req, res) => {
  const grievances = await Grievance.find({})
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  
  // Mask user names if anonymous
  const maskedGrievances = grievances.map(g => {
    const grievanceObj = g.toObject();
    if (g.isAnonymous) {
      grievanceObj.user = { name: 'Anonymous Student' };
    }
    return grievanceObj;
  });

  res.json(maskedGrievances);
};

export { reportIssue, getGrievances };
