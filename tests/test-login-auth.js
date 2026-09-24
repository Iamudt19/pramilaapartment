const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testAllLogins() {
  const accounts = [
    'admin@pramila.com',
    'manager@pramila.com',
    'accountant@pramila.com',
    'security@pramila.com',
    'maintenance@pramila.com',
    'tenant1@pramila.com',
    'tenant2@pramila.com',
    'applicant@pramila.com'
  ];

  console.log('--- TESTING ALL LOGINS ---');
  for (const email of accounts) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (!user) {
        console.log(`❌ ${email}: User NOT found in database!`);
        continue;
      }

      console.log(`✅ ${email}: Found user (ID: ${user.id}, Role: ${user.role}, Active: ${user.isActive}, HashLength: ${user.password.length})`);
      
      const isMatch = await bcrypt.compare('Password@123', user.password);
      console.log(`   Password 'Password@123' match: ${isMatch ? '✅ MATCH' : '❌ MISMATCH'}`);
    } catch (err) {
      console.error(`❌ ${email}: Error -`, err.message);
    }
  }

  await prisma.$disconnect();
}

testAllLogins();
