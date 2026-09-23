const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed for Pramila Apartments...');

  // 1. Password hash for all demo accounts
  const passwordHash = await bcrypt.hash('Password@123', 10);

  // 2. Clean existing records in correct relation order
  try {
    await prisma.notification.deleteMany();
    await prisma.emergencyAlert.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.systemSetting.deleteMany();
    await prisma.billingRule.deleteMany();
    await prisma.maintenanceAssignment.deleteMany();
    await prisma.maintenanceRequest.deleteMany();
    await prisma.staffAttendance.deleteMany();
    await prisma.staff.deleteMany();
    await prisma.paymentTransaction.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.invoiceItem.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.meterReading.deleteMany();
    await prisma.meter.deleteMany();
    await prisma.penalty.deleteMany();
    await prisma.securityIncident.deleteMany();
    await prisma.visitorExit.deleteMany();
    await prisma.visitorEntry.deleteMany();
    await prisma.visitorPass.deleteMany();
    await prisma.visitorDocument.deleteMany();
    await prisma.visitorRequest.deleteMany();
    await prisma.visitor.deleteMany();
    await prisma.tenantDocument.deleteMany();
    await prisma.tenantFamilyMember.deleteMany();
    await prisma.tenancy.deleteMany();
    await prisma.parkingSlot.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.flat.deleteMany();
    await prisma.floor.deleteMany();
    await prisma.building.deleteMany();
    await prisma.owner.deleteMany();
    await prisma.tenant.deleteMany();
    await prisma.notice.deleteMany();
    await prisma.property.deleteMany();
    await prisma.user.deleteMany();
  } catch (err) {
    console.log('Cleanup step skipped or partial:', err.message);
  }

  // 3. Create Property: Pramila Apartments
  const property = await prisma.property.create({
    data: {
      name: 'Pramila Apartments',
      code: 'PR-APT',
      address: '42, Temple Road, Civil Lines, Prayagraj, Uttar Pradesh - 211001',
      contactNumber: '+91 98765 43210',
      managementEmail: 'office.pramilaapartment@gmail.com',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      emergencyContact: '112 / +91 98765 00112',
    },
  });

  // 4. Seed Initial System Settings (ALL EDITABLE IN ADMIN PORTAL)
  const initialSettings = [
    { key: 'property.name', value: 'Pramila Apartments', valueType: 'STRING', category: 'PROPERTY' },
    { key: 'property.address', value: '42, Temple Road, Civil Lines, Prayagraj, Uttar Pradesh - 211001', valueType: 'STRING', category: 'PROPERTY' },
    { key: 'property.contact', value: '+91 98765 43210', valueType: 'STRING', category: 'PROPERTY' },
    { key: 'property.management_email', value: 'office.pramilaapartment@gmail.com', valueType: 'STRING', category: 'PROPERTY' },
    { key: 'property.timezone', value: 'Asia/Kolkata', valueType: 'STRING', category: 'PROPERTY' },
    { key: 'property.currency', value: 'INR', valueType: 'STRING', category: 'PROPERTY' },
    { key: 'billing.rent_due_day', value: '5', valueType: 'NUMBER', category: 'BILLING' },
    { key: 'billing.grace_period_days', value: '5', valueType: 'NUMBER', category: 'BILLING' },
    { key: 'billing.late_fee_fixed', value: '500', valueType: 'NUMBER', category: 'BILLING' },
    { key: 'billing.annual_increase_pct', value: '8.0', valueType: 'NUMBER', category: 'BILLING' },
    { key: 'billing.electricity_rate_per_unit', value: '10.0', valueType: 'NUMBER', category: 'BILLING' },
    { key: 'billing.water_charge_fixed', value: '400', valueType: 'NUMBER', category: 'BILLING' },
    { key: 'visitor.management_approval_required', value: 'true', valueType: 'BOOLEAN', category: 'VISITOR' },
    { key: 'visitor.require_id_proof', value: 'true', valueType: 'BOOLEAN', category: 'VISITOR' },
    { key: 'visitor.require_purpose', value: 'true', valueType: 'BOOLEAN', category: 'VISITOR' },
    { key: 'visitor.allowed_hours_start', value: '06:00', valueType: 'STRING', category: 'VISITOR' },
    { key: 'visitor.allowed_hours_end', value: '22:00', valueType: 'STRING', category: 'VISITOR' },
    { key: 'visitor.max_duration_hours', value: '12', valueType: 'NUMBER', category: 'VISITOR' },
    { key: 'visitor.unauthorized_penalty_amount', value: '2000', valueType: 'NUMBER', category: 'VISITOR' },
    { key: 'tenancy.notice_period_days', value: '30', valueType: 'NUMBER', category: 'TENANCY' },
    { key: 'tenancy.quiet_hours_start', value: '22:00', valueType: 'STRING', category: 'TENANCY' },
    { key: 'security.qr_validity_hours', value: '12', valueType: 'NUMBER', category: 'SECURITY' },
  ];

  for (const s of initialSettings) {
    await prisma.systemSetting.create({
      data: {
        propertyId: property.id,
        key: s.key,
        value: s.value,
        valueType: s.valueType,
        category: s.category,
      },
    });
  }

  // 5. Create Buildings & Floors
  const bldgA = await prisma.building.create({
    data: {
      propertyId: property.id,
      name: 'Tower A (Surya)',
      code: 'T-A',
      totalFloors: 4,
      address: 'North Wing, Pramila Apartments',
    },
  });

  const bldgB = await prisma.building.create({
    data: {
      propertyId: property.id,
      name: 'Tower B (Chandra)',
      code: 'T-B',
      totalFloors: 4,
      address: 'South Wing, Pramila Apartments',
    },
  });

  // Floors for Tower A
  const floorsA = [];
  for (let i = 1; i <= 4; i++) {
    const floor = await prisma.floor.create({
      data: {
        buildingId: bldgA.id,
        floorNumber: i,
        name: i === 1 ? '1st Floor' : i === 2 ? '2nd Floor' : i === 3 ? '3rd Floor' : '4th Floor (Penthouse)',
      },
    });
    floorsA.push(floor);
  }

  // Floors for Tower B
  const floorsB = [];
  for (let i = 1; i <= 4; i++) {
    const floor = await prisma.floor.create({
      data: {
        buildingId: bldgB.id,
        floorNumber: i,
        name: `${i}th Floor`,
      },
    });
    floorsB.push(floor);
  }

  // 6. Create Flat Owners
  const owner1 = await prisma.owner.create({
    data: {
      name: 'Mr. Rajeshwar Pandey',
      phone: '+91 94150 11223',
      email: 'rajeshwar.pandey@gmail.com',
      address: 'Civil Lines, Prayagraj',
      idProofType: 'AADHAAR',
      idProofNumber: 'XXXX-XXXX-8821',
      bankName: 'State Bank of India',
      bankAccount: '30982211902',
      ifscCode: 'SBIN0000123',
    },
  });

  const owner2 = await prisma.owner.create({
    data: {
      name: 'Mrs. Sunita Devi',
      phone: '+91 98390 44556',
      email: 'sunita.devi@outlook.com',
      address: 'Tagore Town, Prayagraj',
      idProofType: 'PAN',
      idProofNumber: 'ABCDE1234F',
    },
  });

  // 7. Create Flats
  const flatA101 = await prisma.flat.create({
    data: {
      buildingId: bldgA.id,
      floorId: floorsA[0].id,
      flatNumber: 'A-101',
      flatType: '2BHK',
      areaSqFt: 1150,
      bedrooms: 2,
      bathrooms: 2,
      status: 'OCCUPIED',
      monthlyRent: 22000,
      maintenance: 2500,
      deposit: 44000,
      ownerId: owner1.id,
    },
  });

  const flatA201 = await prisma.flat.create({
    data: {
      buildingId: bldgA.id,
      floorId: floorsA[1].id,
      flatNumber: 'A-201',
      flatType: '3BHK',
      areaSqFt: 1550,
      bedrooms: 3,
      bathrooms: 3,
      status: 'OCCUPIED',
      monthlyRent: 28000,
      maintenance: 3000,
      deposit: 56000,
      ownerId: owner2.id,
    },
  });

  const flatA301 = await prisma.flat.create({
    data: {
      buildingId: bldgA.id,
      floorId: floorsA[2].id,
      flatNumber: 'A-301',
      flatType: '2BHK',
      areaSqFt: 1150,
      bedrooms: 2,
      bathrooms: 2,
      status: 'VACANT',
      monthlyRent: 22000,
      maintenance: 2500,
      deposit: 44000,
      ownerId: owner1.id,
    },
  });

  const flatB101 = await prisma.flat.create({
    data: {
      buildingId: bldgB.id,
      floorId: floorsB[0].id,
      flatNumber: 'B-101',
      flatType: '3BHK',
      areaSqFt: 1600,
      bedrooms: 3,
      bathrooms: 3,
      status: 'VACANT',
      monthlyRent: 30000,
      maintenance: 3000,
      deposit: 60000,
      ownerId: owner2.id,
    },
  });

  // 8. Create Electricity Meters & Readings
  const meterA101 = await prisma.meter.create({
    data: {
      flatId: flatA101.id,
      meterNumber: 'EM-PA-A101',
      meterType: 'ELECTRICITY',
      currentStatus: 'ACTIVE',
      lastReading: 1450,
      lastReadingDate: new Date(),
    },
  });

  await prisma.meterReading.create({
    data: {
      meterId: meterA101.id,
      previousReading: 1220,
      currentReading: 1450,
      unitsConsumed: 230,
      ratePerUnit: 10.0,
      totalAmount: 2300,
      readingDate: new Date(),
      isBilled: false,
    },
  });

  const meterA201 = await prisma.meter.create({
    data: {
      flatId: flatA201.id,
      meterNumber: 'EM-PA-A201',
      meterType: 'ELECTRICITY',
      currentStatus: 'ACTIVE',
      lastReading: 2180,
      lastReadingDate: new Date(),
    },
  });

  // 9. Create Users for all roles
  // Super Admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@pramila.com',
      password: passwordHash,
      name: 'Col. R. K. Sharma (Retd.)',
      phone: '+91 98765 00001',
      role: 'SUPER_ADMIN',
    },
  });

  // Property Manager
  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@pramila.com',
      password: passwordHash,
      name: 'Vikram Malhotra',
      phone: '+91 98765 00002',
      role: 'PROPERTY_MANAGER',
    },
  });
  await prisma.staff.create({
    data: {
      userId: managerUser.id,
      fullName: 'Vikram Malhotra',
      phone: '+91 98765 00002',
      email: 'manager@pramila.com',
      role: 'PROPERTY_MANAGER',
      designation: 'Estate Manager',
      shiftSchedule: 'General Shift (09:00 - 18:00)',
    },
  });

  // Accountant
  const accountantUser = await prisma.user.create({
    data: {
      email: 'accountant@pramila.com',
      password: passwordHash,
      name: 'Suresh Chandra',
      phone: '+91 98765 00003',
      role: 'ACCOUNTANT',
    },
  });
  await prisma.staff.create({
    data: {
      userId: accountantUser.id,
      fullName: 'Suresh Chandra',
      phone: '+91 98765 00003',
      email: 'accountant@pramila.com',
      role: 'ACCOUNTANT',
      designation: 'Senior Accountant',
    },
  });

  // Security Guard
  const securityUser = await prisma.user.create({
    data: {
      email: 'security@pramila.com',
      password: passwordHash,
      name: 'Ram Singh Yadav',
      phone: '+91 98765 00004',
      role: 'SECURITY_GUARD',
    },
  });
  const securityStaff = await prisma.staff.create({
    data: {
      userId: securityUser.id,
      fullName: 'Ram Singh Yadav',
      phone: '+91 98765 00004',
      email: 'security@pramila.com',
      role: 'SECURITY_GUARD',
      designation: 'Head Security Guard',
      shiftSchedule: 'Day Shift (06:00 - 18:00)',
    },
  });

  // Maintenance Staff
  const maintenanceUser = await prisma.user.create({
    data: {
      email: 'maintenance@pramila.com',
      password: passwordHash,
      name: 'Manoj Kumar',
      phone: '+91 98765 00005',
      role: 'MAINTENANCE_STAFF',
    },
  });
  const maintenanceStaff = await prisma.staff.create({
    data: {
      userId: maintenanceUser.id,
      fullName: 'Manoj Kumar',
      phone: '+91 98765 00005',
      email: 'maintenance@pramila.com',
      role: 'MAINTENANCE_STAFF',
      designation: 'Facility Technician',
      shiftSchedule: 'General (09:00 - 17:00)',
    },
  });

  // Tenant 1 (Abhishek Verma - Flat A-101)
  const tenant1User = await prisma.user.create({
    data: {
      email: 'tenant1@pramila.com',
      password: passwordHash,
      name: 'Abhishek Verma',
      phone: '+91 98111 22334',
      role: 'TENANT',
    },
  });
  const tenant1 = await prisma.tenant.create({
    data: {
      userId: tenant1User.id,
      fullName: 'Abhishek Verma',
      phone: '+91 98111 22334',
      email: 'tenant1@pramila.com',
      permanentAddress: 'B-14, Sector 15, Noida, UP',
      emergencyContactName: 'Dr. S. K. Verma (Father)',
      emergencyContactPhone: '+91 98111 99887',
      occupation: 'Software Engineer',
      companyName: 'Tech Innovations Pvt Ltd',
      governmentIdType: 'AADHAAR',
      governmentIdNumber: 'XXXX-XXXX-4512',
      status: 'ACTIVE',
    },
  });

  // Family Members for Tenant 1
  await prisma.tenantFamilyMember.create({
    data: {
      tenantId: tenant1.id,
      name: 'Priyanka Verma',
      relationship: 'Spouse',
      age: 29,
      phone: '+91 98111 22335',
      isApproved: true,
    },
  });

  // Vehicle for Tenant 1
  const vehicle1 = await prisma.vehicle.create({
    data: {
      flatId: flatA101.id,
      tenantId: tenant1.id,
      vehicleNumber: 'UP 70 BK 1234',
      vehicleType: 'CAR',
      brandModel: 'Hyundai Creta (White)',
      status: 'APPROVED',
    },
  });

  // Parking Slot for Tenant 1
  await prisma.parkingSlot.create({
    data: {
      buildingId: bldgA.id,
      slotNumber: 'P-A-01',
      areaLocation: 'Basement Level 1',
      slotType: 'CAR',
      status: 'ASSIGNED',
      flatId: flatA101.id,
      vehicleId: vehicle1.id,
    },
  });

  // Tenancy for Tenant 1
  const tenancy1 = await prisma.tenancy.create({
    data: {
      tenantId: tenant1.id,
      flatId: flatA101.id,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      monthlyRent: 22000,
      depositAmount: 44000,
      maintenanceAmount: 2500,
      rentDueDay: 5,
      annualIncreasePct: 8.0,
      status: 'ACTIVE',
    },
  });

  // Tenant 2 (Pooja Hegde - Flat A-201)
  const tenant2User = await prisma.user.create({
    data: {
      email: 'tenant2@pramila.com',
      password: passwordHash,
      name: 'Pooja Hegde',
      phone: '+91 98222 33445',
      role: 'TENANT',
    },
  });
  const tenant2 = await prisma.tenant.create({
    data: {
      userId: tenant2User.id,
      fullName: 'Pooja Hegde',
      phone: '+91 98222 33445',
      email: 'tenant2@pramila.com',
      permanentAddress: 'Koramangala, Bengaluru, Karnataka',
      emergencyContactName: 'Naveen Hegde',
      emergencyContactPhone: '+91 98222 99887',
      occupation: 'Architect',
      governmentIdType: 'PAN',
      governmentIdNumber: 'XXXXX9988K',
      status: 'ACTIVE',
    },
  });

  await prisma.tenancy.create({
    data: {
      tenantId: tenant2.id,
      flatId: flatA201.id,
      startDate: new Date('2026-03-01'),
      endDate: new Date('2027-02-28'),
      monthlyRent: 28000,
      depositAmount: 56000,
      maintenanceAmount: 3000,
      rentDueDay: 5,
      annualIncreasePct: 8.0,
      status: 'ACTIVE',
    },
  });

  // Tenant 3 (Pending Applicant)
  const tenant3User = await prisma.user.create({
    data: {
      email: 'applicant@pramila.com',
      password: passwordHash,
      name: 'Kavita Rao',
      phone: '+91 98333 44556',
      role: 'TENANT',
    },
  });
  await prisma.tenant.create({
    data: {
      userId: tenant3User.id,
      fullName: 'Kavita Rao',
      phone: '+91 98333 44556',
      email: 'applicant@pramila.com',
      permanentAddress: 'Gomti Nagar, Lucknow, UP',
      occupation: 'Research Scientist',
      governmentIdType: 'AADHAAR',
      governmentIdNumber: 'XXXX-XXXX-9912',
      status: 'PENDING',
    },
  });

  // 10. Create Sample Invoices & Payments
  const invoice1 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-202609-A101-901',
      tenantId: tenant1.id,
      flatId: flatA101.id,
      billingPeriod: 'September 2026',
      issueDate: new Date('2026-09-01'),
      dueDate: new Date('2026-09-05'),
      subtotal: 24900,
      taxAmount: 0,
      lateFee: 0,
      totalAmount: 24900,
      paidAmount: 24900,
      balanceAmount: 0,
      status: 'PAID',
      items: {
        create: [
          { itemType: 'RENT', description: 'Monthly Rent (September 2026)', quantity: 1, unitPrice: 22000, totalPrice: 22000 },
          { itemType: 'MAINTENANCE', description: 'Society Maintenance', quantity: 1, unitPrice: 2500, totalPrice: 2500 },
          { itemType: 'WATER', description: 'Fixed Water Charge', quantity: 1, unitPrice: 400, totalPrice: 400 },
        ],
      },
    },
  });

  const payment1 = await prisma.payment.create({
    data: {
      receiptNumber: 'REC-2026-00109',
      invoiceId: invoice1.id,
      tenantId: tenant1.id,
      amount: 24900,
      paymentMethod: 'ONLINE_GATEWAY',
      status: 'SUCCESS',
      transactionRef: 'RZP_PAY_991823901',
      paymentDate: new Date('2026-09-04'),
      recordedBy: 'Payment Gateway (Auto)',
    },
  });

  await prisma.paymentTransaction.create({
    data: {
      paymentId: payment1.id,
      gatewayName: 'RAZORPAY',
      gatewayPaymentId: 'pay_PramilaTest991823',
      amount: 24900,
      currency: 'INR',
      status: 'SUCCESS',
    },
  });

  // Pending Invoice for Tenant 2
  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-202609-A201-902',
      tenantId: tenant2.id,
      flatId: flatA201.id,
      billingPeriod: 'September 2026',
      issueDate: new Date('2026-09-01'),
      dueDate: new Date('2026-09-05'),
      subtotal: 31400,
      taxAmount: 0,
      lateFee: 0,
      totalAmount: 31400,
      paidAmount: 0,
      balanceAmount: 31400,
      status: 'PENDING',
      items: {
        create: [
          { itemType: 'RENT', description: 'Monthly Rent (September 2026)', quantity: 1, unitPrice: 28000, totalPrice: 28000 },
          { itemType: 'MAINTENANCE', description: 'Society Maintenance', quantity: 1, unitPrice: 3000, totalPrice: 3000 },
          { itemType: 'WATER', description: 'Fixed Water Charge', quantity: 1, unitPrice: 400, totalPrice: 400 },
        ],
      },
    },
  });

  // 11. Create Sample Visitors & Approved QR Pass
  const visitor1 = await prisma.visitor.create({
    data: {
      name: 'Deepak Saxena',
      phone: '+91 99887 76655',
      idProofType: 'AADHAAR',
      idProofNumber: 'XXXX-XXXX-1144',
    },
  });

  const nowArrival = new Date();
  nowArrival.setHours(nowArrival.getHours() + 1);
  const nowDeparture = new Date();
  nowDeparture.setHours(nowDeparture.getHours() + 5);

  const visReqApproved = await prisma.visitorRequest.create({
    data: {
      visitorId: visitor1.id,
      tenantId: tenant1.id,
      flatId: flatA101.id,
      visitorName: 'Deepak Saxena',
      visitorPhone: '+91 99887 76655',
      relationship: 'Friend',
      purpose: 'Family dinner and social visit',
      vehicleNumber: 'UP 70 AB 4321',
      expectedArrival: nowArrival,
      expectedDeparture: nowDeparture,
      durationHours: 4,
      status: 'APPROVED',
      reviewedBy: 'Col. R. K. Sharma (Retd.)',
      reviewedAt: new Date(),
    },
  });

  const validFrom = new Date();
  validFrom.setHours(validFrom.getHours() - 1);
  const validUntil = new Date();
  validUntil.setHours(validUntil.getHours() + 11);

  await prisma.visitorPass.create({
    data: {
      visitorRequestId: visReqApproved.id,
      passCode: 'PR-PASS-DEMO101',
      validFrom,
      validUntil,
      isActive: true,
    },
  });

  // Pending Visitor Request for Tenant 2
  await prisma.visitorRequest.create({
    data: {
      tenantId: tenant2.id,
      flatId: flatA201.id,
      visitorName: 'Rahul Mehra',
      visitorPhone: '+91 97654 32190',
      relationship: 'Service/Delivery',
      purpose: 'Interior decor measurement & quotation',
      vehicleNumber: 'UP 70 XY 8899',
      expectedArrival: nowArrival,
      expectedDeparture: nowDeparture,
      durationHours: 2,
      status: 'PENDING',
    },
  });

  // Currently Inside Visitor
  const visitorInside = await prisma.visitor.create({
    data: {
      name: 'Anil Gupta',
      phone: '+91 98888 12345',
      idProofType: 'DRIVING_LICENSE',
      idProofNumber: 'DL-UP-2018-091',
    },
  });

  const visReqInside = await prisma.visitorRequest.create({
    data: {
      visitorId: visitorInside.id,
      tenantId: tenant1.id,
      flatId: flatA101.id,
      visitorName: 'Anil Gupta',
      visitorPhone: '+91 98888 12345',
      relationship: 'Family',
      purpose: 'Guest visit',
      expectedArrival: new Date(),
      expectedDeparture: nowDeparture,
      durationHours: 6,
      status: 'CHECKED_IN',
      reviewedBy: 'Vikram Malhotra',
      reviewedAt: new Date(),
    },
  });

  await prisma.visitorPass.create({
    data: {
      visitorRequestId: visReqInside.id,
      passCode: 'PR-PASS-INSIDE01',
      validFrom: new Date(),
      validUntil,
      isActive: true,
    },
  });

  await prisma.visitorEntry.create({
    data: {
      visitorRequestId: visReqInside.id,
      securityGuardId: securityStaff.id,
      securityGuardName: 'Ram Singh Yadav',
      entryTime: new Date(),
      gateNumber: 'Main Gate 1',
    },
  });

  // 12. Security Incidents & Penalties
  const incident1 = await prisma.securityIncident.create({
    data: {
      flatId: flatA201.id,
      tenantId: tenant2.id,
      reporterGuardId: securityStaff.id,
      reporterName: 'Ram Singh Yadav',
      incidentType: 'UNAUTHORIZED_ENTRY',
      severity: 'HIGH',
      description: 'Unregistered guest attempted entry past 23:00 without tenant approval or ID proof.',
      visitorName: 'Unknown Entry Attempt',
      isConfirmedByAdmin: true,
      confirmedAt: new Date(),
      actionTaken: 'Security warning issued and penalty confirmed by Estate Manager.',
    },
  });

  const penaltyDueDate = new Date();
  penaltyDueDate.setDate(penaltyDueDate.getDate() + 7);

  await prisma.penalty.create({
    data: {
      incidentId: incident1.id,
      tenantId: tenant2.id,
      flatId: flatA201.id,
      reason: 'Unauthorized visitor violation past quiet hours',
      amount: 2000,
      status: 'CONFIRMED',
      appliedDate: new Date(),
      dueDate: penaltyDueDate,
    },
  });

  // 13. Maintenance Requests
  const maintReq1 = await prisma.maintenanceRequest.create({
    data: {
      ticketNumber: 'TKT-2026-001',
      flatId: flatA101.id,
      tenantId: tenant1.id,
      category: 'PLUMBING',
      title: 'Kitchen Sink Tap Leakage',
      description: 'The hot water mixer tap in the kitchen is dripping continuously.',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      laborCost: 350,
      materialCost: 200,
      totalCost: 550,
    },
  });

  await prisma.maintenanceAssignment.create({
    data: {
      maintenanceRequestId: maintReq1.id,
      staffId: maintenanceStaff.id,
      status: 'IN_PROGRESS',
      notes: 'Replacement washer procured. Repair scheduled for 4 PM.',
    },
  });

  // 14. Notices & Emergency Alerts
  await prisma.notice.create({
    data: {
      propertyId: property.id,
      title: 'Annual Fire Safety & Lift Audit Notice',
      content: 'Please be advised that the annual fire safety drill and Schindler lift maintenance audit will take place this Saturday between 10:00 AM and 1:00 PM. Lifts in Tower A and B may be temporarily paused for 20 minutes each.',
      category: 'MAINTENANCE',
      targetAudience: 'ALL',
      isPinned: true,
      createdBy: 'Col. R. K. Sharma (Retd.)',
    },
  });

  await prisma.notice.create({
    data: {
      propertyId: property.id,
      title: 'Society Security & Visitor Guidelines Reminder',
      content: 'All residents are kindly requested to generate digital QR visitor passes in advance via the Tenant Portal. Outside visitors arriving without verified passes will require physical ID logging at the security gate.',
      category: 'SECURITY',
      targetAudience: 'ALL',
      isPinned: false,
      createdBy: 'Vikram Malhotra (Estate Manager)',
    },
  });

  // 15. Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      actorName: 'Col. R. K. Sharma (Retd.)',
      action: 'SYSTEM_INITIALIZATION',
      resource: 'Property',
      resourceId: property.id,
      newValue: JSON.stringify({ name: property.name, units: 12 }),
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('----------------------------------------------------');
  console.log('Demo Credentials for Pramila Apartments:');
  console.log('1. Super Admin:        admin@pramila.com       / Password@123');
  console.log('2. Property Manager:   manager@pramila.com     / Password@123');
  console.log('3. Accountant:         accountant@pramila.com  / Password@123');
  console.log('4. Security Guard:     security@pramila.com    / Password@123');
  console.log('5. Maintenance Staff:  maintenance@pramila.com / Password@123');
  console.log('6. Tenant (Flat A-101): tenant1@pramila.com    / Password@123');
  console.log('7. Tenant (Flat A-201): tenant2@pramila.com    / Password@123');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
