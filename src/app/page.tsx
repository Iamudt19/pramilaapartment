'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Building2,
  ShieldCheck,
  QrCode,
  Receipt,
  Wrench,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Shield,
  Zap,
  ChevronRight,
  Eye,
  FileText,
  MapPin,
  Droplets,
  GraduationCap,
  Car,
  Wifi,
  Phone,
  Clock,
  HeartHandshake,
  Check,
  Calendar,
  Layers,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [inquiryModal, setInquiryModal] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryType, setInquiryType] = useState('2BHK');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setInquiryModal(false);
      setInquiryName('');
      setInquiryPhone('');
    }, 2500);
  };

  const openTenantPortal = async () => {
    if (user?.role === 'TENANT') {
      router.push('/portal/tenant');
    } else {
      await login('tenant1@pramila.com');
      router.push('/portal/tenant');
    }
  };

  const features = [
    {
      icon: MapPin,
      title: '500m from DMCH',
      highlight: 'Prime Medical Hub',
      desc: 'Walking distance to Darbhanga Medical College & Hospital. Ideal location for doctors, medical students, healthcare staff, and families.',
      color: 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30',
      badge: '5 Min Walk',
    },
    {
      icon: Building2,
      title: 'Spacious 2BHK Flats',
      highlight: 'Ventilated & Sunlit',
      desc: 'Thoughtfully designed 2-Bedroom flats with private balconies, wide windows for natural sunlight, modern kitchens, and premium tiled finishes.',
      color: 'from-rose-500/20 to-pink-500/20 text-rose-300 border-rose-500/30',
      badge: 'Family & Doctor Friendly',
    },
    {
      icon: ShieldCheck,
      title: '24x7 CCTV & Gated Security',
      highlight: 'Safe & Secure',
      desc: 'Round-the-clock multi-angle CCTV coverage covering all entry gates, staircases, and corridors with an active on-duty security guard.',
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30',
      badge: '24x7 Protected',
    },
    {
      icon: Droplets,
      title: '24x7 Pure Water Supply',
      highlight: 'Dual Storage System',
      desc: 'Uninterrupted freshwater supply with dedicated deep borewell and high-capacity overhead & underground reservoirs.',
      color: 'from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30',
      badge: 'Never Runs Out',
    },
    {
      icon: GraduationCap,
      title: 'Top Schools & Coaching Nearby',
      highlight: 'Educational Vicinity',
      desc: 'Reputed public schools, higher secondary colleges, and competitive coaching institutes located within 1-2 km radius.',
      color: 'from-violet-500/20 to-purple-500/20 text-violet-300 border-violet-500/30',
      badge: 'Nearby Colleges',
    },
    {
      icon: Zap,
      title: '24x7 Power Backup & Sub-Meters',
      highlight: 'Zero Billing Confusion',
      desc: 'Independent digital electric sub-meters for each flat. Inverter/generator support for common lighting, water pumps, and essential points.',
      color: 'from-yellow-500/20 to-amber-500/20 text-yellow-300 border-yellow-500/30',
      badge: 'Individual Meters',
    },
    {
      icon: Car,
      title: 'Covered Ground Floor Parking',
      highlight: 'Reserved Vehicle Bays',
      desc: 'Spacious, weather-protected ground-level parking for four-wheelers and two-wheelers with secure gated access.',
      color: 'from-teal-500/20 to-emerald-500/20 text-teal-300 border-teal-500/30',
      badge: 'Car & Bike Parking',
    },
    {
      icon: Wifi,
      title: 'High-Speed Fiber Ready',
      highlight: 'Work From Home Ready',
      desc: 'Pre-wired high-speed optical fiber broadband connections available from leading telecom service providers.',
      color: 'from-sky-500/20 to-indigo-500/20 text-sky-300 border-sky-500/30',
      badge: 'Optic Fiber',
    },
    {
      icon: ShoppingBag,
      title: 'Markets & Pharmacies in 2 Mins',
      highlight: 'Everyday Convenience',
      desc: 'Supermarkets, daily vegetable & fruit markets, 24-hour pharmacies, grocery stores, and ATMs right around the corner.',
      color: 'from-orange-500/20 to-red-500/20 text-orange-300 border-orange-500/30',
      badge: 'Walkable Stores',
    },
    {
      icon: QrCode,
      title: 'Smart Resident App & QR Passes',
      highlight: 'Digital Experience',
      desc: 'Residents can easily pay rent and electricity online, download instant receipts, create visitor QR gate passes, and raise maintenance tickets.',
      color: 'from-emerald-500/20 to-cyan-500/20 text-emerald-300 border-emerald-500/30',
      badge: 'Resident Portal',
    },
    {
      icon: Wrench,
      title: 'On-Call Maintenance Support',
      highlight: 'Quick Assistance',
      desc: 'Dedicated caretakers, electricians, and plumbers on call to promptly resolve any flat maintenance or repair queries.',
      color: 'from-blue-500/20 to-slate-500/20 text-blue-300 border-blue-500/30',
      badge: 'Fast Resolution',
    },
    {
      icon: HeartHandshake,
      title: 'Peaceful & Welcoming Community',
      highlight: 'Family Environment',
      desc: 'Safe, civilized, and respectful neighborhood with clean common areas, wide stairways, and well-lit corridors.',
      color: 'from-rose-500/20 to-amber-500/20 text-rose-300 border-rose-500/30',
      badge: 'Civilized Living',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-20 py-4 animate-fadeIn">
      {/* 🌟 Luxury Hero Section with Real Building Image Background */}
      <div className="relative rounded-[2.5rem] overflow-hidden border border-amber-900/40 shadow-2xl">
        {/* Background Photo with Peach/Amber Glassmorphism Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-1000"
          style={{ backgroundImage: "url('/images/building.png')" }}
        />
        {/* Multilayered Gradient for readability and warmth matching the building facade */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/75 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-amber-950/30" />

        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Logo + Proximity Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-lg flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>500 Meters from DMCH, Darbhanga</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> 2BHK Flats Available
              </div>
            </div>

            {/* Official Logo Banner */}
            <div className="pt-1 pb-2">
              <img
                src="/images/logo.png"
                alt="Pramila Apartment Logo"
                className="h-16 sm:h-20 w-auto object-contain brightness-110 drop-shadow-[0_4px_16px_rgba(251,191,36,0.3)]"
              />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
              Experience Modern Comfort &{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-orange-300 to-rose-300">
                Peaceful Residential Living
              </span>
            </h1>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl font-normal drop-shadow">
              Welcome to <strong>Pramila Apartments</strong> — an executive residential address featuring spacious, well-ventilated 2BHK flats with 24x7 security, continuous water supply, dedicated parking, and premier proximity just 500 meters from DMCH.
            </p>

            {/* Feature Highlights Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 max-w-lg">
              <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/80 px-3 py-2 rounded-xl text-xs text-slate-200">
                <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Spacious 2BHK</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/80 px-3 py-2 rounded-xl text-xs text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>24x7 CCTV</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/80 px-3 py-2 rounded-xl text-xs text-slate-200">
                <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>24x7 Water</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/80 px-3 py-2 rounded-xl text-xs text-slate-200">
                <GraduationCap className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Nearby Schools</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/80 px-3 py-2 rounded-xl text-xs text-slate-200">
                <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>Power Backup</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/80 px-3 py-2 rounded-xl text-xs text-slate-200">
                <Car className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Covered Parking</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/register"
                className="px-7 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black rounded-2xl shadow-xl shadow-amber-500/20 flex items-center gap-2 text-sm transition-all transform hover:-translate-y-0.5"
              >
                <span>Apply for Flat Onboarding</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={openTenantPortal}
                className="px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-white font-bold rounded-2xl border border-slate-700 flex items-center gap-2 text-sm transition-all shadow-lg"
              >
                <Users className="w-4 h-4 text-emerald-400" /> Enter Resident Portal
              </button>

              <button
                onClick={() => setInquiryModal(true)}
                className="px-5 py-3.5 bg-slate-950/80 hover:bg-slate-900 text-amber-300 font-semibold rounded-2xl border border-amber-500/30 flex items-center gap-2 text-sm transition-all"
              >
                <Phone className="w-4 h-4" /> Book a Visit / Enquire
              </button>
            </div>
          </div>

          {/* Right Hero Visual Card - Building Showcase & Highlights */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card rounded-3xl p-6 border border-amber-500/30 shadow-2xl relative overflow-hidden bg-slate-950/85">
              {/* Card Header with Logo */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-bold">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Tower A & Tower B</h3>
                    <p className="text-xs text-amber-300/80">Pramila Apartments • DMCH Road</p>
                  </div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/40 animate-pulse">
                  Ready to Move
                </span>
              </div>

              {/* Building Quick Spec Sheet */}
              <div className="py-4 space-y-3">
                <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400" /> Flat Configuration
                  </span>
                  <span className="font-extrabold text-white">Spacious 2BHK Layouts</span>
                </div>

                <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-400" /> Distance to DMCH
                  </span>
                  <span className="font-bold text-amber-300">500 Meters (3 min walk)</span>
                </div>

                <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-cyan-400" /> Water & Power
                  </span>
                  <span className="font-semibold text-emerald-400">24x7 Deep Borewell & Backup</span>
                </div>

                <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Security
                  </span>
                  <span className="text-slate-200 font-medium">CCTV + Active Guard</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <Link
                  href="/register"
                  className="w-full py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Submit Tenant Application Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🏡 All Benefits & Living Comfort Features Grid */}
      <div id="flat-features" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Why Choose Pramila Apartments</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Designed for Living Comfort, Safety & Peace of Mind
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Every flat is crafted to provide a serene home environment with prime connectivity, modern essentials, and transparent management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="glass-card rounded-3xl p-6 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-lg bg-slate-950/60"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.color} border flex items-center justify-center font-bold shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                      {feat.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-amber-400/90 mt-0.5">{feat.highlight}</p>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-900 flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Pramila Apartments Standard</span>
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 📍 Location & Neighborhood Highlights Section */}
      <div id="location-features" className="rounded-[2.5rem] glass-card p-8 lg:p-12 border border-slate-800 bg-slate-950/80 relative overflow-hidden space-y-8">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>Strategic Location in Darbhanga</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Everything You Need Just Steps Away
          </h2>
          <p className="text-xs text-slate-400">
            Save travel time and commute effortlessly with all vital infrastructure, hospitals, educational institutions, and markets located within immediate proximity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-2xl font-black text-amber-400">500 Mts</div>
            <h4 className="text-sm font-bold text-white">DMCH Hospital</h4>
            <p className="text-xs text-slate-400">Quick 3-5 min walk to all hospital departments, OPDs, and emergency care.</p>
          </div>

          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-2xl font-black text-emerald-400">2 Mins</div>
            <h4 className="text-sm font-bold text-white">Markets & Pharmacies</h4>
            <p className="text-xs text-slate-400">Daily fresh vegetables, grocery stores, medicine shops, and ATMs on the main road.</p>
          </div>

          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-2xl font-black text-violet-400">&lt; 1 Km</div>
            <h4 className="text-sm font-bold text-white">Schools & Institutes</h4>
            <p className="text-xs text-slate-400">Premier private schools, science/medical coaching centers, and colleges nearby.</p>
          </div>

          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-2xl font-black text-cyan-400">10 Mins</div>
            <h4 className="text-sm font-bold text-white">Station & Transport</h4>
            <p className="text-xs text-slate-400">Easy accessibility to Darbhanga Railway Junction, bus stands, and auto stands.</p>
          </div>
        </div>
      </div>

      {/* 📱 Resident Portal & Onboarding Banner */}
      <div className="rounded-[2.5rem] p-8 lg:p-12 border border-emerald-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Users className="w-3.5 h-3.5" />
              <span>Resident Self-Service Suite</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Already a Resident at Pramila Apartments?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Log in to your tenant account to pay your monthly rent and electricity bill, download official receipts, request maintenance support with photos, and generate QR gate passes for your visiting guests.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={openTenantPortal}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <span>Launch Tenant Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/register"
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl border border-slate-700 text-xs flex items-center gap-2 transition-all"
              >
                <span>New Resident Onboarding</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="w-full max-w-xs p-6 bg-slate-900/90 rounded-3xl border border-slate-800 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Instant QR Passes</h4>
                  <p className="text-[10px] text-slate-400">Zero wait gate check-in</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Rent Invoices</span>
                  <span className="text-emerald-400 font-bold">Instant Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sub-Meter Bill</span>
                  <span className="text-cyan-400 font-bold">Meter Accurate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Complaints Desk</span>
                  <span className="text-amber-400 font-bold">Photo Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📞 Inquiry / Visit Booking Modal */}
      {inquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="text-center pt-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center mx-auto text-slate-950 shadow-lg mb-3">
                <Phone className="w-6 h-6 font-bold" />
              </div>
              <h3 className="text-lg font-black text-white">Book a Visit & Inquiry</h3>
              <p className="text-xs text-slate-400 mt-1">Pramila Apartments, 500m from DMCH Road</p>
            </div>

            {inquirySubmitted ? (
              <div className="p-6 text-center space-y-2 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Inquiry Received!</h4>
                <p className="text-xs text-emerald-300">Our building caretaker will contact you shortly to schedule your visit.</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Kumar"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Contact Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Requirement</label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="2BHK">Spacious 2BHK Flat</option>
                    <option value="DOCTOR_STAFF">Doctor / Medical Staff Lease</option>
                    <option value="FAMILY">Family Long-term Lease</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setInquiryModal(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-amber-500/20"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

