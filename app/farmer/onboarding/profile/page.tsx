"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Ruler,
  FileBadge,
  Compass,
  Upload,
  ArrowLeft,
  ArrowRight,
  Leaf,
  Globe2,
  Map,
  Loader2,
} from "lucide-react";

import { createClient } from "@/lib/supabase";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProgressBar } from "@/components/farmer/ProgressBar";

// Framer Motion Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function FarmerProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  // Page Loading & User state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");

  // Form Fields State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [stateName, setStateName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [landArea, setLandArea] = useState("");
  const [unit, setUnit] = useState("acres");
  const [description, setDescription] = useState("");

  // Geolocation
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationCaptured, setLocationCaptured] = useState<boolean>(false);

  // Photo upload preview
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // 1. Fetch current session & existing profile details
  useEffect(() => {
    async function loadFarmerProfile() {
      try {
        setLoading(true);
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          router.replace("/login");
          return;
        }

        setUserId(session.user.id);
        setUserEmail(session.user.email || "");

        // Fetch existing farmer profile row if present
        const { data: profile } = await supabase
          .from("farmer_profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (profile) {
          if (profile.full_name) setFullName(profile.full_name);
          if (profile.phone) setPhone(profile.phone);
          if (profile.location) {
            const locParts = profile.location.split(",");
            if (locParts[0]) setVillage(locParts[0].trim());
            if (locParts[1]) setDistrict(locParts[1].trim());
            if (locParts[2]) setStateName(locParts[2].trim());
          }
        }
      } catch (err) {
        console.error("Error loading farmer profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFarmerProfile();
  }, [router, supabase]);

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude.toFixed(6));
          setLng(position.coords.longitude.toFixed(6));
          setIsLocating(false);
          setLocationCaptured(true);
        },
        () => {
          setLat("12.971598");
          setLng("77.594566");
          setIsLocating(false);
          setLocationCaptured(true);
        }
      );
    } else {
      setLat("12.971598");
      setLng("77.594566");
      setIsLocating(false);
      setLocationCaptured(true);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  // 2. Submit & update farmer profile in Supabase
  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      setSaving(true);

      const locationString = [village, district, stateName]
        .filter(Boolean)
        .join(", ");

      // Update or insert profile row with PENDING_DOCUMENTS status
      const { error } = await supabase.from("farmer_profiles").upsert(
        {
          user_id: userId,
          full_name: fullName,
          phone: phone,
          location: locationString,
          onboarding_status: "PENDING_DOCUMENTS",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      if (error) {
        console.error("Failed to save profile:", error);
        alert("Failed to save profile details. Please try again.");
        return;
      }

      // Advance to Step 3: Land Documents
      router.push("/farmer/onboarding/documents");
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-100 dark:bg-[#061418] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-mangrove-600 dark:text-mangrove-400" />
          <p className="text-xs font-mono text-ink-soft dark:text-sand-100/70">
            Loading profile information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col justify-between relative overflow-x-hidden transition-colors">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[700px] w-[1000px] rounded-full bg-gradient-to-b from-ocean-300/15 via-mangrove-300/10 to-transparent blur-3xl opacity-70 dark:from-ocean-900/30 dark:via-mangrove-900/20" />

      {/* Global Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-5xl pt-24 sm:pt-28">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4 mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#0a232b]/80 border border-ocean-900/10 dark:border-sand-100/10 shadow-sm backdrop-blur-md">
            <Leaf size={14} className="text-mangrove-600 dark:text-mangrove-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-ink-soft dark:text-sand-100/80">
              BlueCarbon Nexus Registry
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-ink dark:text-sand-50 tracking-tight">
            Complete Farmer Profile
          </h1>

          <p className="text-sm sm:text-base text-ink-soft dark:text-sand-100/70 max-w-xl mx-auto leading-relaxed">
            Complete your profile before registering your Blue Carbon restoration project and uploading satellite MRV documents.
          </p>
        </motion.div>

        {/* Progress Bar Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-10"
        >
          <ProgressBar
            currentStep={2}
            steps={[
              { id: 1, label: "Account" },
              { id: 2, label: "Profile" },
              { id: 3, label: "Documents" },
              { id: 4, label: "Verification" },
              { id: 5, label: "Dashboard" },
            ]}
          />
        </motion.div>

        {/* Form Container */}
        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmitProfile}
          className="space-y-8"
        >
          {/* Card 1 — Personal Information */}
          <motion.div
            variants={cardVariants}
            className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-10 shadow-soft"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ocean-900/5 dark:border-sand-100/5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ocean-900/10 text-ocean-900 dark:bg-mangrove-500/20 dark:text-mangrove-300">
                <User size={22} />
              </div>
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-medium text-ink dark:text-sand-50">
                  Personal Information
                </h2>
                <p className="text-xs sm:text-sm text-ink-soft dark:text-sand-100/70">
                  Your primary contact details for regional verification and communication.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint dark:text-sand-100/40">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 pl-10 pr-4 py-3 text-sm text-ink dark:text-sand-50 placeholder:text-ink-faint/60 dark:placeholder:text-sand-100/40 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-mangrove-500/30 focus:border-mangrove-500 dark:border-sand-100/15"
                  />
                </div>
              </div>

              {/* Email (Readonly) */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  Email Address <span className="text-xs font-sans text-ink-faint">(Readonly)</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint dark:text-sand-100/40">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    readOnly
                    value={userEmail || "farmer@bluecarbonnexus.org"}
                    className="w-full rounded-xl border border-ocean-900/10 bg-sand-200/50 dark:bg-[#071a20]/30 pl-10 pr-4 py-3 text-sm text-ink-soft dark:text-sand-100/60 cursor-not-allowed dark:border-sand-100/10"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint dark:text-sand-100/40">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 pl-10 pr-4 py-3 text-sm text-ink dark:text-sand-50 placeholder:text-ink-faint/60 dark:placeholder:text-sand-100/40 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-mangrove-500/30 focus:border-mangrove-500 dark:border-sand-100/15"
                  />
                </div>
              </div>

              {/* Village */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  Village <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint dark:text-sand-100/40">
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Sunderpur"
                    className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 pl-10 pr-4 py-3 text-sm text-ink dark:text-sand-50 placeholder:text-ink-faint/60 dark:placeholder:text-sand-100/40 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-mangrove-500/30 focus:border-mangrove-500 dark:border-sand-100/15"
                  />
                </div>
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  District <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint dark:text-sand-100/40">
                    <Building size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. South 24 Parganas"
                    className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 pl-10 pr-4 py-3 text-sm text-ink dark:text-sand-50 placeholder:text-ink-faint/60 dark:placeholder:text-sand-100/40 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-mangrove-500/30 focus:border-mangrove-500 dark:border-sand-100/15"
                  />
                </div>
              </div>

              {/* State */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint dark:text-sand-100/40">
                    <Globe2 size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="e.g. West Bengal"
                    className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 pl-10 pr-4 py-3 text-sm text-ink dark:text-sand-50 placeholder:text-ink-faint/60 dark:placeholder:text-sand-100/40 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-mangrove-500/30 focus:border-mangrove-500 dark:border-sand-100/15"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2 — Project Information */}
          <motion.div
            variants={cardVariants}
            className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-10 shadow-soft"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ocean-900/5 dark:border-sand-100/5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mangrove-500/20 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300">
                <Leaf size={22} />
              </div>
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-medium text-ink dark:text-sand-50">
                  Project Information
                </h2>
                <p className="text-xs sm:text-sm text-ink-soft dark:text-sand-100/70">
                  Specify land dimensions and restoration site details.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
              {/* Organization / Farm Name */}
              <div className="sm:col-span-3">
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  Organization / Farm Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint dark:text-sand-100/40">
                    <Building size={18} />
                  </div>
                  <input
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="e.g. Sunderbans Delta Restoration Society"
                    className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 pl-10 pr-4 py-3 text-sm text-ink dark:text-sand-50 placeholder:text-ink-faint/60 dark:placeholder:text-sand-100/40 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-mangrove-500/30 focus:border-mangrove-500 dark:border-sand-100/15"
                  />
                </div>
              </div>

              {/* Land Area */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  Land Area
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint dark:text-sand-100/40">
                    <Ruler size={18} />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    value={landArea}
                    onChange={(e) => setLandArea(e.target.value)}
                    placeholder="e.g. 25.5"
                    className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 pl-10 pr-4 py-3 text-sm text-ink dark:text-sand-50 placeholder:text-ink-faint/60 dark:placeholder:text-sand-100/40 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-mangrove-500/30 focus:border-mangrove-500 dark:border-sand-100/15"
                  />
                </div>
              </div>

              {/* Unit Dropdown */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 px-4 py-3 text-sm text-ink dark:text-sand-50 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-mangrove-500/30 focus:border-mangrove-500 dark:border-sand-100/15"
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                </select>
              </div>

              {/* Mangrove Project Location Textarea */}
              <div className="sm:col-span-3">
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  Mangrove Project Location & Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe coastal topology, tidal range, and primary mangrove species (e.g. Rhizophora mucronata, Avicennia marina)..."
                  className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 p-4 text-sm text-ink dark:text-sand-50 placeholder:text-ink-faint/60 dark:placeholder:text-sand-100/40 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-mangrove-500/30 focus:border-mangrove-500 dark:border-sand-100/15"
                />
              </div>
            </div>
          </motion.div>

          {/* Card 3 — Identity Information */}
          <motion.div
            variants={cardVariants}
            className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-10 shadow-soft"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ocean-900/5 dark:border-sand-100/5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ocean-900/10 text-ocean-900 dark:bg-mangrove-500/20 dark:text-mangrove-300">
                <FileBadge size={22} />
              </div>
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-medium text-ink dark:text-sand-50">
                  Identity Information
                </h2>
                <p className="text-xs sm:text-sm text-ink-soft dark:text-sand-100/70">
                  Select your government identification type for verification.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {/* Government ID Type */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  Government ID Type
                </label>
                <select className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 px-4 py-3 text-sm text-ink dark:text-sand-50 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-mangrove-500/30 focus:border-mangrove-500 dark:border-sand-100/15">
                  <option value="aadhaar">Government ID / Identity Card</option>
                  <option value="passport">Passport</option>
                  <option value="voter_id">Voter ID</option>
                  <option value="driving_license">Driving License</option>
                </select>
              </div>

              {/* Government ID Number */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-2">
                  Government ID Number
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint dark:text-sand-100/40">
                    <FileBadge size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter ID number"
                    className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 dark:bg-[#071a20]/60 pl-10 pr-4 py-3 text-sm text-ink dark:text-sand-50 placeholder:text-ink-faint/60 dark:placeholder:text-sand-100/40 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-mangrove-500/30 focus:border-mangrove-500 dark:border-sand-100/15"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 4 — Project Location */}
          <motion.div
            variants={cardVariants}
            className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-10 shadow-soft"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mangrove-500/20 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300 shrink-0">
                  <Compass size={22} />
                </div>
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-medium text-ink dark:text-sand-50">
                    Project Location
                  </h2>
                  <p className="text-xs sm:text-sm text-ink-soft dark:text-sand-100/70">
                    Provide exact GPS coordinates for satellite boundary tracking.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ocean-900/15 bg-white px-5 py-2.5 text-xs font-mono font-medium text-ink shadow-sm hover:bg-sand-50 transition-all dark:border-sand-100/15 dark:bg-[#071a20] dark:text-sand-100 dark:hover:bg-[#082028] disabled:opacity-50 shrink-0 self-start sm:self-auto"
              >
                <Map size={15} className="text-mangrove-600 dark:text-mangrove-400" />
                <span>
                  {isLocating
                    ? "Fetching Coordinates..."
                    : locationCaptured
                    ? `Captured (${lat}, ${lng}) ✓`
                    : "Use Current Location"}
                </span>
              </button>
            </div>
          </motion.div>

          {/* Card 5 — Profile Photo */}
          <motion.div
            variants={cardVariants}
            className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-10 shadow-soft"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ocean-900/5 dark:border-sand-100/5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ocean-900/10 text-ocean-900 dark:bg-mangrove-500/20 dark:text-mangrove-300">
                <Upload size={22} />
              </div>
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-medium text-ink dark:text-sand-50">
                  Profile Photo
                </h2>
                <p className="text-xs sm:text-sm text-ink-soft dark:text-sand-100/70">
                  Upload a clear image for project developer verification.
                </p>
              </div>
            </div>

            {/* Drag & Drop Upload Container */}
            <div className="relative group border-2 border-dashed border-ocean-900/15 dark:border-sand-100/15 rounded-2xl bg-sand-50/50 dark:bg-[#071a20]/40 p-8 text-center transition-all hover:border-mangrove-500 hover:bg-sand-50 dark:hover:bg-[#071a20]/80">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />

              {photoPreview ? (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <img
                    src={photoPreview}
                    alt="Profile Preview"
                    className="h-24 w-24 rounded-full object-cover border-2 border-mangrove-500 shadow-md"
                  />
                  <span className="text-xs font-mono text-mangrove-700 dark:text-mangrove-300 font-medium">
                    Photo Selected — Click or Drag to replace
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-[#0a232b] text-ink-soft dark:text-sand-100/60 shadow-sm border border-ocean-900/10 dark:border-sand-100/10 group-hover:scale-105 transition-transform">
                    <Upload size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink dark:text-sand-50">
                      Upload Profile Photo
                    </p>
                    <p className="text-xs text-ink-soft dark:text-sand-100/60 mt-1">
                      Drag & Drop image here, or{" "}
                      <span className="text-mangrove-700 dark:text-mangrove-300 underline font-medium">
                        Browse Image
                      </span>
                    </p>
                  </div>
                  <p className="text-[11px] font-mono text-ink-faint dark:text-sand-100/40">
                    Supports JPG, PNG, WEBP (Max 5MB)
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Navigation Buttons Row */}
          <motion.div
            variants={cardVariants}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4"
          >
            <Link
              href="/farmer/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-ocean-900/15 bg-white px-6 py-3.5 text-sm font-medium text-ink shadow-sm hover:bg-sand-50 transition-all dark:border-sand-100/15 dark:bg-[#0a232b] dark:text-sand-100 dark:hover:bg-[#071a20]"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-ocean-900 hover:bg-ocean-700 dark:bg-mangrove-500 dark:hover:bg-mangrove-300 dark:text-ink px-8 py-3.5 text-sm font-medium tracking-wide text-sand-50 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-mangrove-500 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Save & Continue</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </motion.div>
        </motion.form>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}