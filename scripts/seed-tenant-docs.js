const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedTenantAssets() {
  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  ];

  const sampleDocs = [
    {
      documentType: 'AADHAAR',
      title: 'Government Aadhaar Card (Front & Back)',
      fileUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
      status: 'VERIFIED',
    },
    {
      documentType: 'RENTAL_AGREEMENT',
      title: 'Notarized 11-Month Rental Agreement',
      fileUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=800&auto=format&fit=crop&q=80',
      status: 'VERIFIED',
    },
    {
      documentType: 'POLICE_VERIFICATION',
      title: 'Prayagraj Police Tenant Verification Certificate',
      fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
      status: 'PENDING',
    },
  ];

  const tenants = await prisma.tenant.findMany({ include: { user: true, documents: true } });
  console.log('Found tenants:', tenants.length);

  for (let i = 0; i < tenants.length; i++) {
    const t = tenants[i];
    const avatar = sampleAvatars[i % sampleAvatars.length];
    
    // Update user avatar if missing
    if (!t.user?.avatarUrl) {
      await prisma.user.update({
        where: { id: t.userId },
        data: { avatarUrl: avatar }
      });
      console.log('Updated avatar for:', t.fullName);
    }

    // If tenant has no documents, add sample docs
    if (t.documents.length === 0) {
      for (const doc of sampleDocs) {
        await prisma.tenantDocument.create({
          data: {
            tenantId: t.id,
            documentType: doc.documentType,
            title: doc.title + ' - ' + t.fullName,
            fileUrl: doc.fileUrl,
            status: doc.status,
            verifiedBy: doc.status === 'VERIFIED' ? 'Estate Manager (Vikram Malhotra)' : null,
          }
        });
      }
      console.log('Added 3 verification documents for:', t.fullName);
    }
  }
}

seedTenantAssets()
  .then(() => console.log('Successfully seeded tenant photos and documents!'))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
