const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticate);

// Get all members
router.get('/', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const [members, total] = await Promise.all([
      prisma.profile.findMany({
        where,
        include: {
          user: { select: { email: true, role: true } },
          _count: { select: { payments: true } }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.profile.count({ where })
    ]);

    res.json({
      members,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Get member by ID
router.get('/:id', async (req, res) => {
  try {
    const member = await prisma.profile.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { email: true, role: true } },
        payments: {
          include: { paymentType: true },
          orderBy: { paymentDate: 'desc' }
        },
        memberGroups: {
          include: { group: true }
        }
      }
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch member' });
  }
});

// Create member
router.post('/',
  authorize('SUPER_ADMIN', 'SECRETARY'),
  [
    body('email').isEmail().normalizeEmail(),
    body('fullName').trim().notEmpty(),
    body('phone').optional().trim(),
    body('address').optional().trim(),
    body('avatarUrl').optional({ checkFalsy: true }).isURL()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let { email, fullName, phone, address, avatarUrl, role } = req.body;

      // Set avatarUrl to null if it's empty string
      if (!avatarUrl || avatarUrl.trim() === '') {
        avatarUrl = null;
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const member = await prisma.user.create({
        data: {
          email,
          password: await require('bcryptjs').hash('changeme123', 10),
          role: role || 'SECRETARY',
          profile: {
            create: { fullName, phone, address, avatarUrl }
          }
        },
        include: { profile: true }
      });

      res.status(201).json(member);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create member' });
    }
  }
);

// Update member
router.put('/:id',
  authorize('SUPER_ADMIN', 'SECRETARY'),
  async (req, res) => {
    try {
      const { fullName, phone, address, avatarUrl, status } = req.body;

      const member = await prisma.profile.update({
        where: { id: req.params.id },
        data: { fullName, phone, address, avatarUrl, status },
        include: { user: { select: { email: true, role: true } } }
      });

      res.json(member);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update member' });
    }
  }
);

// Delete member
router.delete('/:id',
  authorize('SUPER_ADMIN'),
  async (req, res) => {
    try {
      await prisma.profile.delete({ where: { id: req.params.id } });
      res.json({ message: 'Member deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete member' });
    }
  }
);

module.exports = router;
