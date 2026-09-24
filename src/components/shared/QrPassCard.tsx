'use client';

import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { formatDateTime } from '@/lib/utils';
import {
  ShieldCheck,
  Clock,
  Home,
  QrCode,
  Download,
  Share2,
  Copy,
  Check,
  Building2,
  ExternalLink,
  Printer,
  Sparkles,
  Car,
  User,
} from 'lucide-react';

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
  visitorPhotoUrl?: string;
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
  visitorPhotoUrl,
}: QrPassProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (passCode) {
      const payload = JSON.stringify({
        app: 'PramilaApartments',
        type: 'VISITOR_PASS',
        token: passCode,
        visitor: visitorName,
        flat: flatNumber,
        validUntil: validUntil,
        v: 1,
      });

      QRCode.toDataURL(payload, {
        errorCorrectionLevel: 'H',
        margin: 2,
        scale: 10,
        color: {
          dark: '#030712',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR Generation Error:', err));
    }
  }, [passCode, visitorName, flatNumber, validUntil]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(passCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = `🏢 *PRAMILA APARTMENTS — DIGITAL VISITOR PASS*
━━━━━━━━━━━━━━━━━━━━━━
👤 *Guest Name:* ${visitorName} (${relationship})
🏠 *Destination:* Flat ${flatNumber} (Host: ${tenantName})
🎯 *Purpose:* ${purpose}
🔑 *Pass Token:* ${passCode}
⏰ *Valid Window:* ${formatDateTime(validFrom)} to ${formatDateTime(validUntil)}
${vehicleNumber ? `🚗 *Vehicle Plate:* ${vehicleNumber}\n` : ''}
📍 *Location:* DMCH Road, Darbhanga, Bihar
🛡️ Please show this digital pass & QR code to the Security Guard at Main Gate 1 for instant entry.`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleDownloadImage = async () => {
    setDownloading(true);
    try {
      // Create an offscreen canvas to render a high-res printable gate pass card
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 600;
      canvas.height = 840;

      // Background Gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, 840);
      bgGradient.addColorStop(0, '#0a0f1d');
      bgGradient.addColorStop(1, '#030712');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, 600, 840);

      // Card Border & Glow
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      ctx.strokeRect(16, 16, 568, 808);

      // Header Banner
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PRAMILA APARTMENTS • RESIDENTIAL COMPLEX', 300, 56);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 24px sans-serif';
      ctx.fillText('OFFICIAL VISITOR GATE PASS', 300, 90);

      // Divider Line
      ctx.strokeStyle = '#1f293d';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(40, 110);
      ctx.lineTo(560, 110);
      ctx.stroke();

      // Draw QR Image
      if (qrDataUrl) {
        const img = new Image();
        img.src = qrDataUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        // White rounded background box for QR
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(180, 130, 240, 240, 16);
        ctx.fill();

        ctx.drawImage(img, 190, 140, 220, 220);
      }

      // Pass Code
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(passCode, 300, 405);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px sans-serif';
      ctx.fillText('SECURITY GATE VERIFICATION TOKEN', 300, 425);

      // Details Box
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(40, 445, 520, 260, 16);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';

      ctx.fillText('VISITOR NAME:', 60, 480);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`${visitorName} (${relationship})`, 60, 502);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('DESTINATION:', 340, 480);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`Flat ${flatNumber}`, 340, 504);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('HOST RESIDENT:', 340, 532);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(tenantName, 340, 552);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('PURPOSE:', 60, 540);
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px sans-serif';
      ctx.fillText(purpose, 60, 560);

      if (vehicleNumber) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.fillText('VEHICLE NUMBER:', 60, 595);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 14px monospace';
        ctx.fillText(vehicleNumber, 60, 615);
      }

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('VALIDITY PERIOD:', 60, 650);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`${formatDateTime(validFrom)} — ${formatDateTime(validUntil)}`, 60, 672);

      // Footer
      ctx.fillStyle = '#64748b';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Present this pass at Main Security Gate 1 upon arrival. Non-transferable.', 300, 750);
      ctx.fillText('DMCH Road, Darbhanga, Bihar • Emergency Helpdesk: +91 98765 43210', 300, 770);

      // Download Link
      const imageUri = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Visitor-Pass-${visitorName.replace(/\s+/g, '_')}-${passCode}.png`;
      link.href = imageUri;
      link.click();
    } catch (err) {
      console.error('Error exporting image:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      ref={cardRef}
      className="max-w-md w-full mx-auto bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative overflow-hidden backdrop-blur-2xl"
    >
      {/* Decorative ambient background flares */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Security Hologram Watermark Banner */}
      <div className="flex items-center justify-between border-b border-slate-800/90 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-emerald-400">
                Pramila Apartments
              </span>
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            </div>
            <h3 className="font-extrabold text-base text-white tracking-tight">Digital Gate Pass</h3>
          </div>
        </div>

        <div className="text-right">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-sm ${
              status === 'CHECKED_IN'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                : status === 'APPROVED'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            {status === 'APPROVED' ? 'Active Pass' : status === 'CHECKED_IN' ? 'Inside Campus' : status}
          </span>
        </div>
      </div>

      {/* Main QR Code Centerpiece */}
      <div className="relative group mx-auto w-52 h-52 bg-white p-3.5 rounded-3xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-4 border-slate-800/80 mb-4 transition-transform transform group-hover:scale-105">
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt={`QR Gate Pass Code ${passCode}`}
            className="w-full h-full object-contain rounded-xl"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
            <QrCode className="w-16 h-16 animate-pulse text-emerald-500" />
            <span className="text-[10px] font-semibold text-slate-500">Generating Secure QR...</span>
          </div>
        )}
      </div>

      {/* Pass Verification Code & Quick Copy */}
      <div className="text-center mb-5">
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-1">
          Pass Verification Token
        </span>
        <div className="inline-flex items-center gap-2 bg-slate-950 px-4 py-1.5 rounded-xl border border-emerald-500/30 shadow-inner">
          <span className="font-mono text-lg font-black tracking-widest text-emerald-400">{passCode}</span>
          <button
            onClick={handleCopyCode}
            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            title="Copy Pass Token"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Visitor Credentials Grid */}
      <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 text-xs space-y-3 mb-5 shadow-inner">
        <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-800/60">
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-extrabold tracking-wider block mb-0.5">
              Visitor Name
            </span>
            <span className="font-bold text-white text-sm block">{visitorName}</span>
            <span className="text-[11px] text-slate-400">{relationship}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-extrabold tracking-wider block mb-0.5">
              Destination
            </span>
            <span className="font-black text-emerald-400 text-sm block font-mono">Flat {flatNumber}</span>
            <span className="text-[11px] text-slate-400">Host: {tenantName}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-extrabold tracking-wider block mb-0.5">
              Purpose
            </span>
            <span className="text-slate-300 font-medium block">{purpose}</span>
          </div>
          {vehicleNumber && (
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-extrabold tracking-wider block mb-0.5">
                Vehicle No
              </span>
              <span className="font-mono text-cyan-300 font-bold">{vehicleNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Validity Window Bar */}
      <div className="bg-emerald-950/30 border border-emerald-500/25 rounded-2xl p-3 text-center text-xs text-slate-300 flex items-center justify-center gap-2 mb-5">
        <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Authorized Entry Window</span>
          <span className="font-bold text-white text-[11px]">
            {formatDateTime(validFrom)} <span className="text-emerald-400 font-normal">to</span>{' '}
            {formatDateTime(validUntil)}
          </span>
        </div>
      </div>

      {/* High-Impact Sharing & Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={handleShareWhatsApp}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-3 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all transform active:scale-95"
        >
          <Share2 className="w-4 h-4" /> Share on WhatsApp
        </button>

        <button
          onClick={handleDownloadImage}
          disabled={downloading}
          className="bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 font-bold py-3 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
        >
          <Download className="w-4 h-4" /> {downloading ? 'Exporting...' : 'Save Pass Image'}
        </button>
      </div>
    </div>
  );
}
