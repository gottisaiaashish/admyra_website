import Partner from '../models/Partner.js';

// @desc    Apply to become a verified partner
// @route   POST /api/partners/apply
// @access  Public
const applyPartner = async (req, res) => {
  const { name, email, organization, website, message } = req.body;

  const partner = await Partner.create({
    name,
    email,
    organization,
    website,
    message,
  });

  if (partner) {
    res.status(201).json({ message: 'Application submitted successfully' });
  } else {
    res.status(400).json({ message: 'Invalid application data' });
  }
};

// @desc    Get all partner applications (Admin only)
// @route   GET /api/partners
// @access  Private/Admin
const getPartners = async (req, res) => {
  const partners = await Partner.find({}).sort({ createdAt: -1 });
  res.json(partners);
};

export { applyPartner, getPartners };
