'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bot,
  Sparkles,
  X,
  Send,
  Minimize2,
  Maximize2,
  ArrowRight,
  Receipt,
  QrCode,
  Wrench,
  HelpCircle,
  Phone,
  Shield,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  category?: string;
  suggestedActions?: Array<{ label: string; href: string }>;
  timestamp: string;
}

export function AiConciergeChat() {
  const { user } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `👋 Hello! I am your **Pramila AI Concierge**.\n\nAsk me anything about flat rents, electricity sub-meter tariffs, generating visitor QR passes, reporting repairs, or DMCH hospital vicinity info.`,
      suggestedActions: [
        { label: '⚡ Sub-meter Electricity Rate', href: '/portal/tenant/bills' },
        { label: '🎫 How to create a Visitor QR Pass', href: '/portal/tenant/visitors' },
        { label: '🔧 Report a Plumbing/Electric issue', href: '/portal/tenant/maintenance' },
        { label: '🏥 Hospital Vicinity & Emergency', href: '/#vacancies' },
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim() || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.answer,
          category: data.category,
          suggestedActions: data.suggestedActions,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('Failed to get answer');
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: 'I apologize, I encountered a temporary connection issue. Please contact the Caretaker at **+91 98765 43210** for urgent assistance.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Pill */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-bold rounded-full shadow-2xl shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all"
          title="Open Pramila AI Concierge"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-300 rounded-full animate-ping"></span>
          </div>
          <span className="text-xs font-black tracking-wide uppercase">AI Concierge</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </button>
      )}

      {/* Floating AI Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[390px] h-[540px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black tracking-tight flex items-center gap-1.5">
                  <span>Pramila AI Concierge</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="text-[10px] text-slate-400">24/7 Smart Resident & Estate Assistant</div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line text-xs">{m.text}</p>

                  {/* Suggested Action Chips */}
                  {m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {m.suggestedActions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (act.href.startsWith('/')) {
                              router.push(act.href);
                              setIsOpen(false);
                            } else {
                              handleSend(act.label);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-1 transition-all"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-3 h-3 text-emerald-600" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 w-fit">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                <span className="text-[11px] text-slate-500 font-semibold">Pramila AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Bar */}
          <div className="px-3 py-1.5 bg-slate-100/90 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              'Sub-meter bill calculation',
              'Create QR gate pass',
              'Plumbing leak emergency',
              'DMCH 24/7 chemist',
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                className="text-[10px] bg-white hover:bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full border border-slate-300 whitespace-nowrap transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about Pramila Apartments..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="p-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl shadow-md transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
