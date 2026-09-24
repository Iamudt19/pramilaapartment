/**
 * Pramila Apartments - 24/7 AI Resident & Estate Concierge Engine
 * Handles resident queries, policy advice, tariff calculations, DMCH vicinity guidance, and quick actions.
 */

export interface ConciergeContext {
  userRole?: string;
  userName?: string;
  flatNumber?: string;
  outstandingBalance?: number;
}

export interface ConciergeResponse {
  answer: string;
  suggestedActions?: Array<{ label: string; href: string; icon?: string }>;
  category: 'BILLING' | 'VISITOR' | 'MAINTENANCE' | 'AMENITIES' | 'VICINITY' | 'GENERAL' | 'RULES';
}

const APARTMENT_KNOWLEDGE = `
Pramila Apartments Knowledge Base:
- Location: DMCH Road, Darbhanga, Bihar (500m / 5-minute walk to DMCH Gate).
- Configurations: Executive 2BHK Residences with private road-facing sunlit balconies.
- Water Supply: 24x7 continuous fresh water from dual deep borewells with heavy overhead & underground reservoir tanks.
- Electricity: Independent digital sub-meter per flat. Tariff is ₹10.00 per unit (kWh). 24x7 power backup for common areas, water pumps, and elevators.
- Security: Gated community with round-the-clock CCTV surveillance and digital QR Gate Pass verification for visitors.
- Parking: Covered ground floor reserved bays for two-wheelers and four-wheelers.
- Internet & DTH: Optical fiber broadband pre-wired (JioFiber, Airtel Xstream ready).
- Key Society Norms:
  * Rent & sub-meter bills due by the 5th of every month.
  * Quiet hours: 10:30 PM to 6:00 AM.
  * Visitor entries require digital QR pass approval by flat resident.
  * Waste disposal: Daily doorstep collection between 7:30 AM and 8:30 AM.
- Emergency Contacts:
  * Caretaker Helpline: +91 98765 43210
  * DMCH Emergency: 06272-233000 / 102
  * Local Police Station (Town PS): 112 / 06272-222100
  * Darbhanga Fire Station: 101
`;

