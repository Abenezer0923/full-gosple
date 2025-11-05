const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticate);

// Get all groups
router.get('/', async (req, res) => {
  try {
    const groups = await prisma.churchGroup.findMany({
      include: {
        _count: { select: { memberGroups: true } }
      }
    });
    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// Create group
router.post('/',
  authorize('SUPER_ADMIN', 'SECRETARY'),
  [body('name').trim().notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description } = req.body;
      const group = await prisma.churchGroup.create({
        data: { name, description }
      });

      res.status(201).json(group);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create group' });
    }
  }
);

// Add member to group
router.post('/:groupId/members/:memberId',
  authorize('SUPER_ADMIN', 'SECRETARY'),
  async (req, res) => {
    try {
      const { groupId, memberId } = req.params;

      const memberGroup = await prisma.memberGroup.create({
        data: { groupId, memberId }
      });

      res.status(201).json(memberGroup);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add member to group' });
    }
  }
);

module.exports = router;
