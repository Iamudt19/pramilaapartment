/**
 * Pramila Apartments - AI Society Notice & Broadcast Generator
 * Generates formal English announcements, Hindi translations, and WhatsApp-ready formatted broadcasts.
 */

export interface GeneratedNotice {
  title: string;
  category: 'MAINTENANCE' | 'SECURITY' | 'BILLING' | 'EVENT' | 'GENERAL' | 'URGENT';
  targetAudience: 'ALL' | 'TENANTS' | 'OWNERS' | 'STAFF';
  englishContent: string;
  hindiContent: string;
  whatsAppBroadcast: string;
  suggestedTags: string[];
}

export function generateSocietyNotice(rawPrompt: string): GeneratedNotice {
  const p = rawPrompt.toLowerCase().trim();

  // Water Tank Cleaning
  if (p.includes('tank') || p.includes('water supply') || p.includes('cleaning water')) {
    const english = `Dear Residents,\n\nPlease be informed that scheduled deep sanitization and cleaning of the overhead and underground water reservoirs will take place this upcoming Friday from 10:00 AM to 2:00 PM.\n\nDuring this maintenance window, water supply from the overhead tanks will be temporarily suspended. Normal pressurized water flow from dual borewells will be fully restored by 2:30 PM.\n\nKindly store adequate water for morning convenience. We apologize for any temporary inconvenience and appreciate your kind cooperation.\n\nWarm regards,\nEstate Management\nPramila Apartments, DMCH Road`;
    const hindi = `प्रिय निवासियों,\n\nकृपया ध्यान दें कि आगामी शुक्रवार को पूर्वाह्न 10:00 बजे से अपराह्न 2:00 बजे तक छत एवं भूमिगत पानी की टंकियों की सफाई और सैनिटाइजेशन का कार्य किया जाएगा।\n\nइस अवधि में पानी की आपूर्ति अस्थायी रूप से बंद रहेगी। अपराह्न 2:30 बजे तक नियमित जल आपूर्ति बहाल कर दी जाएगी। कृपया आवश्यकतानुसार पानी का भंडारण कर लें।\n\nधन्यवाद,\nसोसायटी प्रबंधन, प्रमिला अपार्टमेंट्स`;

    const whatsApp = `📢 *PRAMILA APARTMENTS — SOCIETY ADVISORY*\n━━━━━━━━━━━━━━━━━━━━\n💧 *Scheduled Water Tank Cleaning*\n\n📅 *Schedule:* Friday (10:00 AM – 2:00 PM)\n⚠️ *Impact:* Overhead water supply will be paused during sanitization.\n✅ *Restoration:* Full pressure restored by 2:30 PM.\n\n💡 *Resident Request:* Please store adequate water for morning usage.\n\n📞 *Helpline / Caretaker:* +91 98765 43210\n_Pramila Apartments Management • DMCH Road, Darbhanga_`;

    return {
      title: 'Scheduled Water Tank Cleaning & Reservoir Sanitization',
      category: 'MAINTENANCE',
      targetAudience: 'ALL',
      englishContent: english,
      hindiContent: hindi,
      whatsAppBroadcast: whatsApp,
      suggestedTags: ['WaterSupply', 'TankCleaning', 'MaintenanceAdvisory'],
    };
  }

  // Power / Generator Maintenance
  if (p.includes('generator') || p.includes('power') || p.includes('electricity') || p.includes('sub meter') || p.includes('dg set')) {
    const english = `Dear Residents,\n\nRoutine servicing of the central backup DG Generator and electrical distribution panels is scheduled for tomorrow between 11:00 AM and 1:00 PM.\n\nEssential common area lighting and elevator power may undergo intermittent brief switchovers for load testing. Individual flat power supplies will remain active via grid lines.\n\nThank you for your continuous support.\n\nWarm regards,\nEstate Management\nPramila Apartments`;
    const hindi = `प्रिय निवासियों,\n\nकल पूर्वाह्न 11:00 बजे से दोपहर 1:00 बजे के बीच सोसायटी बैकअप जनरेटर एवं इलेक्ट्रिकल पैनल का नियमित रखरखाव कार्य किया जाएगा। फ्लैट्स की विद्युत आपूर्ति ग्रिड द्वारा चालू रहेगी।\n\nसहयोग के लिए धन्यवाद,\nप्रमिला अपार्टमेंट्स प्रबंधन`;

    const whatsApp = `⚡ *PRAMILA APARTMENTS — POWER BACKUP ADVISORY*\n━━━━━━━━━━━━━━━━━━━━\n🛠️ *Central DG Generator Servicing*\n\n📅 *Date & Time:* Tomorrow, 11:00 AM – 1:00 PM\nℹ️ *Detail:* Routine load testing and electrical switchover inspection.\n\n📞 *Inquiries:* Caretaker Desk (+91 98765 43210)`;

    return {
      title: 'Central DG Power Backup Servicing & Switchover Testing',
      category: 'MAINTENANCE',
      targetAudience: 'ALL',
      englishContent: english,
      hindiContent: hindi,
      whatsAppBroadcast: whatsApp,
      suggestedTags: ['PowerBackup', 'GeneratorServicing', 'ElectricalSafety'],
    };
  }

  // Rent / Billing Reminder
  if (p.includes('bill') || p.includes('rent') || p.includes('due') || p.includes('payment')) {
    const english = `Dear Residents,\n\nThis is a friendly reminder that the monthly flat rent and electricity sub-meter utility invoices for the current billing cycle have been generated.\n\nKindly clear your outstanding balance by the 5th of the month via the Resident Portal to ensure prompt receipt generation and avoid late clearance penalties.\n\nThank you for your timely payments!\n\nWarm regards,\nAccounts Office\nPramila Apartments`;
    const hindi = `प्रिय निवासियों,\n\nचालू माह के फ्लैट किराया एवं बिजली सब-मीटर बिल जारी कर दिए गए हैं। कृपया 5 तारीख तक रेजिडेंट पोर्टल के माध्यम से अपना भुगतान पूर्ण कर लें ताकि किसी भी विलंब शुल्क से बचा जा सके।\n\nधन्यवाद,\nअकाउंट्स विभाग, प्रमिला अपार्टमेंट्स`;

    const whatsApp = `💳 *PRAMILA APARTMENTS — BILLING REMINDER*\n━━━━━━━━━━━━━━━━━━━━\n📋 *Monthly Rent & Sub-Meter Billing Cycle*\n\n🗓️ *Due Date:* 5th of the month\n📱 *Pay Online:* Resident Portal -> My Rent & Sub-Meter Bills\n🧾 *Instant Receipt:* Download PDF receipt right after payment.\n\nThank you for your prompt cooperation!`;

    return {
      title: 'Monthly Rent & Sub-Meter Billing Cycle Clearance Reminder',
      category: 'BILLING',
      targetAudience: 'TENANTS',
      englishContent: english,
      hindiContent: hindi,
      whatsAppBroadcast: whatsApp,
      suggestedTags: ['BillingCycle', 'RentDue', 'SubMeterReceipts'],
    };
  }

  // General Announcement
  const capitalizedTitle = rawPrompt.charAt(0).toUpperCase() + rawPrompt.slice(1);
  const english = `Dear Residents,\n\n${capitalizedTitle}.\n\nPlease adhere to all society guidelines and contact the estate desk for any assistance.\n\nWarm regards,\nEstate Management\nPramila Apartments, DMCH Road`;
  const hindi = `प्रिय निवासियों,\n\n${capitalizedTitle}। कृपया सोसायटी के नियमों का पालन करें और किसी भी सहायता के लिए केयरटेकर से संपर्क करें।\n\nधन्यवाद,\nप्रमिला अपार्टमेंट्स`;
  const whatsApp = `📢 *PRAMILA APARTMENTS — OFFICIAL NOTICE*\n━━━━━━━━━━━━━━━━━━━━\n📌 *Subject:* ${capitalizedTitle}\n\nℹ️ ${english}\n\n📞 *Caretaker Helpline:* +91 98765 43210`;

  return {
    title: `Important Notice: ${capitalizedTitle}`,
    category: 'GENERAL',
    targetAudience: 'ALL',
    englishContent: english,
    hindiContent: hindi,
    whatsAppBroadcast: whatsApp,
    suggestedTags: ['GeneralNotice', 'CommunityUpdates'],
  };
}
