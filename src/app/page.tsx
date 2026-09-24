'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Building2,
  ShieldCheck,
  QrCode,
  Droplets,
  Zap,
  Car,
  Wifi,
  ShoppingBag,
  GraduationCap,
  MapPin,
  HeartHandshake,
  Wrench,
  Check,
  ArrowRight,
  Phone,
  Calendar,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Users,
  Compass,
  Key,
  X,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [inquiryModal, setInquiryModal] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState('Surya 2BHK Deluxe');
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
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

  const openTenantPortal = () => {
    if (user?.role === 'TENANT') {
      router.push('/portal/tenant');
    } else {
      router.push('/login');
    }
  };

  const features = [
    {
      icon: MapPin,
      title: '500m from DMCH',
      subtitle: 'Prime Medical Vicinity',
      desc: 'Walking distance to Darbhanga Medical College & Hospital. An ideal residential sanctuary for doctors, healthcare staff, students, and families.',
      badge: '5 Min Walk',
    },
    {
      icon: Building2,
      title: 'Spacious 2BHK Flats',
      subtitle: 'Sunlit & Ventilated',
      desc: 'Thoughtfully designed 2-Bedroom luxury layouts with private open balconies, ample natural cross-ventilation, and modern kitchens.',
      badge: '2BHK Layouts',
    },
    {
      icon: ShieldCheck,
      title: '24x7 CCTV & Gated Security',
      subtitle: 'Guarded Peace of Mind',
      desc: 'Round-the-clock multi-angle CCTV surveillance across all gates and corridors, coupled with an active on-duty security guard.',
      badge: '24x7 Secure',
    },
    {
      icon: Droplets,
      title: '24x7 Pure Water Supply',
      subtitle: 'Dual Storage System',
      desc: 'Continuous freshwater supply with a dedicated deep borewell and heavy-duty overhead & underground reservoir tanks.',
      badge: 'Dual Reservoirs',
    },
    {
      icon: GraduationCap,
      title: 'Top Schools & Colleges Nearby',
      subtitle: 'Academic Hub',
      desc: 'Close proximity to reputed English medium schools, premier coaching centers, and colleges within 500m - 1.5km.',
      badge: 'Nearby Institutes',
    },
    {
      icon: Zap,
      title: '24x7 Power Backup & Sub-Meters',
      subtitle: 'Zero Billing Confusion',
      desc: 'Independent digital sub-meters for each flat. Backup generators and inverters for common lighting, water pumps, and essential services.',
      badge: 'Individual Meters',
    },
    {
      icon: Car,
      title: 'Covered Ground Floor Parking',
      subtitle: 'Reserved Bays',
      desc: 'Spacious, weather-protected ground-level parking for four-wheelers and two-wheelers with secure gated access.',
      badge: 'Car & Bike Parking',
    },
    {
      icon: Wifi,
      title: 'High-Speed Optical Fiber Ready',
      subtitle: 'Work From Home Ready',
      desc: 'Pre-wired high-speed optical fiber broadband connections available from leading telecom service providers.',
      badge: 'Fiber Broadband',
    },
    {
      icon: ShoppingBag,
      title: 'Markets & Pharmacies in 2 Mins',
      subtitle: 'Daily Convenience',
      desc: 'Supermarkets, daily vegetable & fruit markets, 24-hour pharmacies, grocery stores, and ATMs right around the corner.',
      badge: 'Walkable Stores',
    },
    {
      icon: QrCode,
      title: 'Smart Resident App & QR Passes',
      subtitle: 'Modern Digital Living',
      desc: 'Residents can easily pay rent and electricity online, download instant receipts, create visitor QR gate passes, and raise maintenance tickets.',
      badge: 'Resident Portal',
    },
    {
      icon: Wrench,
      title: 'On-Call Maintenance Support',
      subtitle: 'Prompt Caretaker Service',
      desc: 'Dedicated caretakers, electricians, and plumbers on call to promptly resolve any flat maintenance or repair queries.',
      badge: 'Rapid Response',
    },
    {
      icon: HeartHandshake,
      title: 'Peaceful & Welcoming Community',
      subtitle: 'Respectful Neighborhood',
      desc: 'Safe, civilized, and respectful neighborhood with clean common areas, wide stairways, and well-lit corridors.',
      badge: 'Family Living',
    },
  ];

  return (
    <div className="min-h-screen -mt-4 lg:-mt-8 -mx-4 lg:-mx-8 space-y-24 pb-20 overflow-x-hidden bg-slate-50 text-slate-900">
      {/* 🌟 1. Full-Screen Cinematic Bright Hero Section */}
      <section className="relative min-h-[90vh] lg:min-h-[95vh] flex flex-col justify-between items-center text-center px-4 sm:px-8 py-12 sm:py-16 overflow-hidden">
        {/* Real Building Background with High-End Light Luxury Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-1000"
          style={{ backgroundImage: "url('/images/building.png')" }}
        />
        {/* Bright Luxury Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white/95" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-white/60 to-white/90" />

        {/* Top Header Badge */}
        <div className="relative z-10 pt-4 flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200 backdrop-blur-md text-slate-700 text-xs tracking-widest uppercase font-bold shadow-md">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>500 Meters from DMCH • Darbhanga, Bihar</span>
          </div>
        </div>

        {/* Center Hero Typography */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 my-auto">
          {/* Metallic Logo */}
          <div className="flex justify-center pb-2">
            <img
              src="/images/logo.png"
              alt="Pramila Apartment Logo"
              className="h-16 sm:h-24 w-auto object-contain drop-shadow-md"
            />
          </div>

          <h1 className="font-serif-luxury text-5xl sm:text-7xl lg:text-8xl tracking-tight text-slate-950 leading-[1.05] drop-shadow-sm font-black">
            Pramila Apartments
          </h1>

          <p className="font-cormorant italic text-xl sm:text-3xl text-slate-700 max-w-2xl mx-auto font-medium tracking-wide">
            Magical luxury living & spacious 2BHK residences situated in the prestigious DMCH vicinity
          </p>

          {/* Hero CTAs */}
          <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
            <a
              href="#suites"
              className="px-8 py-3.5 border-2 border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 text-xs sm:text-sm font-bold tracking-[0.15em] uppercase transition-all duration-300 backdrop-blur-sm rounded-2xl shadow-lg"
            >
              Explore 2BHK Suites
            </a>

            <button
              onClick={() => setInquiryModal(true)}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black tracking-[0.15em] uppercase transition-all shadow-xl shadow-emerald-600/25 rounded-2xl"
            >
              Inquire Now
            </button>
          </div>
        </div>

        {/* Subtle Bottom Scroll Indicator */}
        <div className="relative z-10 pb-4 text-slate-500 text-xs tracking-[0.25em] uppercase flex flex-col items-center gap-2">
          <span className="font-bold">Scroll Down</span>
          <div className="w-[2px] h-8 bg-gradient-to-b from-emerald-600 to-transparent animate-pulse" />
        </div>
      </section>

      {/* 🌟 2. Docked Availability Widget (Bright White Card) */}
      <div className="max-w-5xl mx-auto px-4 -mt-16 sm:-mt-20 relative z-20">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            {/* Move-in Date */}
            <div className="border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-4">
              <label className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-extrabold block mb-1">
                Expected Move-In
              </label>
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-sm sm:text-base font-black text-slate-900">Immediate / Ready</div>
                  <div className="text-[10px] text-slate-500 font-medium">Ready for possession</div>
                </div>
              </div>
            </div>

            {/* Flat Type */}
            <div className="border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-4">
              <label className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-extrabold block mb-1">
                Residence Type
              </label>
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-sm sm:text-base font-black text-slate-900">Spacious 2BHK Flat</div>
                  <div className="text-[10px] text-slate-500 font-medium">Balcony & Kitchen</div>
                </div>
              </div>
            </div>

            {/* Target Occupancy */}
            <div className="border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-4">
              <label className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-extrabold block mb-1">
                Occupancy
              </label>
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-sm sm:text-base font-black text-slate-900">Doctors & Families</div>
                  <div className="text-[10px] text-slate-500 font-medium">Civilized Community</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <Link
                href="/register"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.15em] text-center rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
              >
                Apply Online
              </Link>
              <button
                onClick={() => setInquiryModal(true)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs uppercase tracking-[0.1em] rounded-xl transition-all"
              >
                Inquire Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 3. Editorial Story Section (White Luxury Theme) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Building Photo with Luxury White Styling */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group bg-white">
              <img
                src="/images/building.png"
                alt="Pramila Apartments Building Architecture"
                className="w-full h-[420px] sm:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-400 font-extrabold">
                  Exterior Architecture
                </span>
                <h3 className="font-serif-luxury text-2xl font-bold text-white">Pramila Apartments</h3>
                <p className="text-xs text-slate-200">Executive residential building with expansive balconies & covered parking</p>
              </div>
            </div>
          </div>

          {/* Right: Editorial Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-700">
                Prime Darbhanga Address
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                A Peaceful Sanctuary Near DMCH
              </h2>
            </div>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
              Located in the esteemed DMCH Road neighborhood, Pramila Apartments offers an executive residential address that combines tranquil living with instant connectivity.
            </p>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
              Situated precisely 500 meters from Darbhanga Medical College & Hospital, each spacious 2BHK flat is thoughtfully crafted with open private balconies, continuous deep-borewell water, round-the-clock CCTV surveillance, individual electric sub-meters, and covered parking.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div className="space-y-1">
                <div className="text-2xl font-serif-luxury font-bold text-slate-900">500 Mts</div>
                <div className="text-xs text-slate-500 font-medium">Walking distance to DMCH Hospital</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-serif-luxury font-bold text-slate-900">2BHK</div>
                <div className="text-xs text-slate-500 font-medium">Sunlit, ventilated residential flats</div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setInquiryModal(true)}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs uppercase tracking-[0.15em] font-bold shadow-md transition-all"
              >
                Schedule Private Viewing →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 4. Apartment Suites Showcase (White Cards) */}
      <section id="suites" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-emerald-700">
            Available Residences
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900">
            Curated 2BHK Flat Configurations
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal">
            Designed for superior living comfort, privacy, natural airflow, and effortless maintenance.
          </p>
        </div>

        <div className="space-y-12">
          {/* Suite 1: Surya 2BHK Deluxe */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12">
            {/* Left Photo */}
            <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto min-h-[320px]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/building.png')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-white" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 text-[10px] text-slate-900 font-extrabold uppercase tracking-wider shadow-md">
                Tower A • Balcony Facing
              </div>
            </div>

            {/* Right Details Block */}
            <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-serif-luxury text-3xl font-black text-slate-900">Surya 2BHK Deluxe</h3>
                  <p className="text-xs text-emerald-700 font-bold">Spacious 2-Bedroom Residential Suite</p>
                </div>

                <div className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center">
                  <span className="font-medium text-slate-500">Target Occupants:</span>
                  <span className="text-slate-900 font-bold">Families, Doctors, Medical PG</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  A grand 2BHK flat featuring open sunlit balconies with clear road views, spacious living room, separate kitchen slab with 24x7 water line, and independent digital electric sub-meter.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-200 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>2 Large Bedrooms with cross ventilation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Private Balcony with panoramic natural light</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>24x7 Continuous Water & CCTV Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dedicated Ground Floor Parking Bay</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setSelectedSuite('Surya 2BHK Deluxe');
                    setInquiryModal(true);
                  }}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.15em] rounded-xl text-center shadow-lg shadow-emerald-600/20 transition-all"
                >
                  Inquire Suite
                </button>
                <Link
                  href="/register"
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-[0.1em] rounded-xl border border-slate-300 flex items-center justify-center transition-all"
                >
                  Apply Online
                </Link>
              </div>
            </div>
          </div>

          {/* Suite 2: Chandra 2BHK Executive */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12">
            {/* Left Details Block */}
            <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between space-y-6 order-2 lg:order-1">
              <div className="space-y-4">
                <div>
                  <h3 className="font-serif-luxury text-3xl font-black text-slate-900">Chandra 2BHK Executive</h3>
                  <p className="text-xs text-emerald-700 font-bold">Premium Executive 2-Bedroom Suite</p>
                </div>

                <div className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center">
                  <span className="font-medium text-slate-500">Target Occupants:</span>
                  <span className="text-slate-900 font-bold">Senior Healthcare Staff & Executives</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  A modern executive flat with premium vitrified tiled finishing, dedicated study or work corner with high-speed fiber internet readiness, modern sanitary fittings, and serene acoustic quietness.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-200 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>500 Meters easy walk to DMCH main gate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Independent sub-meter reading & online bills</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Gated security & active guard entry monitoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>On-call caretaker & maintenance response</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setSelectedSuite('Chandra 2BHK Executive');
                    setInquiryModal(true);
                  }}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.15em] rounded-xl text-center shadow-lg shadow-emerald-600/20 transition-all"
                >
                  Inquire Suite
                </button>
                <Link
                  href="/register"
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-[0.1em] rounded-xl border border-slate-300 flex items-center justify-center transition-all"
                >
                  Apply Online
                </Link>
              </div>
            </div>

            {/* Right Photo */}
            <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto min-h-[320px] order-1 lg:order-2">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/building.png')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-l from-slate-950/40 via-transparent to-white" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 text-[10px] text-slate-900 font-extrabold uppercase tracking-wider shadow-md">
                Tower B • Executive Wing
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 5. Complete Living Comfort & Amenities Grid (White Theme) */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-emerald-700">
            Comfort & Infrastructure
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900">
            Living Benefits at Pramila Apartments
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal">
            Every convenience thoughtfully arranged to make day-to-day life smooth and comfortable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-500/60 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-md hover:shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                      {feat.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-[11px] font-bold text-emerald-700 mt-0.5">{feat.subtitle}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{feat.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="font-semibold text-slate-500">Pramila Standard</span>
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 🌟 6. Resident Portal & Tenant Access (Bright Emerald/White Banner) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl p-8 sm:p-12 border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-600/20">
                <Users className="w-3.5 h-3.5" />
                <span>Existing Resident Portal</span>
              </span>
              <h3 className="font-serif-luxury text-3xl sm:text-4xl font-black text-slate-900">
                Manage Your Residence Online
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 max-w-xl leading-relaxed font-normal">
                Residents at Pramila Apartments can instantly pay rent and electricity sub-meter bills, download official payment receipts, generate cryptographic QR gate passes for visitors, and submit maintenance tickets.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={openTenantPortal}
                  className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.15em] rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
                >
                  <span>Launch Tenant Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  href="/register"
                  className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-[0.1em] rounded-2xl border border-slate-300 flex items-center gap-2 transition-all shadow-sm"
                >
                  <span>New Resident Onboarding</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-full max-w-xs p-6 bg-white rounded-3xl border border-slate-200 space-y-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Instant QR Passes</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Zero wait gate check-in</p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-700 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Rent Invoices</span>
                    <span className="text-emerald-700 font-bold">Instant Online</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Sub-Meter Bill</span>
                    <span className="text-slate-900 font-bold">Meter Accurate</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Complaints Desk</span>
                    <span className="text-slate-900 font-bold">Photo Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📞 Inquiry Modal (White Theme) */}
      {inquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <button
              onClick={() => setInquiryModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pt-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto text-emerald-700 shadow-sm mb-3">
                <Phone className="w-6 h-6 font-bold" />
              </div>
              <h3 className="font-serif-luxury text-2xl font-bold text-slate-900">Inquire & Book a Visit</h3>
              <p className="text-xs text-slate-500 mt-1">Pramila Apartments • 500 Meters from DMCH</p>
            </div>

            {inquirySubmitted ? (
              <div className="p-6 text-center space-y-2 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">Inquiry Received!</h4>
                <p className="text-xs text-slate-600">Our building caretaker will contact you shortly to arrange a private walkthrough.</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Kumar"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Suite</label>
                  <select
                    value={selectedSuite}
                    onChange={(e) => setSelectedSuite(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="Surya 2BHK Deluxe">Surya 2BHK Deluxe Suite</option>
                    <option value="Chandra 2BHK Executive">Chandra 2BHK Executive Suite</option>
                    <option value="DOCTOR_STAFF">Doctor / Healthcare Professional Lease</option>
                    <option value="FAMILY">Family Long-term Lease</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setInquiryModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold border border-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-600/20"
                  >
                    Submit
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
