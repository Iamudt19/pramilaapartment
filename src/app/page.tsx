'use client';

import React, { useState, useEffect } from 'react';
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
  Calculator,
  Eye,
  Sliders,
  Star,
  Clock,
  ExternalLink,
  Shield,
  Layers,
  Award,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();

  // State
  const [vacantFlats, setVacantFlats] = useState<any[]>([]);
  const [loadingFlats, setLoadingFlats] = useState(true);
  const [inquiryModal, setInquiryModal] = useState(false);
  const [selectedFlatForInquiry, setSelectedFlatForInquiry] = useState<any>(null);
  const [selectedSuite, setSelectedSuite] = useState('Surya 2BHK Deluxe');
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Interactive Calculator State
  const [calcUnits, setCalcUnits] = useState(150);
  const [calcBaseRent, setCalcBaseRent] = useState(22000);
  const [activeFloorTab, setActiveFloorTab] = useState<'master' | 'living' | 'kitchen' | 'balcony' | 'bath'>('master');

  // Fetch Live Vacancies from Database
  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const res = await fetch('/api/flats?public=true');
        if (res.ok) {
          const data = await res.json();
          const allFlats = data.flats || [];
          const vac = allFlats.filter((f: any) => f.status === 'VACANT');
          setVacantFlats(vac);
        }
      } catch (e) {
        console.error('Failed to load vacancies:', e);
      } finally {
        setLoadingFlats(false);
      }
    };
    fetchVacancies();
  }, []);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setInquiryModal(false);
      setInquiryName('');
      setInquiryPhone('');
      setSelectedFlatForInquiry(null);
    }, 2500);
  };

  const handleOpenFlatInquiry = (flat: any) => {
    setSelectedFlatForInquiry(flat);
    setSelectedSuite(`Flat ${flat.flatNumber} (${flat.flatType})`);
    setInquiryModal(true);
  };

  // Calculator Computations
  const electricityRate = 10.0;
  const estimatedElectricity = calcUnits * electricityRate;
  const waterCharges = 0; // Included/Fixed
  const totalEstimatedMonthly = calcBaseRent + estimatedElectricity + waterCharges;

  const roomSpecs = {
    master: {
      title: 'Master Bedroom with Private Balcony',
      dims: '14 ft × 12 ft',
      desc: 'Spacious master suite with direct floor-to-ceiling glass balcony access, abundant cross-ventilation, AC power conduit, and attached western bathroom.',
      features: ['Private open road-facing balcony', 'Attached luxury bathroom', 'Large wardrobe niche', 'Direct morning sunlight'],
    },
    living: {
      title: 'Grand Living & Dining Lounge',
      dims: '18 ft × 12 ft',
      desc: 'Expansive family gathering space with premium vitrified tile flooring, wide entryway, multiple power outlets, and fiber broadband hookup.',
      features: ['Spacious sofa & dining area', 'High-speed optical fiber ready', 'Intercom & digital gate access', 'Cross-breeze airflow'],
    },
    kitchen: {
      title: 'Modern Modular Kitchen & Utility',
      dims: '10 ft × 8 ft',
      desc: 'Black granite countertop, dual water supply line (24x7 fresh deep borewell), exhaust and chimney provision, and dedicated utility wash area.',
      features: ['Granite cooking platform with SS sink', '24x7 continuous pressurized water', 'Dedicated refrigerator bay', 'Exhaust & RO point'],
    },
    balcony: {
      title: 'Open Sunlit Road-Facing Balcony',
      dims: '12 ft × 5 ft',
      desc: 'Private open-air sitout overlooking lush greenery and DMCH road with heavy-duty safety railings and natural daylight all day long.',
      features: ['Unobstructed front views', 'Weather-proof safety grill', 'Planting & relaxation space', 'Fresh morning breeze'],
    },
    bath: {
      title: 'Dual Western Designer Bathrooms',
      dims: '8 ft × 6 ft each',
      desc: 'Anti-skid ceramic flooring, branded CP sanitary fittings, hot/cold mixer points, and high-efficiency ventilation.',
      features: ['Anti-skid floor tiles', 'Geyser electrical point', 'Branded sanitary ware', 'Independent drainage pipes'],
    },
  };

  const currentRoom = roomSpecs[activeFloorTab];

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
    <div className="min-h-screen -mt-4 lg:-mt-8 -mx-4 lg:-mx-8 space-y-20 pb-20 overflow-x-hidden bg-slate-50 text-slate-900">
      {/* 🌟 1. HIGH-IMPACT LUXURY HERO SECTION */}
      <section className="relative min-h-[92vh] lg:min-h-[96vh] flex flex-col justify-between items-center text-center px-4 sm:px-8 py-10 sm:py-14 overflow-hidden">
        {/* Real Building Photograph with Luxury Light Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-1000"
          style={{ backgroundImage: "url('/images/building.png')" }}
        />
        {/* Light Glass Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white/95" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-white/50 to-white/90" />

        {/* Top Floating Pill Badges */}
        <div className="relative z-10 pt-2 flex flex-wrap justify-center items-center gap-2 sm:gap-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 backdrop-blur-md text-slate-800 text-xs font-bold shadow-sm">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>500m from DMCH Hospital • Darbhanga, Bihar</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
            <span>{loadingFlats ? 'Checking Vacancies...' : `${vacantFlats.length} Vacant 2BHK Units Listed Live`}</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>4.9/5 Doctor & Family Rating</span>
          </div>
        </div>

        {/* Center Hero Typography */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 my-auto">
          <div className="flex justify-center pb-1">
            <div className="p-3 bg-white/90 rounded-2xl border border-slate-200 shadow-md">
              <img
                src="/images/logo.png"
                alt="Pramila Apartment Logo"
                className="h-14 sm:h-20 w-auto object-contain"
              />
            </div>
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl tracking-tight text-slate-950 leading-[1.08] font-black drop-shadow-sm">
            Pramila Apartments
          </h1>

          <p className="font-cormorant italic text-xl sm:text-3xl text-slate-700 max-w-2xl mx-auto font-medium leading-relaxed">
            Executive 2BHK residences with sunlit balconies, 24x7 water, and gated security in the prestigious DMCH medical vicinity.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap justify-center items-center gap-3.5">
            <a
              href="#vacancies"
              className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black tracking-[0.1em] uppercase transition-all shadow-xl shadow-emerald-600/25 rounded-2xl flex items-center gap-2"
            >
              <span>View Live Available Flats ({vacantFlats.length})</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#calculator"
              className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold tracking-[0.1em] uppercase border border-slate-300 rounded-2xl shadow-sm transition-all flex items-center gap-2"
            >
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Rent & Utility Estimator</span>
            </a>

            <button
              onClick={() => setInquiryModal(true)}
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold tracking-[0.1em] uppercase rounded-2xl shadow-md transition-all"
            >
              Schedule Walkthrough
            </button>
          </div>
        </div>

        {/* Floating Proximity Strip */}
        <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
          <div className="bg-white/95 p-3.5 rounded-2xl border border-slate-200 shadow-sm backdrop-blur-md">
            <div className="text-[10px] text-slate-500 font-extrabold uppercase">Hospital Vicinity</div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 500m to DMCH Gate
            </div>
          </div>
          <div className="bg-white/95 p-3.5 rounded-2xl border border-slate-200 shadow-sm backdrop-blur-md">
            <div className="text-[10px] text-slate-500 font-extrabold uppercase">Fresh Water 24x7</div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1 mt-0.5">
              <Droplets className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Dual Deep Borewells
            </div>
          </div>
          <div className="bg-white/95 p-3.5 rounded-2xl border border-slate-200 shadow-sm backdrop-blur-md">
            <div className="text-[10px] text-slate-500 font-extrabold uppercase">Sub-Meter System</div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1 mt-0.5">
              <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Individual Digital Meter
            </div>
          </div>
          <div className="bg-white/95 p-3.5 rounded-2xl border border-slate-200 shadow-sm backdrop-blur-md">
            <div className="text-[10px] text-slate-500 font-extrabold uppercase">Gated Community</div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> CCTV & QR Gate Pass
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 2. LIVE VACANT FLATS SHOWCASE (ADMIN SYNCED REAL-TIME) */}
      <section id="vacancies" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              Live Database Vacancies
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900">
              Available 2BHK Residences Right Now
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1 max-w-xl">
              Real-time flat vacancies listed directly by property management. Ready for immediate lease & occupancy.
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-emerald-700">{vacantFlats.length} Units</span>
            <span className="text-xs text-slate-500 block font-semibold">Available for Immediate Move-In</span>
          </div>
        </div>

        {loadingFlats ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-2">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-600">Loading live vacancies from property database...</p>
          </div>
        ) : vacantFlats.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">100% Fully Occupied Society</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              All flats are currently occupied by long-term resident doctors and families. Submit a priority waitlist inquiry to be notified immediately when a flat becomes available!
            </p>
            <button
              onClick={() => setInquiryModal(true)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs shadow-md shadow-emerald-600/20"
            >
              Join Priority Move-in Waitlist
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vacantFlats.map((flat) => (
              <div
                key={flat.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-emerald-500"
              >
                <div>
                  {/* Photo Header */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src="/images/building.png"
                      alt={`Flat ${flat.flatNumber}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                      🟢 Vacant • Ready Move-In
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white flex justify-between items-end">
                      <div>
                        <span className="font-mono text-xl font-black block">Flat {flat.flatNumber}</span>
                        <span className="text-[11px] text-slate-200">
                          {flat.building?.name} • Floor {flat.floor?.floorNumber ?? '1'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-emerald-300 block">{formatCurrency(flat.monthlyRent)}</span>
                        <span className="text-[10px] text-slate-300">/month</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3.5">
                    <div className="flex items-center justify-between text-xs text-slate-600 pb-3 border-b border-slate-100 font-medium">
                      <span>{flat.flatType} Luxury Layout</span>
                      <span>{flat.areaSqFt} sq.ft</span>
                      <span>{flat.bedrooms} BHK</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {flat.notes || 'Sunlit private balcony with road view, continuous water supply, and individual electric sub-meter.'}
                    </p>

                    <div className="space-y-1 text-[11px] text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200 font-medium">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Security Deposit:</span>
                        <span className="font-bold text-slate-900">{formatCurrency(flat.deposit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Maintenance:</span>
                        <span className="font-bold text-slate-900">{formatCurrency(flat.maintenance)}/mo</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sub-Meter Electricity:</span>
                        <span className="font-bold text-emerald-700">₹10.0 / unit (Actual)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenFlatInquiry(flat)}
                    className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs border border-slate-300 transition-all text-center"
                  >
                    Book Walkthrough
                  </button>
                  <Link
                    href={`/register?flat=${flat.flatNumber}`}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all text-center"
                  >
                    Apply for Flat →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🌟 3. INTERACTIVE LIVING COST & SUB-METER TARIFF ESTIMATOR */}
      <section id="calculator" className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <Calculator className="w-3.5 h-3.5 text-emerald-600" /> Transparent Zero-Confusion Billing
            </span>
            <h3 className="font-serif-luxury text-3xl sm:text-4xl font-black text-slate-900">
              Interactive Monthly Cost Estimator
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Simulate your exact monthly living expenses at Pramila Apartments with independent electric sub-meter readings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Sliders */}
            <div className="lg:col-span-7 space-y-6">
              {/* Rent Selection */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Selected 2BHK Flat Base Rent</span>
                  <span className="text-emerald-700 text-sm font-black">{formatCurrency(calcBaseRent)}/mo</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setCalcBaseRent(22000)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      calcBaseRent === 22000
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Surya 2BHK (₹22,000)
                  </button>
                  <button
                    onClick={() => setCalcBaseRent(25000)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      calcBaseRent === 25000
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Chandra 2BHK Exec (₹25,000)
                  </button>
                </div>
              </div>

              {/* Electricity Units Slider */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-extrabold text-slate-800 block">Estimated Monthly Electricity Usage</span>
                    <span className="text-[11px] text-slate-500">Tariff: ₹{electricityRate.toFixed(2)} per unit</span>
                  </div>
                  <span className="font-mono text-base font-black text-emerald-700 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-sm">
                    {calcUnits} Units
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="400"
                  step="10"
                  value={calcUnits}
                  onChange={(e) => setCalcUnits(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>0 Units (Minimal)</span>
                  <span>150 Units (Average 2BHK)</span>
                  <span>300+ Units (Summer AC)</span>
                </div>
              </div>
            </div>

            {/* Right Computed Summary Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50 via-teal-50 to-white p-6 sm:p-7 rounded-3xl border border-emerald-200 shadow-md space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">Total Monthly Estimate</span>
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-full">
                  Idempotent Billing
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Monthly Apartment Rent:</span>
                  <span className="font-bold text-slate-900">{formatCurrency(calcBaseRent)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sub-Meter Power ({calcUnits} units @ ₹10):</span>
                  <span className="font-bold text-slate-900">{formatCurrency(estimatedElectricity)}</span>
                </div>
                <div className="flex justify-between">
                  <span>24x7 Deep Borewell Water Supply:</span>
                  <span className="font-bold text-emerald-700">Included (Free)</span>
                </div>
                <div className="flex justify-between">
                  <span>CCTV & Gated Security:</span>
                  <span className="font-bold text-emerald-700">Included (Free)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase block">Est. Total Monthly</span>
                  <span className="text-2xl font-black text-slate-950">{formatCurrency(totalEstimatedMonthly)}</span>
                </div>
                <button
                  onClick={() => setInquiryModal(true)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all"
                >
                  Book Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 4. INTERACTIVE 2BHK ROOM-BY-ROOM FLOOR PLAN INSPECTOR */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
            <Layers className="w-3.5 h-3.5 text-emerald-600" /> Architectural Layout
          </span>
          <h3 className="font-serif-luxury text-3xl sm:text-4xl font-black text-slate-900">
            Interactive 2BHK Room-by-Room Inspection
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Click across the flat areas to inspect dimensions, natural daylight airflow, and electrical points.
          </p>
        </div>

        {/* Room Switcher Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto max-w-full">
            {[
              { id: 'master', label: 'Master Bed & Balcony' },
              { id: 'living', label: 'Living & Dining Hall' },
              { id: 'kitchen', label: 'Modular Kitchen' },
              { id: 'balcony', label: 'Road View Balcony' },
              { id: 'bath', label: 'Dual Bathrooms' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFloorTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeFloorTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Room Details Interactive Display */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                {currentRoom.dims}
              </span>
              <h4 className="font-serif-luxury text-2xl font-bold text-slate-900">{currentRoom.title}</h4>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{currentRoom.desc}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {currentRoom.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative h-56 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
            <img
              src="/images/building.png"
              alt="Room Inspection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4 text-white">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Pramila Apartments Architecture</span>
                <span className="font-bold text-sm">Spacious Cross-Ventilated 2BHK Layout</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 5. LIVING BENEFITS & AMENITIES GRID */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
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

      {/* 🌟 6. STREAMLINED 2-ROLE PORTALS (TENANTS & ADMIN) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl p-8 sm:p-12 border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-600/20">
                <Users className="w-3.5 h-3.5" />
                <span>Authenticated Portal Access</span>
              </span>
              <h3 className="font-serif-luxury text-3xl sm:text-4xl font-black text-slate-900">
                Digital Living for Residents & Management
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 max-w-xl leading-relaxed">
                Seamless role separation: <strong>Tenants</strong> pay rent, download receipts, and issue QR visitor passes. <strong>Admin</strong> manages vacancies, leases, gate verification, and system settings.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/portal/tenant"
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.1em] rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
                >
                  <span>Resident Portal (Tenants)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/portal/admin"
                  className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-[0.1em] rounded-2xl flex items-center gap-2 transition-all shadow-sm"
                >
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Admin & Vacancy Suite</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-emerald-600" /> Instant QR Passes
                </div>
                <p className="text-[11px] text-slate-500">Zero wait gate clearance</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-blue-600" /> Sub-Meter Billing
                </div>
                <p className="text-[11px] text-slate-500">Meter accurate charges</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-purple-600" /> Complaints Desk
                </div>
                <p className="text-[11px] text-slate-500">Prompt caretaker care</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 24x7 Security
                </div>
                <p className="text-[11px] text-slate-500">CCTV & Guard on duty</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📞 INQUIRY & WALKTHROUGH BOOKING MODAL */}
      {inquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <button
              onClick={() => {
                setInquiryModal(false);
                setSelectedFlatForInquiry(null);
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pt-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto text-emerald-700 shadow-sm mb-3">
                <Phone className="w-6 h-6 font-bold" />
              </div>
              <h3 className="font-serif-luxury text-2xl font-bold text-slate-900">
                {selectedFlatForInquiry ? `Inquire Flat ${selectedFlatForInquiry.flatNumber}` : 'Inquire & Book Walkthrough'}
              </h3>
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
                  <label className="text-xs font-bold text-slate-700 block mb-1">Inquiring For</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedSuite}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInquiryModal(false);
                      setSelectedFlatForInquiry(null);
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold border border-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-600/20"
                  >
                    Submit Inquiry
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
