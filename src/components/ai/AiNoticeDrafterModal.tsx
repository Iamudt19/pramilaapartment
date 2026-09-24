'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Share2,
  FileText,
  X,
  Send,
  Languages,
  ArrowRight,
} from 'lucide-react';

interface AiNoticeDrafterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyNotice?: (data: { title: string; content: string; category: string; targetAudience: string }) => void;
}

export function AiNoticeDrafterModal({
  isOpen,
  onClose,
  onApplyNotice,
}: AiNoticeDrafterModalProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'english' | 'hindi' | 'whatsapp'>('whatsapp');

  if (!isOpen) return null;

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/notice-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (res.ok) {
        const data = await res.json();
        setGenerated(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyWhatsApp = () => {
    if (!generated?.whatsAppBroadcast) return;
    navigator.clipboard.writeText(generated.whatsAppBroadcast);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-slate-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">AI Society Notice & WhatsApp Drafter</h3>
              <p className="text-xs text-slate-500">
                Type rough bullet points to generate official circulars and instant WhatsApp broadcasts.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Prompt */}
        <form onSubmit={handleGenerate} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              What would you like to announce to residents?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Overhead water tank cleaning this Friday 10am to 2pm"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loading ? 'Drafting...' : 'Generate'}</span>
              </button>
            </div>
          </div>

          {/* Quick Examples */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-slate-400 font-bold">Examples:</span>
            {[
              'Water tank cleaning Friday 10am-2pm',
              'DG power generator servicing tomorrow',
              'Monthly rent and sub-meter due 5th',
            ].map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => {
                  setPrompt(ex);
                }}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </form>

        {/* Generated Output Tabs */}
        {generated && (
          <div className="space-y-4 pt-2 border-t border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('whatsapp')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'whatsapp' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  WhatsApp Format
                </button>
                <button
                  onClick={() => setActiveTab('english')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'english' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  English Circular
                </button>
                <button
                  onClick={() => setActiveTab('hindi')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'hindi' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Hindi Notice
                </button>
              </div>

              {activeTab === 'whatsapp' && (
                <button
                  onClick={handleCopyWhatsApp}
                  className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-emerald-200 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy WhatsApp Text'}</span>
                </button>
              )}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs">
              <div className="font-bold text-slate-900 mb-2">{generated.title}</div>
              <p className="whitespace-pre-line text-slate-700 leading-relaxed font-sans">
                {activeTab === 'whatsapp'
                  ? generated.whatsAppBroadcast
                  : activeTab === 'hindi'
                  ? generated.hindiContent
                  : generated.englishContent}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs border border-slate-300"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onApplyNotice) {
                    onApplyNotice({
                      title: generated.title,
                      content: generated.englishContent,
                      category: generated.category,
                      targetAudience: generated.targetAudience,
                    });
                  }
                  onClose();
                }}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-wider rounded-xl text-xs shadow-lg flex items-center justify-center gap-1.5"
              >
                <span>Publish to Society Board</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
