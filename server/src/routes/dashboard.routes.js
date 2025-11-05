const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticate);

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [
      totalMembers,
      activeMembers,
      monthlyCollection,
      yearlyCollection,
      totalCollection
    ] = await Promise.all([
      prisma.profile.count(),
      prisma.profile.count({ where: { status: 'ACTIVE' } }),
      prisma.payment.aggregate({
        where: { paymentDate: { gte: startOfMonth } },
        _sum: { amount: true }
      }),
      prisma.payment.aggregate({
        where: { paymentDate: { gte: startOfYear } },
        _sum: { amount: true }
      }),
      prisma.payment.aggregate({
        _sum: { amount: true }
      })
    ]);

    res.json({
      totalMembers,
      activeMembers,
      monthlyCollection: monthlyCollection._sum.amount || 0,
      yearlyCollection: yearlyCollection._sum.amount || 0,
      totalCollection: totalCollection._sum.amount || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get monthly trends (last 12 months)
router.get('/trends/monthly', async (req, res) => {
  try {
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const payments = await prisma.payment.findMany({
      where: {
        paymentDate: { gte: twelveMonthsAgo }
      },
      select: {
        amount: true,
        paymentDate: true
      }
    });

    const monthlyData = {};
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[key] = 0;
    }

    payments.forEach(payment => {
      const date = new Date(payment.paymentDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData[key] !== undefined) {
        monthlyData[key] += parseFloat(payment.amount);
      }
    });

    const trends = Object.entries(monthlyData)
      .map(([month, amount]) => ({ month, amount }))
      .reverse();

    res.json(trends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

// Get payment distribution by type
router.get('/distribution', async (req, res) => {
  try {
    const distribution = await prisma.payment.groupBy({
      by: ['paymentTypeId'],
      _sum: { amount: true },
      _count: true
    });

    const types = await prisma.paymentType.findMany();
    const typeMap = Object.fromEntries(types.map(t => [t.id, t.name]));

    const result = distribution.map(d => ({
      type: typeMap[d.paymentTypeId] || 'Unknown',
      amount: d._sum.amount || 0,
      count: d._count
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch distribution' });
  }
});

// Get recent payments
router.get('/recent-payments', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const payments = await prisma.payment.findMany({
      take: parseInt(limit),
      orderBy: { paymentDate: 'desc' },
      include: {
        member: { select: { fullName: true, avatarUrl: true } },
        paymentType: true
      }
    });

    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch recent payments' });
  }
});

module.exports = router;
