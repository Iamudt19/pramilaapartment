'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { formatDateTime, formatDate } from '@/lib/utils';
import { ShieldCheck, Clock, User, Home, QrCode, Download } from 'lucide-react';

interface QrPassProps {
  passCode: string;
  visitorName: string;
  relationship: string;
  purpose: string;
  flatNumber: string;
  tenantName: string;
  validFrom: string | Date;
  validUntil: string | Date;
  vehicleNumber?: string;
  status: string;
}

export function QrPassCard({
  passCode,
  visitorName,
  relationship,
  purpose,
  flatNumber,
  tenantName,
  validFrom,
  validUntil,
  vehicleNumber,
  status,
}: QrPassProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (passCode) {
      const payload = JSON.stringify({
        app: 'PramilaApartments',
        type: 'VISITOR_PASS',
        token: passCode,
        v: 1,
      });
      QRCode.toDataURL(payload, {
        errorCorrectionLevel: 'H',
        margin: 2,
        scale: 8,
        color: { dark: '#0b1329', light: '#ffffff' },
      }).then(setQrDataUrl);
    }
  }, [passCode]);

  return (
    <div className="max-w-md mx-auto bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400">Pramila Apartments</span>
          <h3 className="font-extrabold text-base text-white">Digital Visitor Gate Pass</h3>
        </div>
        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {status}
        </span>
      </div>

      {/* QR Code Canvas */}
      <div className="bg-white p-4 rounded-2xl mx-auto w-48 h-48 flex items-center justify-center shadow-inner mb-4">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt={`QR Pass for ${visitorName}`} className="w-full h-full object-contain" />
        ) : (
          <QrCode className="w-16 h-16 text-slate-400 animate-pulse" />
        )}
      </div>

      {/* Pass Code */}
      <div className="text-center mb-4">
        <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Pass Verification Code</div>
        <div className="font-mono text-lg font-bold tracking-widest text-emerald-400">{passCode}</div>
      </div>

      {/* Visitor Details Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 mb-4">
        <div>
          <span className="text-slate-500 text-[10px] uppercase font-bold block">Visitor Name</span>
          <span className="font-semibold text-slate-200">{visitorName}</span>
          <span className="text-[11px] text-slate-400 block">({relationship})</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] uppercase font-bold block">Destination</span>
          <span className="font-bold text-emerald-400">Flat {flatNumber}</span>
          <span className="text-[11px] text-slate-400 block">Host: {tenantName}</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] uppercase font-bold block">Purpose</span>
          <span className="text-slate-300">{purpose}</span>
        </div>
        {vehicleNumber && (
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Vehicle No</span>
            <span className="text-slate-300 font-mono">{vehicleNumber}</span>
          </div>
        )}
      </div>

      {/* Validity Window */}
      <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-2.5 text-center text-xs text-slate-300 flex items-center justify-center gap-2">
        <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          Valid: <strong>{formatDateTime(validFrom)}</strong> to <strong>{formatDateTime(validUntil)}</strong>
        </span>
      </div>
    </div>
  );
}
