import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/rbac';
import { getAllSettings, updateSetting } from '@/lib/settings';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;

    const settings = await getAllSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const settingsToUpdate = await req.json();

    for (const [key, val] of Object.entries(settingsToUpdate)) {
      await updateSetting(key, val as any);
    }

    const updated = await getAllSettings();

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'SYSTEM_SETTINGS_UPDATED',
      resource: 'SystemSetting',
      newValue: settingsToUpdate,
    });

    return NextResponse.json({
      success: true,
      message: 'System settings saved successfully',
      settings: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
