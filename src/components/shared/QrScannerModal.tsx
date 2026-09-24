'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ScanLine,
  X,
  CheckCircle2,
  AlertOctagon,
  UserCheck,
  Camera,
  Upload,
  Search,
  ShieldCheck,
  RefreshCw,
  Clock,
  Car,
  Home,
  User,
  Volume2,
} from 'lucide-react';
import jsQR from 'jsqr';
import { formatDateTime } from '@/lib/utils';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function QrScannerModal({ isOpen, onClose, onSuccess }: QrScannerModalProps) {
  const [activeMode, setActiveMode] = useState<'camera' | 'upload' | 'manual'>('camera');
  const [passCodeInput, setPassCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Play synthetic tone for audio feedback
  const playSound = (type: 'success' | 'checkin' | 'error') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'checkin') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.45);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      // Audio context might be restricted
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraActive(true);
        requestAnimationFrame(tick);
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError('Camera access denied or unavailable. You can upload an image or type the pass code.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const tick = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      if (canvas) {
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code && code.data) {
            handleDecodedPayload(code.data);
            return;
          }
        }
      }
    }
    animationFrameId.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (isOpen && activeMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeMode]);

  const handleDecodedPayload = (rawPayload: string) => {
    stopCamera();
    let token = rawPayload.trim();

    try {
      const parsed = JSON.parse(rawPayload);
      if (parsed && parsed.token) {
        token = parsed.token;
      }
    } catch {
      // String token
    }

    setPassCodeInput(token);
    handleVerify(token);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            handleDecodedPayload(code.data);
          } else {
            setError('No valid QR code found in the selected image. Please try a clearer screenshot.');
            playSound('error');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleVerify = async (codeToVerify?: string) => {
    const code = codeToVerify || passCodeInput;
    if (!code) return;

    try {
      setLoading(true);
      setError(null);
      setScanResult(null);

      const res = await fetch('/api/visitors/verify-pass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passCode: code.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        setScanResult(data.data);
        playSound('success');
      } else {
        setError(data.error?.message || 'Invalid, expired, or non-existent visitor pass.');
        playSound('error');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed due to connection error.');
      playSound('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!scanResult?.requestId) return;

    try {
      setLoading(true);
      const res = await fetch('/api/visitors/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: scanResult.requestId,
          gateNumber: 'Main Security Gate 1',
        }),
      });

      const data = await res.json();
      if (data.success) {
        playSound('checkin');
        onSuccess();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setError(data.error?.message || 'Failed to record check-in in gate ledger.');
        playSound('error');
      }
    } catch (err: any) {
      setError(err.message || 'Check-in failed');
      playSound('error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black shadow-sm">
            <ScanLine className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Security Gate Scanner</h3>
            <p className="text-xs text-slate-500">Live Camera, QR Image Decode & Token Search</p>
          </div>
        </div>

        {/* Scanner Modes Switcher */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 mb-5">
          <button
            onClick={() => {
              setActiveMode('camera');
              setScanResult(null);
              setError(null);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeMode === 'camera'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-emerald-600" /> Live Camera
          </button>

          <button
            onClick={() => {
              setActiveMode('upload');
              stopCamera();
              setScanResult(null);
              setError(null);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeMode === 'upload'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-emerald-600" /> Image / Photo
          </button>

          <button
            onClick={() => {
              setActiveMode('manual');
              stopCamera();
              setScanResult(null);
              setError(null);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeMode === 'manual'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-emerald-600" /> Pass Token
          </button>
        </div>

        {/* 1. Camera Mode Viewfinder */}
        {activeMode === 'camera' && (
          <div className="relative bg-black rounded-2xl overflow-hidden border-2 border-emerald-500/50 mb-5 aspect-video flex items-center justify-center shadow-inner">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Target Reticle Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-emerald-400 rounded-2xl relative shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-emerald-400 -mt-1 -ml-1"></div>
                <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-emerald-400 -mt-1 -mr-1"></div>
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-emerald-400 -mb-1 -ml-1"></div>
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-emerald-400 -mb-1 -mr-1"></div>

                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent absolute top-1/2 -translate-y-1/2 shadow-[0_0_10px_#10b981] animate-bounce"></div>
              </div>
            </div>

            {cameraError && (
              <div className="absolute inset-0 bg-slate-950/90 p-4 flex flex-col items-center justify-center text-center">
                <AlertOctagon className="w-8 h-8 text-amber-400 mb-2" />
                <p className="text-xs text-slate-300 mb-3">{cameraError}</p>
                <button
                  onClick={startCamera}
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retry Camera
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2. Image / Screenshot Upload Mode */}
        {activeMode === 'upload' && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 text-center bg-slate-50 cursor-pointer mb-5 transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-emerald-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-sm">
              <Upload className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Select QR Pass Photo or Screenshot</h4>
            <p className="text-xs text-slate-500 mt-1">Supports WhatsApp images, gallery photos, and PNG/JPEG passes</p>
          </div>
        )}

        {/* 3. Manual Search / Token Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter pass token (e.g. PR-PASS-A1B2C3D4)"
            value={passCodeInput}
            onChange={(e) => setPassCodeInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleVerify();
            }}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 font-mono focus:outline-none focus:border-emerald-600 focus:bg-white"
          />
          <button
            onClick={() => handleVerify()}
            disabled={loading || !passCodeInput.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black px-5 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20"
          >
            {loading ? 'Verifying...' : 'Verify Pass'}
          </button>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl text-xs flex items-center gap-2.5 mb-4 animate-in fade-in">
            <AlertOctagon className="w-5 h-5 shrink-0 text-rose-600" />
            <span className="font-bold">{error}</span>
          </div>
        )}

        {/* Verified Pass Card */}
        {scanResult && (
          <div className="bg-slate-50 border border-emerald-300 rounded-2xl p-5 animate-in slide-in-from-bottom-2 duration-200 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-emerald-700 shadow-sm">
                  {scanResult.visitorPhotoUrl ? (
                    <img src={scanResult.visitorPhotoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    scanResult.visitorName.charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-base">{scanResult.visitorName}</h4>
                  <p className="text-xs text-slate-500">{scanResult.relationship} • {scanResult.visitorPhone}</p>
                </div>
              </div>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  scanResult.statusValidity === 'VALID'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {scanResult.statusValidity === 'VALID' ? 'VALID PASS' : scanResult.statusValidity}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Destination Flat</span>
                <span className="font-black text-emerald-700 text-sm font-mono">Flat {scanResult.flatNumber}</span>
                <span className="text-slate-500 text-[11px] block">Host: {scanResult.tenantName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Purpose of Visit</span>
                <span className="text-slate-800 font-semibold">{scanResult.purpose}</span>
              </div>
              {scanResult.vehicleNumber && (
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Vehicle Plate</span>
                  <span className="font-mono text-cyan-700 font-bold">{scanResult.vehicleNumber}</span>
                </div>
              )}
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Validity Window</span>
                <span className="text-amber-800 font-bold">{formatDateTime(scanResult.validUntil)}</span>
              </div>
            </div>

            {scanResult.statusValidity === 'VALID' && !scanResult.isCheckedIn ? (
              <button
                onClick={handleCheckIn}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-2xl text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-98"
              >
                <UserCheck className="w-5 h-5" /> Grant Gate Entry & Check In
              </button>
            ) : scanResult.isCheckedIn ? (
              <div className="text-center text-xs text-emerald-800 bg-emerald-100 p-3 rounded-xl border border-emerald-300 font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Visitor is already Checked In inside the premises.
              </div>
            ) : (
              <div className="text-center text-xs text-rose-700 bg-rose-100 p-3 rounded-xl border border-rose-300 font-bold">
                Pass is expired or not valid for entry.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
