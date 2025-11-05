const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

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

  console.log('✅ Payment types created');

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

  console.log('✅ Church groups created');

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

  console.log('✅ Super admin created (admin@graceledger.com / admin123)');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
