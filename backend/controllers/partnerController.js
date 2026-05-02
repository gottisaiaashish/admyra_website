import prisma from '../config/prisma.js';

// @desc    Apply to become a verified partner
const applyPartner = async (req, res) => {
  const { name, email, organization, website, message } = req.body;

  const partner = await prisma.partner.create({
    data: {
      name,
      email,
      organization,
      website,
      message,
    },
  });

  if (partner) {
    res.status(201).json({ message: 'Application submitted successfully' });
  } else {
    res.status(400).json({ message: 'Invalid application data' });
  }
};

// @desc    Get all partner applications (Admin only)
const getPartners = async (req, res) => {
  const partners = await prisma.partner.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.json(partners);
};

export { applyPartner, getPartners };
