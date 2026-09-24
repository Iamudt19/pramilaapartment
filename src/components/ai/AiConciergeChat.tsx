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
      {/* Floating Trigger Pill (Elevated above mobile nav on mobile) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 group flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950 text-white font-bold rounded-full shadow-2xl shadow-blue-900/40 hover:scale-105 active:scale-95 transition-all border border-blue-700"
          title="Open Pramila AI Concierge"
        >
          <div className="relative">
            <Bot className="w-4 sm:w-5 h-4 sm:h-5 text-white animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
          </div>
          <span className="text-[11px] sm:text-xs font-black tracking-wide uppercase">AI Concierge</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </button>
      )}

      {/* Floating AI Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 lg:bottom-6 right-3 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-[390px] h-[520px] max-h-[75vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="px-4 sm:px-5 py-3.5 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white flex items-center justify-between border-b border-blue-900">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black tracking-tight flex items-center gap-1.5">
                  <span>Pramila AI Concierge</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
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
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 bg-slate-50/70 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] sm:max-w-[85%] rounded-2xl p-3 sm:p-3.5 shadow-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-blue-950 text-white rounded-br-none'
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
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-[11px] font-bold flex items-center gap-1 transition-all"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-3 h-3 text-blue-700" />
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
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></div>
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
                className="text-[10px] bg-white hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-full border border-slate-300 whitespace-nowrap transition-colors"
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
            className="p-2.5 sm:p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about bills, passes, repairs..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-700 focus:bg-white"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="p-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-40 text-white rounded-xl shadow-md transition-all"
            >
              <Send className="w-4 h-4 text-amber-300" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
