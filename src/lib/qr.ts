import QRCode from 'qrcode';
import { randomBytes } from 'crypto';

export interface PassVerificationResult {
  valid: boolean;
  code: string;
  message: string;
  pass?: any;
}

export function generateSecurePassToken(): string {
  // Generate a non-guessable secure hex token e.g. "PR-PASS-9A3F108C4E2D"
  const hex = randomBytes(6).toString('hex').toUpperCase();
  return `PR-PASS-${hex}`;
}

export async function generateQrDataUrl(passToken: string): Promise<string> {
  // Never put sensitive tenant details in QR code. Only encode the verified pass identifier
  const qrPayload = JSON.stringify({
    app: 'PramilaApartments',
    type: 'VISITOR_PASS',
    token: passToken,
    v: 1,
  });

  return QRCode.toDataURL(qrPayload, {
    errorCorrectionLevel: 'H',
    margin: 2,
    scale: 8,
    color: {
      dark: '#0f172a',
      light: '#ffffff',
    },
  });
}

export function parseQrPayload(rawContent: string): string | null {
  try {
    const parsed = JSON.parse(rawContent);
    if (parsed && parsed.app === 'PramilaApartments' && parsed.token) {
      return parsed.token;
    }
    return null;
  } catch {
    // If scanned as raw token string e.g. "PR-PASS-XXXX"
    if (rawContent.startsWith('PR-PASS-')) {
      return rawContent.trim();
    }
    return null;
  }
}
