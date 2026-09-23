'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';

interface FileUploadZoneProps {
  label: string;
  category?: 'DOCUMENTS' | 'AVATARS' | 'VISITORS' | 'INCIDENTS';
  accept?: string;
  maxSizeMB?: number;
  onUploadSuccess: (fileData: { url: string; path: string; fileName: string }) => void;
  disabled?: boolean;
}

export function FileUploadZone({
  label,
  category = 'DOCUMENTS',
  accept = 'image/*,application/pdf',
  maxSizeMB = 10,
  onUploadSuccess,
  disabled = false,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string; isImage: boolean } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

    try {
      setUploading(true);
      setProgress(25);

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

      const isImg = file.type.startsWith('image/');
      setUploadedFile({
        name: file.name,
        url: data.file.url,
        isImage: isImg,
      });

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

  const removeFile = () => {
    setUploadedFile(null);
    setError(null);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </label>

      {!uploadedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && !uploading && inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all cursor-pointer ${
            isDragging
              ? 'border-emerald-500 bg-emerald-950/20 glow-emerald scale-[1.01]'
              : 'border-slate-700/80 bg-slate-900/40 hover:border-slate-500 hover:bg-slate-900/60'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || uploading}
          />

          {uploading ? (
            <div className="flex flex-col items-center space-y-3 py-2">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <p className="text-sm font-medium text-slate-300">Uploading and encrypting document...</p>
              <div className="w-48 bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-slate-300 shadow-inner">
                <UploadCloud className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">
                  <span className="text-emerald-400 hover:underline">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  PDF, PNG, JPG or WEBP (Max {maxSizeMB} MB)
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl glass-card">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              {uploadedFile.isImage ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-slate-200 truncate">{uploadedFile.name}</p>
              <p className="text-xs text-emerald-400 flex items-center space-x-1">
                <span>Securely uploaded to Supabase Storage</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
            title="Remove and upload another"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 text-xs text-rose-400 mt-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
