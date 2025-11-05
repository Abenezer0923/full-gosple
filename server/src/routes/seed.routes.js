const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const router = express.Router();
const prisma = new PrismaClient();

// Seed endpoint - can be called via HTTP
router.post('/initialize', async (req, res) => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create payment types
    const paymentTypes = await Promise.all([
      prisma.paymentType.upsert({
        where: { name: 'Tithe' },
        update: {},
        create: { name: 'Tithe' }
      }),
      prisma.paymentType.upsert({
        where: { name: 'Offering' },
        update: {},
        create: { name: 'Offering' }
      }),
      prisma.paymentType.upsert({
        where: { name: 'Special Offering' },
        update: {},
        create: { name: 'Special Offering' }
      }),
      prisma.paymentType.upsert({
        where: { name: 'Building Fund' },
        update: {},
        create: { name: 'Building Fund' }
      })
    ]);

    // Create church groups
    const groups = await Promise.all([
      prisma.churchGroup.upsert({
        where: { name: 'Youth Ministry' },
        update: {},
        create: { name: 'Youth Ministry', description: 'Young adults and teenagers' }
      }),
      prisma.churchGroup.upsert({
        where: { name: 'Choir' },
        update: {},
        create: { name: 'Choir', description: 'Worship team' }
      }),
      prisma.churchGroup.upsert({
        where: { name: 'Ushers' },
        update: {},
        create: { name: 'Ushers', description: 'Church ushers' }
      })
    ]);

    // Create super admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@graceledger.com' },
      update: {},
      create: {
        email: 'admin@graceledger.com',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        profile: {
          create: {
            fullName: 'System Administrator',
            phone: '+1234567890',
            address: '123 Church Street'
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        paymentTypes: paymentTypes.length,
        churchGroups: groups.length,
        adminCreated: true,
        adminEmail: 'admin@graceledger.com',
        adminPassword: 'admin123'
      }
    });
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
