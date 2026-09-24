const { PrismaClient } = require('@prisma/client');

const poolerRegions = [
  'aws-0-ap-south-1.pooler.supabase.com',
  'aws-0-ap-southeast-1.pooler.supabase.com',
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-0-eu-central-1.pooler.supabase.com'
];

async function testPoolers() {
  for (const host of poolerRegions) {
    const url = `postgresql://postgres.wveayzgscaoevrwhqbve:iamback19050@${host}:6543/postgres?pgbouncer=true`;
    console.log(`Testing Pooler: ${host}...`);
    const prisma = new PrismaClient({
      datasources: { db: { url } }
    });

    try {
      const userCount = await prisma.user.count();
      console.log(`🎉 SUCCESS! Region is ${host}! User count: ${userCount}`);
      await prisma.$disconnect();
      return host;
    } catch (e) {
      console.log(`❌ Failed on ${host}: ${e.message.split('\n')[0]}`);
      await prisma.$disconnect();
    }
  }
}

testPoolers();
