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
  const { user, login } = useAuth();
  const [inquiryModal, setInquiryModal] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState('2BHK Deluxe Suite');
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
    <div className="min-h-screen -mt-4 lg:-mt-8 -mx-4 lg:-mx-8 space-y-24 pb-20 overflow-x-hidden bg-black text-neutral-100">
      {/* 🌟 1. Full-Screen Cinematic Monochrome Hero Section */}
      <section className="relative min-h-[90vh] lg:min-h-[95vh] flex flex-col justify-between items-center text-center px-4 sm:px-8 py-12 sm:py-16 overflow-hidden">
        {/* Real Building Background with High-Contrast Dark Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-1000"
          style={{ backgroundImage: "url('/images/building.png')" }}
        />
        {/* Monochromatic Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/95" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/50 to-black/90" />

        {/* Top Header Badge */}
        <div className="relative z-10 pt-4 flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-950/80 border border-neutral-700 backdrop-blur-md text-neutral-300 text-xs tracking-widest uppercase font-medium shadow-2xl">
            <Compass className="w-3.5 h-3.5 text-white" />
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
              className="h-16 sm:h-24 w-auto object-contain brightness-125 contrast-125 drop-shadow-[0_8px_24px_rgba(255,255,255,0.2)]"
            />
          </div>

          <h1 className="font-serif-luxury text-5xl sm:text-7xl lg:text-8xl tracking-tight text-white leading-[1.05] drop-shadow-2xl">
            Pramila Apartments
          </h1>

          <p className="font-cormorant italic text-lg sm:text-2xl text-neutral-300 max-w-2xl mx-auto font-normal tracking-wide drop-shadow">
            Magical luxury living & spacious 2BHK residences situated in the prestigious DMCH vicinity
          </p>

          {/* Minimalist Monochrome Ghost CTA */}
          <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
            <a
              href="#suites"
              className="px-8 py-3.5 border border-white hover:bg-white hover:text-black text-white text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase transition-all duration-300 backdrop-blur-sm rounded-none shadow-xl"
            >
              Experience Pramila Apartments
            </a>

            <button
              onClick={() => setInquiryModal(true)}
              className="px-8 py-3.5 bg-white hover:bg-neutral-200 text-black text-xs sm:text-sm font-black tracking-[0.15em] uppercase transition-all shadow-xl shadow-white/10"
            >
              Inquire Now
            </button>
          </div>
        </div>

        {/* Subtle Bottom Scroll Indicator */}
        <div className="relative z-10 pb-4 text-neutral-500 text-xs tracking-[0.25em] uppercase flex flex-col items-center gap-2">
          <span>Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white to-transparent animate-pulse" />
        </div>
      </section>

      {/* 🌟 2. Docked Availability Widget (Monochrome Black & White) */}
      <div className="max-w-5xl mx-auto px-4 -mt-16 sm:-mt-20 relative z-20">
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            {/* Move-in Date */}
            <div className="border-b md:border-b-0 md:border-r border-neutral-800 pb-4 md:pb-0 md:pr-4">
              <label className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-semibold block mb-1">
                Expected Move-In
              </label>
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-white" />
                <div>
                  <div className="text-sm sm:text-base font-black text-white">Immediate / Ready</div>
                  <div className="text-[10px] text-neutral-400 font-medium">Ready for possession</div>
                </div>
              </div>
            </div>

            {/* Flat Type */}
            <div className="border-b md:border-b-0 md:border-r border-neutral-800 pb-4 md:pb-0 md:pr-4">
              <label className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-semibold block mb-1">
                Residence Type
              </label>
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-white" />
                <div>
                  <div className="text-sm sm:text-base font-black text-white">Spacious 2BHK Flat</div>
                  <div className="text-[10px] text-neutral-400 font-medium">Balcony & Kitchen</div>
                </div>
              </div>
            </div>

            {/* Target Occupancy */}
            <div className="border-b md:border-b-0 md:border-r border-neutral-800 pb-4 md:pb-0 md:pr-4">
              <label className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-semibold block mb-1">
                Occupancy
              </label>
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-white" />
                <div>
                  <div className="text-sm sm:text-base font-black text-white">Doctors & Families</div>
                  <div className="text-[10px] text-neutral-400 font-medium">Civilized Community</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <Link
                href="/register"
                className="w-full py-3 bg-white hover:bg-neutral-200 text-black font-black text-xs uppercase tracking-[0.15em] text-center rounded-xl shadow-lg transition-all"
              >
                Apply Online
              </Link>
              <button
                onClick={() => setInquiryModal(true)}
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 font-bold text-xs uppercase tracking-[0.1em] rounded-xl transition-all"
              >
                Inquire Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 3. Editorial Story Section (Monochrome Black & White) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Building Photo with Monochrome Luxury Styling */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 group">
              <img
                src="/images/building.png"
                alt="Pramila Apartments Building Architecture"
                className="w-full h-[420px] sm:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-semibold">
                  Exterior Architecture
                </span>
                <h3 className="font-serif-luxury text-2xl font-bold text-white">Pramila Apartments</h3>
                <p className="text-xs text-neutral-400">Executive residential building with expansive balconies & covered parking</p>
              </div>
            </div>
          </div>

          {/* Right: Editorial Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-400">
                Prime Darbhanga Address
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                A Peaceful Sanctuary Near DMCH
              </h2>
            </div>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
              Located in the esteemed DMCH Road neighborhood, Pramila Apartments offers an executive residential address that combines tranquil living with instant connectivity.
            </p>

            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-light">
              Situated precisely 500 meters from Darbhanga Medical College & Hospital, each spacious 2BHK flat is thoughtfully crafted with open private balconies, continuous deep-borewell water, round-the-clock CCTV surveillance, individual electric sub-meters, and covered parking.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-800">
              <div className="space-y-1">
                <div className="text-2xl font-serif-luxury font-bold text-white">500 Mts</div>
                <div className="text-xs text-neutral-400">Walking distance to DMCH Hospital</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-serif-luxury font-bold text-white">2BHK</div>
                <div className="text-xs text-neutral-400">Sunlit, ventilated residential flats</div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setInquiryModal(true)}
                className="px-6 py-3 border border-neutral-700 hover:bg-neutral-900 text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all"
              >
                Schedule Private Viewing →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 4. Apartment Suites Showcase (Monochrome Black & White) */}
      <section id="suites" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-400">
            Available Residences
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-black text-white">
            Curated 2BHK Flat Configurations
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light">
            Designed for superior living comfort, privacy, natural airflow, and effortless maintenance.
          </p>
        </div>

        <div className="space-y-12">
          {/* Suite 1: Surya 2BHK Deluxe */}
          <div className="bg-neutral-950 rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
            {/* Left Photo */}
            <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto min-h-[320px]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/building.png')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-neutral-950" />
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-neutral-700 text-[10px] text-white font-bold uppercase tracking-wider">
                Tower A • Balcony Facing
              </div>
            </div>

            {/* Right Details Block */}
            <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif-luxury text-3xl font-black text-white">Surya 2BHK Deluxe</h3>
                    <p className="text-xs text-neutral-400 font-medium">Spacious 2-Bedroom Residential Suite</p>
                  </div>
                </div>

                <div className="text-xs text-neutral-400 bg-neutral-900 p-3 rounded-xl border border-neutral-800 flex justify-between items-center">
                  <span>Target Occupants:</span>
                  <span className="text-white font-bold">Families, Doctors, Medical PG</span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                  A grand 2BHK flat featuring open sunlit balconies with clear road views, spacious living room, separate kitchen slab with 24x7 water line, and independent digital electric sub-meter.
                </p>

                <div className="space-y-2 pt-2 border-t border-neutral-800 text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white shrink-0" />
                    <span>2 Large Bedrooms with cross ventilation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white shrink-0" />
                    <span>Private Balcony with panoramic natural light</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white shrink-0" />
                    <span>24x7 Continuous Water & CCTV Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white shrink-0" />
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
                  className="flex-1 py-3 bg-white hover:bg-neutral-200 text-black font-black text-xs uppercase tracking-[0.15em] rounded-xl text-center shadow-lg transition-all"
                >
                  Inquire Suite
                </button>
                <Link
                  href="/register"
                  className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-[0.1em] rounded-xl border border-neutral-700 flex items-center justify-center transition-all"
                >
                  Apply Online
                </Link>
              </div>
            </div>
          </div>

          {/* Suite 2: Chandra 2BHK Executive */}
          <div className="bg-neutral-950 rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
            {/* Left Details Block */}
            <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between space-y-6 order-2 lg:order-1">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif-luxury text-3xl font-black text-white">Chandra 2BHK Executive</h3>
                    <p className="text-xs text-neutral-400 font-medium">Premium Executive 2-Bedroom Suite</p>
                  </div>
                </div>

                <div className="text-xs text-neutral-400 bg-neutral-900 p-3 rounded-xl border border-neutral-800 flex justify-between items-center">
                  <span>Target Occupants:</span>
                  <span className="text-white font-bold">Senior Healthcare Staff & Executives</span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                  A modern executive flat with premium vitrified tiled finishing, dedicated study or work corner with high-speed fiber internet readiness, modern sanitary fittings, and serene acoustic quietness.
                </p>

                <div className="space-y-2 pt-2 border-t border-neutral-800 text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white shrink-0" />
                    <span>500 Meters easy walk to DMCH main gate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white shrink-0" />
                    <span>Independent sub-meter reading & online bills</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white shrink-0" />
                    <span>Gated security & active guard entry monitoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white shrink-0" />
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
                  className="flex-1 py-3 bg-white hover:bg-neutral-200 text-black font-black text-xs uppercase tracking-[0.15em] rounded-xl text-center shadow-lg transition-all"
                >
                  Inquire Suite
                </button>
                <Link
                  href="/register"
                  className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-[0.1em] rounded-xl border border-neutral-700 flex items-center justify-center transition-all"
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
              <div className="absolute inset-0 bg-gradient-to-l from-black/50 via-transparent to-neutral-950" />
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-neutral-700 text-[10px] text-white font-bold uppercase tracking-wider">
                Tower B • Executive Wing
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 5. Complete Living Comfort & Amenities Grid (Monochrome) */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-400">
            Comfort & Infrastructure
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-black text-white">
            Living Benefits at Pramila Apartments
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light">
            Every convenience thoughtfully arranged to make day-to-day life smooth and comfortable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-neutral-950 rounded-2xl p-6 border border-neutral-800 hover:border-neutral-500 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-lg"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white group-hover:border-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300">
                      {feat.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-neutral-200 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-[11px] font-medium text-neutral-400 mt-0.5">{feat.subtitle}</p>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed font-light">{feat.desc}</p>
                </div>

                <div className="pt-4 border-t border-neutral-900 flex items-center justify-between text-neutral-500 text-[11px]">
                  <span>Pramila Standard</span>
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 🌟 6. Resident Portal & Tenant Access (Monochrome) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl p-8 sm:p-12 border border-neutral-800 bg-neutral-950 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-neutral-200 text-xs font-bold border border-neutral-700">
                <Users className="w-3.5 h-3.5 text-white" />
                <span>Existing Resident Portal</span>
              </span>
              <h3 className="font-serif-luxury text-3xl sm:text-4xl font-black text-white">
                Manage Your Residence Online
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed font-light">
                Residents at Pramila Apartments can instantly pay rent and electricity sub-meter bills, download official payment receipts, generate cryptographic QR gate passes for visitors, and submit maintenance tickets.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={openTenantPortal}
                  className="px-7 py-3 bg-white hover:bg-neutral-200 text-black font-black text-xs uppercase tracking-[0.15em] rounded-xl flex items-center gap-2 shadow-lg transition-all"
                >
                  <span>Launch Tenant Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  href="/register"
                  className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-[0.1em] rounded-xl border border-neutral-700 flex items-center gap-2 transition-all"
                >
                  <span>New Resident Onboarding</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-full max-w-xs p-6 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-800 text-white flex items-center justify-center font-bold">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Instant QR Passes</h4>
                    <p className="text-[10px] text-neutral-400">Zero wait gate check-in</p>
                  </div>
                </div>

                <div className="p-3 bg-black rounded-xl border border-neutral-800 text-[11px] text-neutral-300 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Rent Invoices</span>
                    <span className="text-white font-bold">Instant Online</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Sub-Meter Bill</span>
                    <span className="text-white font-bold">Meter Accurate</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Complaints Desk</span>
                    <span className="text-white font-bold">Photo Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📞 Inquiry Modal (Monochrome) */}
      {inquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <button
              onClick={() => setInquiryModal(false)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto text-black shadow-lg mb-3">
                <Phone className="w-6 h-6 font-bold" />
              </div>
              <h3 className="font-serif-luxury text-2xl font-bold text-white">Inquire & Book a Visit</h3>
              <p className="text-xs text-neutral-400 mt-1">Pramila Apartments • 500 Meters from DMCH</p>
            </div>

            {inquirySubmitted ? (
              <div className="p-6 text-center space-y-2 bg-neutral-900 border border-neutral-700 rounded-2xl">
                <CheckCircle2 className="w-10 h-10 text-white mx-auto" />
                <h4 className="text-sm font-bold text-white">Inquiry Received!</h4>
                <p className="text-xs text-neutral-300">Our building caretaker will contact you shortly to arrange a private walkthrough.</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Kumar"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full bg-black border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Contact Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    className="w-full bg-black border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Preferred Suite</label>
                  <select
                    value={selectedSuite}
                    onChange={(e) => setSelectedSuite(e.target.value)}
                    className="w-full bg-black border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
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
                    className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 py-2.5 rounded-xl text-xs font-semibold border border-neutral-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-white hover:bg-neutral-200 text-black py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg"
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