export function processConciergeQuery(query: string, context?: ConciergeContext): ConciergeResponse {
  const q = query.toLowerCase().trim();

  // 1. BILLING & RENT QUERIES
  if (q.includes('bill') || q.includes('rent') || q.includes('pay') || q.includes('sub meter') || q.includes('electricity rate') || q.includes('unit cost') || q.includes('tariff')) {
    const balanceText = context?.outstandingBalance !== undefined
      ? `\nYour current account balance: ₹${context.outstandingBalance.toLocaleString('en-IN')}.`
      : '';

    return {
      category: 'BILLING',
      answer: `💳 **Electricity & Rent Billing Details:**\n\n• **Sub-meter Rate:** ₹10.00 per unit (kWh) calculated via your flat's independent digital sub-meter.\n• **Water Charges:** Included (24x7 dual borewell supply).\n• **Billing Schedule:** Invoices are generated at the start of each month and payable by the **5th** of the month.${balanceText}\n\nYou can view detailed itemized receipts or pay online instantly via the Resident Portal.`,
      suggestedActions: [
        { label: 'View & Pay Bills', href: '/portal/tenant/bills' },
        { label: 'Rent Estimator', href: '/#calculator' },
      ],
    };
  }

  // 2. VISITOR PASS & GATE SECURITY
  if (q.includes('visitor') || q.includes('guest') || q.includes('qr') || q.includes('gate pass') || q.includes('delivery') || q.includes('entry')) {
    return {
      category: 'VISITOR',
      answer: `🛡️ **Visitor QR Gate Pass System:**\n\n1. Go to the **Digital QR Visitor Passes** section.\n2. Enter your guest's name, phone, and expected arrival time.\n3. A high-resolution QR gate pass is generated instantly.\n4. Share the pass directly to your visitor via **WhatsApp** with 1 click.\n5. When your guest arrives at the gate, the guard scans the QR code for instant check-in.`,
      suggestedActions: [
        { label: 'Generate Visitor QR Pass', href: '/portal/tenant/visitors' },
        { label: 'Security Gate Scanner', href: '/portal/security' },
      ],
    };
  }

  // 3. MAINTENANCE & REPAIRS
  if (q.includes('leak') || q.includes('water') || q.includes('plumb') || q.includes('electric') || q.includes('repair') || q.includes('maintenance') || q.includes('fan') || q.includes('tap') || q.includes('switch')) {
    return {
      category: 'MAINTENANCE',
      answer: `🔧 **Maintenance & Repair Requests:**\n\nPramila Apartments maintains dedicated on-call electricians, plumbers, and caretakers.\n\n• **Raise a Ticket:** Submit a maintenance ticket specifying the issue and urgency.\n• **Emergency Repairs:** For immediate water leakage or electrical hazards, turn off the individual flat main valve/MCB and alert the caretaker immediately at **+91 98765 43210**.`,
      suggestedActions: [
        { label: 'Raise Maintenance Ticket', href: '/portal/tenant/maintenance' },
      ],
    };
  }

  // 4. DMCH & VICINITY GUIDANCE
  if (q.includes('dmch') || q.includes('hospital') || q.includes('medical') || q.includes('doctor') || q.includes('pharmacy') || q.includes('distance') || q.includes('location')) {
    return {
      category: 'VICINITY',
      answer: `🏥 **DMCH Medical Vicinity & Convenience:**\n\n• **Distance to DMCH Gate:** Exactly **500 meters** (approx. 5 minutes walking distance).\n• **24-Hour Pharmacies:** Multiple 24/7 medicine stores and diagnostic labs located directly on DMCH Road within 200m.\n• **Convenience:** Daily vegetable market, grocery marts, and ATMs are within 2 minutes walk from the main gate.`,
      suggestedActions: [
        { label: 'Schedule a Walkthrough', href: '/#vacancies' },
      ],
    };
  }

  // 5. PARKING & VEHICLES
  if (q.includes('parking') || q.includes('car') || q.includes('bike') || q.includes('vehicle') || q.includes('slot')) {
    return {
      category: 'AMENITIES',
      answer: `🚗 **Ground Floor Reserved Parking:**\n\n• Pramila Apartments provides covered, weather-protected ground-level parking bays for four-wheelers and two-wheelers.\n• Each flat is allocated dedicated vehicle slots. Please ensure your vehicle registration number is added in your profile for seamless gate RFID/manual clearance.`,
      suggestedActions: [
        { label: 'Manage My Vehicles', href: '/portal/tenant/vehicles' },
      ],
    };
  }

  // 6. SOCIETY RULES & TIMINGS
  if (q.includes('rule') || q.includes('time') || q.includes('garbage') || q.includes('waste') || q.includes('noise') || q.includes('pet') || q.includes('lock')) {
    return {
      category: 'RULES',
      answer: `📋 **Society Timings & Community Norms:**\n\n• **Doorstep Waste Collection:** 7:30 AM – 8:30 AM daily (segregated wet/dry waste).\n• **Quiet Hours:** 10:30 PM to 6:00 AM.\n• **Main Gate Lock:** Secure gated access with 24x7 on-duty guard. Late night guest arrivals should carry a valid resident QR pass.\n• **Balcony Protocol:** Keep flower pots secure on balcony sills with weather-proof safety railings.`,
      suggestedActions: [
        { label: 'View Society Notices', href: '/portal/tenant/notices' },
      ],
    };
  }

  // 7. DEFAULT INTELLIGENT ASSISTANT RESPONSE
  return {
    category: 'GENERAL',
    answer: `👋 Hello ${context?.userName || 'Resident'}! I am your **Pramila AI Concierge**.\n\nI can assist you with:\n• ⚡ Checking electricity sub-meter units & paying rent\n• 🎫 Generating digital QR passes for your visitors & deliveries\n• 🛠️ Logging maintenance tickets for electrical/plumbing repairs\n• 📍 DMCH vicinity guidance, pharmacy locations & society rules.\n\nHow can I help you right now?`,
    suggestedActions: [
      { label: 'Pay Rent / View Bills', href: '/portal/tenant/bills' },
      { label: 'Create Visitor Pass', href: '/portal/tenant/visitors' },
      { label: 'Report Maintenance Issue', href: '/portal/tenant/maintenance' },
      { label: 'View Vacant Flats', href: '/#vacancies' },
    ],
  };
}
