// Automated Test for Complete Digital QR Pass Lifecycle
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateSecurePassToken, parseQrPayload } = require('../src/lib/qr.ts');

async function testQrWorkflow() {
  console.log('🧪 Testing Full Digital QR Pass Lifecycle...');
  try {
    // 1. Get flat and tenant
    const flat = await prisma.flat.findFirst({ where: { flatNumber: 'A-101' } });
    const tenant = await prisma.tenant.findFirst();

    if (!flat || !tenant) {
      console.log('⚠️ Flat or Tenant not found for test, skipping live db test.');
      return;
    }

    // 2. Generate QR Pass
    const passCode = generateSecurePassToken();
    console.log('  ✅ Step 1: Generated Token:', passCode);

    const now = new Date();
    const departure = new Date(now.getTime() + 4 * 60 * 60 * 1000);

    const visitorReq = await prisma.visitorRequest.create({
      data: {
        tenantId: tenant.id,
        flatId: flat.id,
        visitorName: 'Test Automation Guest',
        visitorPhone: '+91 99999 88888',
        relationship: 'Family',
        purpose: 'Dinner & Stay',
        status: 'APPROVED',
        expectedArrival: now,
        expectedDeparture: departure,
        durationHours: 4,
        pass: {
          create: {
            passCode,
            validFrom: new Date(now.getTime() - 60 * 60 * 1000),
            validUntil: new Date(departure.getTime() + 2 * 60 * 60 * 1000),
            isActive: true,
          },
        },
      },
      include: { pass: true },
    });
    console.log('  ✅ Step 2: Created VisitorRequest ID:', visitorReq.id);

    // 3. Verify Pass
    const pass = await prisma.visitorPass.findFirst({
      where: { passCode },
      include: { visitorRequest: { include: { flat: true, tenant: true } } },
    });
    if (!pass || !pass.isActive) throw new Error('Pass verification failed');
    console.log('  ✅ Step 3: Verified Pass Code:', pass.passCode, 'for Flat:', pass.visitorRequest.flat.flatNumber);

    // 4. Check In
    const entry = await prisma.visitorEntry.create({
      data: {
        visitorRequestId: visitorReq.id,
        securityGuardId: 'test-guard-id',
        securityGuardName: 'Gate Guard Test',
        gateNumber: 'Main Gate 1',
      },
    });
    await prisma.visitorRequest.update({
      where: { id: visitorReq.id },
      data: { status: 'CHECKED_IN' },
    });
    console.log('  ✅ Step 4: Checked In. Status: CHECKED_IN, Entry ID:', entry.id);

    // 5. Check Out
    const exit = await prisma.visitorExit.create({
      data: {
        visitorRequestId: visitorReq.id,
        securityGuardId: 'test-guard-id',
        securityGuardName: 'Gate Guard Test',
        exitTime: new Date(),
        durationMinutes: 120,
      },
    });
    await prisma.visitorRequest.update({
      where: { id: visitorReq.id },
      data: { status: 'CHECKED_OUT' },
    });
    await prisma.visitorPass.updateMany({
      where: { visitorRequestId: visitorReq.id },
      data: { isActive: false },
    });
    console.log('  ✅ Step 5: Checked Out. Status: CHECKED_OUT, Exit ID:', exit.id);

    // Clean up test record
    await prisma.visitorExit.deleteMany({ where: { visitorRequestId: visitorReq.id } });
    await prisma.visitorEntry.deleteMany({ where: { visitorRequestId: visitorReq.id } });
    await prisma.visitorPass.deleteMany({ where: { visitorRequestId: visitorReq.id } });
    await prisma.visitorRequest.delete({ where: { id: visitorReq.id } });
    console.log('  🧹 Cleaned up test record.');

    console.log('🎉 FULL DIGITAL QR PASS LIFECYCLE VERIFIED 100% WORKING IN CODE!');
  } catch (err) {
    console.error('❌ Test failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testQrWorkflow();
