/**
 * Pramila Apartments - AI Maintenance Ticket Triage & Fault Diagnostics
 * Automatically analyzes issue description, infers category, assigns priority, suggests troubleshooting & estimated cost.
 */

export interface MaintenanceTriageResult {
  category: 'PLUMBING' | 'ELECTRICAL' | 'CARPENTRY' | 'APPLIANCE' | 'MASONRY' | 'SECURITY' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  urgencyReason: string;
  immediateSafetyTips: string[];
  estimatedCostRange: { min: number; max: number; currency: string };
  recommendedStaff: string;
  requiredTools: string[];
  suggestedActionPlan: string;
}

export function triageMaintenanceIssue(title: string, description: string): MaintenanceTriageResult {
  const text = `${title} ${description}`.toLowerCase();

  // 1. EMERGENCY ELECTRICAL
  if (text.includes('spark') || text.includes('fire') || text.includes('shock') || text.includes('short circuit') || text.includes('burning smell')) {
    return {
      category: 'ELECTRICAL',
      priority: 'EMERGENCY',
      urgencyReason: 'Direct electrical fire hazard or shock danger detected.',
      immediateSafetyTips: [
        'Immediately switch off the main MCB breaker located on your flat entrance distribution board.',
        'Do not touch exposed wires, wet switches, or smoking appliances.',
        'Keep children and pets away from the area until the certified technician arrives.',
      ],
      estimatedCostRange: { min: 300, max: 1200, currency: 'INR' },
      recommendedStaff: 'Lead Certified Electrician',
      requiredTools: ['Digital Multimeter', 'Insulated Screwdrivers (1000V)', 'Replacement 16A/32A MCB Breaker', 'Heat-resistant insulation tape'],
      suggestedActionPlan: 'Perform insulation resistance testing across load lines, inspect junction box for thermal discoloration, and replace failed MCB or terminal block.',
    };
  }

  // 2. WATER LEAK / PLUMBING
  if (text.includes('leak') || text.includes('tap') || text.includes('pipe') || text.includes('seepage') || text.includes('drain') || text.includes('overflow') || text.includes('flush') || text.includes('basin')) {
    const isSevere = text.includes('burst') || text.includes('flood') || text.includes('heavy') || text.includes('overflow');
    return {
      category: 'PLUMBING',
      priority: isSevere ? 'EMERGENCY' : 'HIGH',
      urgencyReason: isSevere ? 'Active continuous flooding risk to floor tiles & lower flat ceilings.' : 'Continuous water wastage & pressure loss.',
      immediateSafetyTips: [
        'Close the local angle stopcock valve beneath the sink or the main bathroom isolation valve.',
        'Place a bucket or dry mop cloths to prevent water accumulation near electrical sockets.',
        'Avoid operating immersion rods or geysers if water has dripped near connection points.',
      ],
      estimatedCostRange: { min: 150, max: 600, currency: 'INR' },
      recommendedStaff: 'Society On-Duty Plumber',
      requiredTools: ['Adjustable Pipe Wrench', 'Teflon Sealing Tape', 'Replacement Ceramic Disc Cartridges', 'Rubber Washers Set'],
      suggestedActionPlan: 'Isolate line pressure, dismantle spindle or connector hose, clean mineral scaling, replace Teflon seal & degraded washer, and test at 2.5 bar borewell pressure.',
    };
  }

  // 3. APPLIANCE / GEYSER / AC
  if (text.includes('geyser') || text.includes('heater') || text.includes('ac') || text.includes('air conditioner') || text.includes('fan') || text.includes('exhaust')) {
    return {
      category: 'APPLIANCE',
      priority: 'MEDIUM',
      urgencyReason: 'Appliance performance failure affecting daily comfort.',
      immediateSafetyTips: [
        'Unplug the appliance power cord from the wall switchboard.',
        'Do not attempt to open inner heating elements while connected to power.',
      ],
      estimatedCostRange: { min: 250, max: 900, currency: 'INR' },
      recommendedStaff: 'HVAC & Appliance Specialist',
      requiredTools: ['Continuity Tester', 'Thermal Probe', 'Capacitor Tester', 'Contact Cleaner'],
      suggestedActionPlan: 'Check thermal cutoff thermostat, verify heating coil resistance (approx. 20-30 ohms), and inspect switchboard 16A socket pins for carbon residue.',
    };
  }

  // 4. CARPENTRY / DOORS / BALCONY LOCKS
  if (text.includes('door') || text.includes('lock') || text.includes('handle') || text.includes('balcony') || text.includes('window') || text.includes('grill') || text.includes('hinge') || text.includes('wardrobe')) {
    return {
      category: 'CARPENTRY',
      priority: text.includes('lock') || text.includes('main door') ? 'HIGH' : 'MEDIUM',
      urgencyReason: 'Access impediment or flat physical perimeter safety concern.',
      immediateSafetyTips: [
        'Do not force jammed cylinder locks with excessive force to avoid key breakage.',
        'Ensure balcony glass sliders are anchored against strong cross-winds.',
      ],
      estimatedCostRange: { min: 200, max: 750, currency: 'INR' },
      recommendedStaff: 'Estate Joinery & Carpenter',
      requiredTools: ['Cylinder Lock Puller', 'Silicone Lubricant Spray', 'Stainless Steel Hinges Set', 'Power Drill & Wood Bits'],
      suggestedActionPlan: 'Re-align door frame striker plate, lubricate internal brass tumblers, and tighten stainless steel mounting screws.',
    };
  }

  // 5. GENERAL / OTHER
  return {
    category: 'OTHER',
    priority: 'LOW',
    urgencyReason: 'General maintenance request for flat upkeep.',
    immediateSafetyTips: [
      'Take photos or note specific symptom patterns to show the technician upon arrival.',
    ],
    estimatedCostRange: { min: 100, max: 400, currency: 'INR' },
    recommendedStaff: 'General Estate Caretaker',
    requiredTools: ['Multi-purpose Tool Kit', 'Cleaning Solutions', 'Flashlight'],
    suggestedActionPlan: 'Conduct initial on-site inspection, verify flat tenant report, and resolve or escalate to specialized vendor if required.',
  };
}
