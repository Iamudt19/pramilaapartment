import prisma from './prisma';

export interface AuditLogParams {
  userId?: string;
  actorName: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
}

export async function logAudit(params: AuditLogParams) {
  try {
    return await prisma.auditLog.create({
      data: {
        userId: params.userId,
        actorName: params.actorName || 'System',
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId,
        oldValue: params.oldValue ? JSON.stringify(params.oldValue) : null,
        newValue: params.newValue ? JSON.stringify(params.newValue) : null,
        ipAddress: params.ipAddress || '127.0.0.1',
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
    return null;
  }
}
