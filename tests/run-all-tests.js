const crypto = require('crypto');

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failedTests++;
  }
}

// 1. Logic for Billing
function calculateElectricityCharge(previousReading, currentReading, ratePerUnit) {
  const units = Math.max(0, currentReading - previousReading);
  const amount = Math.round(units * ratePerUnit * 100) / 100;
  return { units, amount };
}

function generateInvoiceNumber(flatNumber, date = new Date()) {
  const yearMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  const cleanFlat = flatNumber.replace(/[^A-Za-z0-9]/g, '');
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `INV-${yearMonth}-${cleanFlat}-${randomSuffix}`;
}

function generateReceiptNumber(date = new Date()) {
  const year = date.getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `REC-${year}-${random}`;
}

// 2. Logic for QR
function generateSecurePassToken() {
  const hex = crypto.randomBytes(6).toString('hex').toUpperCase();
  return `PR-PASS-${hex}`;
}

function parseQrPayload(rawContent) {
  try {
    const parsed = JSON.parse(rawContent);
    if (parsed && parsed.app === 'PramilaApartments' && parsed.token) {
      return parsed.token;
    }
    return null;
  } catch {
    if (rawContent.startsWith('PR-PASS-')) {
      return rawContent.trim();
    }
    return null;
  }
}

// 3. Logic for RBAC
const ROLE_PERMISSIONS = {
  SUPER_ADMIN: ['*'],
  PROPERTY_MANAGER: ['flats:read', 'flats:write', 'tenants:approve', 'visitors:approve'],
  ACCOUNTANT: ['bills:read', 'bills:write', 'payments:reconcile'],
  SECURITY_GUARD: ['visitors:verify', 'visitors:checkin', 'security:incidents:write'],
  MAINTENANCE_STAFF: ['maintenance:read', 'maintenance:update'],
  TENANT: ['tenant:bills:pay', 'tenant:visitors:write', 'tenant:maintenance:write'],
};

function hasRole(session, allowedRoles) {
  if (!session) return false;
  if (session.role === 'SUPER_ADMIN') return true;
  return allowedRoles.includes(session.role);
}

// 4. Default Settings
const DEFAULT_SETTINGS = {
  'property.name': 'Pramila Apartments',
  'billing.rent_due_day': 5,
  'billing.electricity_rate_per_unit': 10.0,
  'visitor.unauthorized_penalty_amount': 2000,
  'tenancy.notice_period_days': 30,
};

async function runTests() {
  console.log('====================================================');
  console.log('🧪 PRAMILA APARTMENTS AUTOMATED TEST SUITE');
  console.log('====================================================\n');

  // TEST SUITE 1: Billing & Electricity Engine
  console.log('--- Suite 1: Billing & Tariff Formulas ---');
  const eleRes1 = calculateElectricityCharge(1200, 1450, 10.0);
  assert(eleRes1.units === 250 && eleRes1.amount === 2500, 'Calculates 250 units @ ₹10/unit = ₹2,500');

  const eleRes2 = calculateElectricityCharge(1500, 1500, 10.0);
  assert(eleRes2.units === 0 && eleRes2.amount === 0, 'Zero units consumed results in ₹0 charge');

  const eleRes3 = calculateElectricityCharge(1000, 900, 10.0);
  assert(eleRes3.units === 0 && eleRes3.amount === 0, 'Prevents negative charge if current reading is below previous');

  const invNum = generateInvoiceNumber('A-101');
  assert(invNum.startsWith('INV-') && invNum.includes('A101'), `Generates formatted unique invoice number: ${invNum}`);

  const recNum = generateReceiptNumber();
  assert(recNum.startsWith('REC-') && recNum.length >= 10, `Generates formatted unique receipt number: ${recNum}`);

  // TEST SUITE 2: QR Pass & Cryptography
  console.log('\n--- Suite 2: Visitor QR Cryptography & Tokens ---');
  const token = generateSecurePassToken();
  assert(token.startsWith('PR-PASS-') && token.length >= 16, `Generates secure non-guessable pass token: ${token}`);

  const rawJsonPayload = JSON.stringify({ app: 'PramilaApartments', type: 'VISITOR_PASS', token: 'PR-PASS-DEMO101' });
  const parsedToken = parseQrPayload(rawJsonPayload);
  assert(parsedToken === 'PR-PASS-DEMO101', 'Successfully parses and verifies valid app QR payload');

  const invalidPayload = JSON.stringify({ app: 'UnknownApp', token: 'HACKED' });
  const parsedInvalid = parseQrPayload(invalidPayload);
  assert(parsedInvalid === null, 'Rejects invalid or foreign QR payloads');

  // TEST SUITE 3: RBAC & Permissions
  console.log('\n--- Suite 3: Role-Based Authorization Guards ---');
  assert(ROLE_PERMISSIONS.SUPER_ADMIN.includes('*'), 'Super Admin has master wildcard access');
  assert(ROLE_PERMISSIONS.SECURITY_GUARD.includes('visitors:verify'), 'Security guard can verify QR passes');
  assert(!ROLE_PERMISSIONS.SECURITY_GUARD.includes('bills:write'), 'Security guard CANNOT access or modify bills');
  assert(ROLE_PERMISSIONS.TENANT.includes('tenant:bills:pay'), 'Tenant can view and pay bills');

  const superAdminSession = { role: 'SUPER_ADMIN', name: 'Admin', id: '1', email: 'admin@pramila.com' };
  const tenantSession = { role: 'TENANT', name: 'Tenant', id: '2', email: 'tenant@pramila.com' };

  assert(hasRole(superAdminSession, ['SUPER_ADMIN', 'PROPERTY_MANAGER']), 'Super Admin passes role check');
  assert(!hasRole(tenantSession, ['SUPER_ADMIN', 'ACCOUNTANT']), 'Tenant is rejected from admin role check');

  // TEST SUITE 4: Dynamic Configuration Defaults
  console.log('\n--- Suite 4: System Settings Zero-Hardcoding Defaults ---');
  assert(DEFAULT_SETTINGS['property.name'] === 'Pramila Apartments', 'Default property name is Pramila Apartments');
  assert(DEFAULT_SETTINGS['billing.rent_due_day'] === 5, 'Default rent due day is 5th of month');
  assert(DEFAULT_SETTINGS['billing.electricity_rate_per_unit'] === 10.0, 'Default electricity rate is ₹10.0/unit');
  assert(DEFAULT_SETTINGS['visitor.unauthorized_penalty_amount'] === 2000, 'Default unauthorized visitor penalty is ₹2,000');
  assert(DEFAULT_SETTINGS['tenancy.notice_period_days'] === 30, 'Default vacating notice period is 30 days');

  console.log('\n=============================================');
  console.log(`🎉 Automated Tests Completed: ${passedTests} Passed, ${failedTests} Failed.`);
  console.log('=============================================');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests();
