'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Loader2, Camera, User, Image as ImageIcon } from 'lucide-react';

interface FileUploadZoneProps {
  label: string;
  category?: 'DOCUMENTS' | 'AVATARS' | 'VISITORS' | 'INCIDENTS' | 'REGISTRATION';
  mode?: 'avatar' | 'document' | 'compact';
  accept?: string;
  maxSizeMB?: number;
  value?: string;
  onUploadSuccess: (fileData: { url: string; path: string; fileName: string }) => void;
  onRemove?: () => void;
  disabled?: boolean;
  helperText?: string;
}

export function FileUploadZone({
  label,
  category = 'DOCUMENTS',
  mode = 'document',
  accept = 'image/jpeg,image/png,image/webp,image/jpg,application/pdf',
  maxSizeMB = 10,
  value,
  onUploadSuccess,
  onRemove,
  disabled = false,
  helperText,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [fileName, setFileName] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      setPreviewUrl(value);
    }
  }, [value]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !uploading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || uploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setError(null);

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB} MB`);
      return;
    }

    // Set immediate client-side preview for images
    if (file.type.startsWith('image/')) {
      const localReader = new FileReader();
      localReader.onload = () => {
        setPreviewUrl(localReader.result as string);
      };
      localReader.readAsDataURL(file);
    }

    try {
      setUploading(true);
      setProgress(25);
      setFileName(file.name);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      setProgress(60);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setProgress(95);

      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to upload file');
      }

      setPreviewUrl(data.file.url);
      setProgress(100);
      onUploadSuccess({
        url: data.file.url,
        path: data.file.path,
        fileName: data.file.fileName,
      });
    } catch (err: any) {
      setError(err.message || 'Error occurred while uploading file');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    setFileName('');
    setError(null);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = '';
    if (onRemove) onRemove();
  };

  if (mode === 'avatar') {
    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </label>
        <div className="flex items-center gap-4 p-3 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <div
            onClick={() => !disabled && !uploading && inputRef.current?.click()}
            className="relative w-16 h-16 rounded-2xl border-2 border-dashed border-emerald-500/50 bg-slate-950 flex items-center justify-center overflow-hidden cursor-pointer hover:border-emerald-400 group transition-all shrink-0"
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Person Photo Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-slate-500 group-hover:text-emerald-400 flex flex-col items-center justify-center transition-colors">
                <User className="w-6 h-6" />
                <span className="text-[9px] font-bold mt-0.5">Photo</span>
              </div>
            )}

            {uploading && (
              <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
              </div>
            )}

            <div className="absolute bottom-0 inset-x-0 bg-slate-950/70 py-0.5 text-center text-[9px] text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-0.5">
              <Camera className="w-2.5 h-2.5" /> Change
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="user"
              onChange={handleFileSelect}
              className="hidden"
              disabled={disabled || uploading}
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => !disabled && !uploading && inputRef.current?.click()}
                disabled={disabled || uploading}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all border border-slate-700"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                {previewUrl ? 'Change Person Photo' : 'Upload Person Photo / Selfie'}
              </button>
              {previewUrl && (
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                  title="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">
              {helperText || 'Upload clear frontal face photo or selfie (JPG, PNG, WEBP)'}
            </p>
            {previewUrl && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Photo Attached Successfully
              </span>
            )}
          </div>
        </div>
        {error && (
          <div className="flex items-center space-x-1.5 text-xs text-rose-400">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </label>
        {helperText && <span className="text-[11px] text-slate-500">{helperText}</span>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {!previewUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && !uploading && inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
            isDragging
              ? 'border-emerald-500 bg-emerald-950/20 scale-[1.01]'
              : 'border-slate-700/80 bg-slate-900/40 hover:border-slate-500 hover:bg-slate-900/60'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center space-y-3 py-2">
              <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
              <p className="text-xs font-medium text-slate-300">Uploading and securing document...</p>
              <div className="w-44 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 text-slate-300 shadow-inner">
                <UploadCloud className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">
                  <span className="text-emerald-400 hover:underline">Click to upload doc photo</span> or drag & drop
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Aadhaar / ID Card / PDF or Image (Max {maxSizeMB} MB)
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl glass-card">
          <div className="flex items-center space-x-3 overflow-hidden">
            {previewUrl.startsWith('data:image') || previewUrl.match(/\.(jpg|jpeg|png|webp|gif)/i) || previewUrl.includes('/uploads/') ? (
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-500/40 shrink-0 bg-slate-950">
                <img src={previewUrl} alt="Doc Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
                <FileText className="w-5 h-5" />
              </div>
            )}
            <div className="truncate min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{fileName || 'Document File Attached'}</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>Uploaded & Verified</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-[11px] text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={removeFile}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
              title="Remove document"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-1.5 text-xs text-rose-400 mt-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

