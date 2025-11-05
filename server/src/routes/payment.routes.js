const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticate);

// Get all payments
router.get('/', async (req, res) => {
  try {
    const { memberId, startDate, endDate, page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (memberId) where.memberId = memberId;
    if (startDate || endDate) {
      where.paymentDate = {};
      if (startDate) where.paymentDate.gte = new Date(startDate);
      if (endDate) where.paymentDate.lte = new Date(endDate);
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          member: { select: { fullName: true, avatarUrl: true } },
          paymentType: true
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { paymentDate: 'desc' }
      }),
      prisma.payment.count({ where })
    ]);

    res.json({
      payments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Get payment by ID
router.get('/:id', async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
      include: {
        member: true,
        paymentType: true
      }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// Create payment
router.post('/',
  authorize('SUPER_ADMIN', 'SECRETARY'),
  [
    body('memberId').isUUID(),
    body('amount').isFloat({ min: 0.01 }),
    body('paymentTypeId').isUUID(),
    body('forMonth').isISO8601(),
    body('method').isIn(['CASH', 'BANK_TRANSFER', 'MOBILE_MONEY', 'CHECK', 'CARD'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { memberId, amount, paymentTypeId, forMonth, method, notes } = req.body;

      const payment = await prisma.payment.create({
        data: {
          memberId,
          amount,
          paymentTypeId,
          forMonth: new Date(forMonth),
          method,
          notes
        },
        include: {
          member: true,
          paymentType: true
        }
      });

      res.status(201).json(payment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create payment' });
    }
  }
);

// Update payment
router.put('/:id',
  authorize('SUPER_ADMIN', 'SECRETARY'),
  async (req, res) => {
    try {
      const { amount, paymentTypeId, forMonth, method, notes } = req.body;

      const payment = await prisma.payment.update({
        where: { id: req.params.id },
        data: { amount, paymentTypeId, forMonth: forMonth ? new Date(forMonth) : undefined, method, notes },
        include: {
          member: true,
          paymentType: true
        }
      });

      res.json(payment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update payment' });
    }
  }
);

// Delete payment
router.delete('/:id',
  authorize('SUPER_ADMIN'),
  async (req, res) => {
    try {
      await prisma.payment.delete({ where: { id: req.params.id } });
      res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete payment' });
    }
  }
);

// Get payment types
router.get('/types/all', async (req, res) => {
  try {
    const types = await prisma.paymentType.findMany();
    res.json(types);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch payment types' });
  }
});

module.exports = router;
