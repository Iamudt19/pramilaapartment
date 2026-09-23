import prisma from './prisma';
import { getSetting } from './settings';

export interface SendNotificationParams {
  userId: string;
  title: string;
  message: string;
  eventType: string;
  link?: string;
  sendEmail?: boolean;
}

export async function sendNotification(params: SendNotificationParams) {
  try {
    // 1. Create in-app notification
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        title: params.title,
        message: params.message,
        eventType: params.eventType,
        link: params.link,
      },
    });

    // 2. Mock / Configurable Email Notification delivery
    if (params.sendEmail) {
      const user = await prisma.user.findUnique({
        where: { id: params.userId },
      });
      const mgmtEmail = await getSetting('property.management_email');

      // Structured log for audit & email provider integration
      console.log(`[EMAIL DISPATCH] To: ${user?.email || mgmtEmail} | Subject: ${params.title}`);
    }

    return notification;
  } catch (error) {
    console.error('Notification dispatch error:', error);
    return null;
  }
}

export async function notifyManagement(title: string, message: string, eventType: string, link?: string) {
  try {
    const managers = await prisma.user.findMany({
      where: {
        role: { in: ['SUPER_ADMIN', 'PROPERTY_MANAGER'] },
        isActive: true,
      },
    });

    for (const manager of managers) {
      await sendNotification({
        userId: manager.id,
        title,
        message,
        eventType,
        link,
        sendEmail: true,
      });
    }
  } catch (error) {
    console.error('Notify management error:', error);
  }
}
