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
          dark: '#0f172a',
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
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 600;
      canvas.height = 840;

      // Clean White Executive Background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, 840);
      bgGradient.addColorStop(0, '#ffffff');
      bgGradient.addColorStop(1, '#f8fafc');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, 600, 840);

      // Card Border
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      ctx.strokeRect(16, 16, 568, 808);

      // Header Banner
      ctx.fillStyle = '#047857';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PRAMILA APARTMENTS • RESIDENTIAL COMPLEX', 300, 56);

      ctx.fillStyle = '#0f172a';
      ctx.font = '900 24px sans-serif';
      ctx.fillText('OFFICIAL VISITOR GATE PASS', 300, 90);

      // Divider Line
      ctx.strokeStyle = '#e2e8f0';
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

        // Border box for QR
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(180, 130, 240, 240, 16);
        ctx.fill();
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.drawImage(img, 190, 140, 220, 220);
      }

      // Pass Code
      ctx.fillStyle = '#047857';
      ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(passCode, 300, 405);

      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.fillText('SECURITY GATE VERIFICATION TOKEN', 300, 425);

      // Details Box
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.roundRect(40, 445, 520, 260, 16);
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';

      ctx.fillText('VISITOR NAME:', 60, 480);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`${visitorName} (${relationship})`, 60, 502);

      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.fillText('DESTINATION:', 340, 480);
      ctx.fillStyle = '#047857';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`Flat ${flatNumber}`, 340, 504);

      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.fillText('HOST RESIDENT:', 340, 532);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(tenantName, 340, 552);

      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.fillText('PURPOSE:', 60, 540);
      ctx.fillStyle = '#0f172a';
      ctx.font = '14px sans-serif';
      ctx.fillText(purpose, 60, 560);

      if (vehicleNumber) {
        ctx.fillStyle = '#64748b';
        ctx.font = '12px sans-serif';
        ctx.fillText('VEHICLE NUMBER:', 60, 595);
        ctx.fillStyle = '#0284c7';
        ctx.font = 'bold 14px monospace';
        ctx.fillText(vehicleNumber, 60, 615);
      }

      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.fillText('VALIDITY PERIOD:', 60, 650);
      ctx.fillStyle = '#b45309';
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
      className="max-w-md w-full mx-auto bg-white border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
    >
      {/* Decorative ambient background flares */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-emerald-100 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-teal-100 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md shadow-emerald-600/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-emerald-700">
                Pramila Apartments
              </span>
              <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Digital Gate Pass</h3>
          </div>
        </div>

        <div className="text-right">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-sm ${
              status === 'CHECKED_IN'
                ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                : status === 'APPROVED'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold'
                : 'bg-cyan-100 text-cyan-800 border border-cyan-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            {status === 'APPROVED' ? 'Active Pass' : status === 'CHECKED_IN' ? 'Inside Campus' : status}
          </span>
        </div>
      </div>

      {/* Main QR Code Centerpiece */}
      <div className="relative group mx-auto w-52 h-52 bg-white p-3 rounded-3xl flex items-center justify-center shadow-lg border border-slate-200 mb-4 transition-transform transform group-hover:scale-105">
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt={`QR Gate Pass Code ${passCode}`}
            className="w-full h-full object-contain rounded-xl"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
            <QrCode className="w-16 h-16 animate-pulse text-emerald-600" />
            <span className="text-[10px] font-semibold text-slate-500">Generating Secure QR...</span>
          </div>
        )}
      </div>

      {/* Pass Verification Code & Quick Copy */}
      <div className="text-center mb-5">
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold block mb-1">
          Pass Verification Token
        </span>
        <div className="inline-flex items-center gap-2 bg-slate-50 px-4 py-1.5 rounded-xl border border-slate-300 shadow-inner">
          <span className="font-mono text-lg font-black tracking-widest text-emerald-700">{passCode}</span>
          <button
            onClick={handleCopyCode}
            className="p-1 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-200 transition-colors"
            title="Copy Pass Token"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Visitor Credentials Grid */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-3 mb-5 shadow-inner">
        <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200">
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-extrabold tracking-wider block mb-0.5">
              Visitor Name
            </span>
            <span className="font-bold text-slate-900 text-sm block">{visitorName}</span>
            <span className="text-[11px] text-slate-600 font-medium">{relationship}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-extrabold tracking-wider block mb-0.5">
              Destination
            </span>
            <span className="font-black text-emerald-700 text-sm block font-mono">Flat {flatNumber}</span>
            <span className="text-[11px] text-slate-600 font-medium">Host: {tenantName}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-extrabold tracking-wider block mb-0.5">
              Purpose
            </span>
            <span className="text-slate-800 font-semibold block">{purpose}</span>
          </div>
          {vehicleNumber && (
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-extrabold tracking-wider block mb-0.5">
                Vehicle No
              </span>
              <span className="font-mono text-cyan-800 font-bold">{vehicleNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Validity Window Bar */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center text-xs text-slate-700 flex items-center justify-center gap-2 mb-5">
        <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
        <div>
          <span className="text-[10px] text-slate-500 block uppercase font-bold">Authorized Entry Window</span>
          <span className="font-bold text-slate-900 text-[11px]">
            {formatDateTime(validFrom)} <span className="text-emerald-700 font-normal">to</span>{' '}
            {formatDateTime(validUntil)}
          </span>
        </div>
      </div>

      {/* Sharing & Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={handleShareWhatsApp}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all transform active:scale-95"
        >
          <Share2 className="w-4 h-4" /> Share on WhatsApp
        </button>

        <button
          onClick={handleDownloadImage}
          disabled={downloading}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold py-3 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
        >
          <Download className="w-4 h-4" /> {downloading ? 'Exporting...' : 'Save Pass Image'}
        </button>
      </div>
    </div>
  );
}
