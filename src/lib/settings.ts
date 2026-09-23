import prisma from './prisma';

export interface DefaultSettings {
  'property.name': string;
  'property.address': string;
  'property.contact': string;
  'property.management_email': string;
  'property.timezone': string;
  'property.currency': string;
  'billing.rent_due_day': number;
  'billing.grace_period_days': number;
  'billing.late_fee_fixed': number;
  'billing.annual_increase_pct': number;
  'billing.electricity_rate_per_unit': number;
  'billing.water_charge_fixed': number;
  'billing.water_charge_type': 'FIXED' | 'PER_UNIT' | 'MANUAL';
  'visitor.management_approval_required': boolean;
  'visitor.require_id_proof': boolean;
  'visitor.require_purpose': boolean;
  'visitor.allowed_hours_start': string;
  'visitor.allowed_hours_end': string;
  'visitor.max_duration_hours': number;
  'visitor.unauthorized_penalty_amount': number;
  'tenancy.notice_period_days': number;
  'tenancy.quiet_hours_start': string;
  'security.qr_validity_hours': number;
}

export const DEFAULT_SETTINGS: DefaultSettings = {
  'property.name': 'Pramila Apartments',
  'property.address': '42, Temple Road, Near High Court, Prayagraj, UP - 211001',
  'property.contact': '+91 98765 43210',
  'property.management_email': 'office.pramilaapartment@gmail.com',
  'property.timezone': 'Asia/Kolkata',
  'property.currency': 'INR',
  'billing.rent_due_day': 5,
  'billing.grace_period_days': 5,
  'billing.late_fee_fixed': 500,
  'billing.annual_increase_pct': 8.0,
  'billing.electricity_rate_per_unit': 10.0,
  'billing.water_charge_fixed': 400,
  'billing.water_charge_type': 'FIXED',
  'visitor.management_approval_required': true,
  'visitor.require_id_proof': true,
  'visitor.require_purpose': true,
  'visitor.allowed_hours_start': '06:00',
  'visitor.allowed_hours_end': '22:00',
  'visitor.max_duration_hours': 12,
  'visitor.unauthorized_penalty_amount': 2000,
  'tenancy.notice_period_days': 30,
  'tenancy.quiet_hours_start': '22:00',
  'security.qr_validity_hours': 12,
};

export async function getSetting<K extends keyof DefaultSettings>(
  key: K,
  propertyId?: string
): Promise<DefaultSettings[K]> {
  try {
    const setting = await prisma.systemSetting.findFirst({
      where: {
        key,
        ...(propertyId ? { propertyId } : {}),
      },
    });

    if (!setting) {
      return DEFAULT_SETTINGS[key];
    }

    if (setting.valueType === 'NUMBER') {
      return Number(setting.value) as unknown as DefaultSettings[K];
    }
    if (setting.valueType === 'BOOLEAN') {
      return (setting.value === 'true' || setting.value === '1') as unknown as DefaultSettings[K];
    }
    if (setting.valueType === 'JSON') {
      return JSON.parse(setting.value) as unknown as DefaultSettings[K];
    }
    return setting.value as unknown as DefaultSettings[K];
  } catch (err) {
    return DEFAULT_SETTINGS[key];
  }
}

export async function getAllSettings(propertyId?: string): Promise<Record<string, any>> {
  try {
    const property = await prisma.property.findFirst();
    const activePropertyId = propertyId || property?.id;

    const settingsInDb = activePropertyId
      ? await prisma.systemSetting.findMany({
          where: { propertyId: activePropertyId },
        })
      : [];

    const result: Record<string, any> = { ...DEFAULT_SETTINGS };

    for (const s of settingsInDb) {
      if (s.valueType === 'NUMBER') {
        result[s.key] = Number(s.value);
      } else if (s.valueType === 'BOOLEAN') {
        result[s.key] = s.value === 'true' || s.value === '1';
      } else if (s.valueType === 'JSON') {
        try {
          result[s.key] = JSON.parse(s.value);
        } catch {
          result[s.key] = s.value;
        }
      } else {
        result[s.key] = s.value;
      }
    }

    if (property) {
      result['property.name'] = property.name;
      result['property.address'] = property.address;
      result['property.contact'] = property.contactNumber;
      result['property.management_email'] = property.managementEmail;
      result['property.timezone'] = property.timezone;
      result['property.currency'] = property.currency;
    }

    return result;
  } catch (err) {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function updateSetting(
  key: string,
  value: string | number | boolean | object,
  propertyId?: string
) {
  let targetPropertyId = propertyId;
  if (!targetPropertyId) {
    let property = await prisma.property.findFirst();
    if (!property) {
      property = await prisma.property.create({
        data: {
          name: 'Pramila Apartments',
        },
      });
    }
    targetPropertyId = property.id;
  }

  let valueType = 'STRING';
  let serializedValue = String(value);

  if (typeof value === 'number') {
    valueType = 'NUMBER';
    serializedValue = String(value);
  } else if (typeof value === 'boolean') {
    valueType = 'BOOLEAN';
    serializedValue = value ? 'true' : 'false';
  } else if (typeof value === 'object') {
    valueType = 'JSON';
    serializedValue = JSON.stringify(value);
  }

  // Also sync with Property table if key matches
  if (key === 'property.name') {
    await prisma.property.update({ where: { id: targetPropertyId }, data: { name: String(value) } });
  } else if (key === 'property.address') {
    await prisma.property.update({ where: { id: targetPropertyId }, data: { address: String(value) } });
  } else if (key === 'property.contact') {
    await prisma.property.update({ where: { id: targetPropertyId }, data: { contactNumber: String(value) } });
  } else if (key === 'property.management_email') {
    await prisma.property.update({ where: { id: targetPropertyId }, data: { managementEmail: String(value) } });
  } else if (key === 'property.timezone') {
    await prisma.property.update({ where: { id: targetPropertyId }, data: { timezone: String(value) } });
  } else if (key === 'property.currency') {
    await prisma.property.update({ where: { id: targetPropertyId }, data: { currency: String(value) } });
  }

  const existing = await prisma.systemSetting.findFirst({
    where: { propertyId: targetPropertyId, key },
  });

  if (existing) {
    return prisma.systemSetting.update({
      where: { id: existing.id },
      data: { value: serializedValue, valueType },
    });
  } else {
    return prisma.systemSetting.create({
      data: {
        propertyId: targetPropertyId,
        key,
        value: serializedValue,
        valueType,
      },
    });
  }
}
