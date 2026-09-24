const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testAllStorageForms() {
  console.log('🧪 Testing All Storage Operations via Supabase Pooler...');

  // 1. Walkthrough Lead Inquiry (The one that failed in user screenshot)
  const inquiry = await prisma.leadInquiry.create({
    data: {
      fullName: 'Test Lead Prospect',
      phone: '+91 99999 88888',
      email: 'prospect.test@gmail.com',
      suiteName: 'Surya 2BHK Deluxe',
      flatNumber: 'A-101',
      message: 'Automated test walkthrough inquiry',
      status: 'NEW',
    },
  });
  console.log('✅ Lead Inquiry Storage: PASS (ID:', inquiry.id, ')');

  // Clean up test inquiry
  await prisma.leadInquiry.delete({ where: { id: inquiry.id } });

  // 2. Query Property & System Settings
  const settingsCount = await prisma.systemSetting.count();
  console.log('✅ System Settings Read: PASS (Total Settings:', settingsCount, ')');

  // 3. Query Users & Tenants
  const userCount = await prisma.user.count();
  console.log('✅ Users Count: PASS (Total Users:', userCount, ')');

  // 4. Query Invoices & Bills
  const invoiceCount = await prisma.invoice.count();
  console.log('✅ Invoices Count: PASS (Total Invoices:', invoiceCount, ')');

  // 5. Query Flats & Vacancies
  const flatCount = await prisma.flat.count();
  console.log('✅ Flats Count: PASS (Total Flats:', flatCount, ')');

  console.log('🎉 ALL STORAGE CHECKS PASSED PERFECTLY!');
  await prisma.$disconnect();
}

testAllStorageForms().catch((e) => {
  console.error('❌ Storage check failed:', e);
  process.exit(1);
});
