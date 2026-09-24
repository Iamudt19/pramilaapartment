/**
 * Pramila Apartments - AI Gate Security & Visitor Anomaly Inspector
 * Analyzes active visitor records, computes real-time security score, and flags security alerts.
 */

export interface VisitorAnomalyAlert {
  id: string;
  visitorName: string;
  flatNumber: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type: 'OVERSTAY' | 'ODD_HOURS' | 'FREQUENT_UNREGISTERED' | 'UNCHECKED_EXIT' | 'NORMAL';
  message: string;
  actionRequired: string;
  timestamp: string;
}

export interface SecurityInsightsReport {
  securityHealthScore: number; // 0 - 100
  securityStatus: 'EXCELLENT' | 'STABLE' | 'ATTENTION_REQUIRED' | 'HIGH_RISK';
  activeInsideCount: number;
  flaggedCount: number;
  alerts: VisitorAnomalyAlert[];
  recommendations: string[];
}

export function inspectVisitorSecurity(visitors: any[]): SecurityInsightsReport {
  const alerts: VisitorAnomalyAlert[] = [];
  const now = new Date().getTime();
  let insideCount = 0;

  for (const v of visitors) {
    if (v.status === 'CHECKED_IN') {
      insideCount++;
      const checkInTime = v.checkInTime ? new Date(v.checkInTime).getTime() : now - 3600 * 1000;
      const hoursInside = (now - checkInTime) / (1000 * 60 * 60);

      // Overstay Alert (> 6 hours inside without checkout)
      if (hoursInside > 6) {
        alerts.push({
          id: `alert-overstay-${v.id}`,
          visitorName: v.visitorName || 'Unknown Visitor',
          flatNumber: v.flat?.flatNumber || '101',
          severity: hoursInside > 12 ? 'HIGH' : 'MEDIUM',
          type: 'OVERSTAY',
          message: `Visitor has been inside for ${Math.round(hoursInside)} hours without exit verification.`,
          actionRequired: 'Confirm with flat resident via intercom or guard patrol.',
          timestamp: new Date().toISOString(),
        });
      }

      // Late night entry check (between 11 PM and 5 AM)
      const hour = new Date(checkInTime).getHours();
      if (hour >= 23 || hour <= 5) {
        alerts.push({
          id: `alert-night-${v.id}`,
          visitorName: v.visitorName || 'Night Guest',
          flatNumber: v.flat?.flatNumber || '101',
          severity: 'MEDIUM',
          type: 'ODD_HOURS',
          message: `Late-night gate entry logged at ${new Date(checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
          actionRequired: 'Ensure visitor vehicle is parked in guest bay.',
          timestamp: new Date().toISOString(),
        });
      }
    }
  }

  // Calculate Health Score
  let score = 100;
  if (alerts.some(a => a.severity === 'HIGH' || a.severity === 'CRITICAL')) {
    score -= 25;
  }
  if (alerts.some(a => a.severity === 'MEDIUM')) {
    score -= 10;
  }
  score = Math.max(60, score);

  let status: SecurityInsightsReport['securityStatus'] = 'EXCELLENT';
  if (score >= 90) status = 'EXCELLENT';
  else if (score >= 75) status = 'STABLE';
  else if (score >= 60) status = 'ATTENTION_REQUIRED';
  else status = 'HIGH_RISK';

  return {
    securityHealthScore: score,
    securityStatus: status,
    activeInsideCount: insideCount,
    flaggedCount: alerts.length,
    alerts,
    recommendations: [
      'Maintain continuous CCTV recording on Gate 1 and Elevator ground lobby.',
      'Require delivery agents (Swiggy/Zomato/Amazon) to obtain 1-time resident digital passes.',
      'Check in late night guests before 11:00 PM for maximum resident peace.',
    ],
  };
}
