"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  UserCheck,
  Factory,
  ArrowLeft,
  ArrowRight,
  Save,
  Globe,
  FileText,
  Mail,
  Phone,
  Compass,
  Users,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

// Zod Validation Schema
const industryProfileSchema = z.object({
  // 1. Company Information
  companyName: z.string().min(2, { message: "Company name is required" }),
  industryType: z.string().min(1, { message: "Please select an industry type" }),
  gstNumber: z
    .string()
    .min(15, { message: "GSTIN must be 15 characters" })
    .max(15, { message: "GSTIN must be 15 characters" })
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
      message: "Invalid GSTIN format",
    }),
  cinNumber: z
    .string()
    .min(21, { message: "CIN must be 21 characters" })
    .max(21, { message: "CIN must be 21 characters" }),
  website: z.string().url({ message: "Invalid URL format" }).optional().or(z.literal("")),

  // 2. Company Address
  addressLine1: z.string().min(3, { message: "Address is required" }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  pincode: z
    .string()
    .min(6, { message: "Pincode must be 6 digits" })
    .max(6, { message: "Pincode must be 6 digits" }),
  country: z.string().default("India"),

  // 3. Contact Person
  contactName: z.string().min(2, { message: "Full name is required" }),
  contactDesignation: z.string().min(2, { message: "Designation is required" }),
  contactEmail: z.string().email({ message: "Valid email required" }),
  contactPhone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),

  // 4. Facility Details
  facilityName: z.string().min(2, { message: "Facility name is required" }),
  latitude: z
    .string()
    .min(1, { message: "Latitude required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) >= -90 && Number(val) <= 90, {
      message: "Latitude must be between -90 and 90",
    }),
  longitude: z
    .string()
    .min(1, { message: "Longitude required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) >= -180 && Number(val) <= 180, {
      message: "Longitude must be between -180 and 180",
    }),
  annualEmissions: z
    .string()
    .min(1, { message: "Annual CO₂ emissions required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Must be a positive number",
    }),
  employeeCount: z
    .string()
    .min(1, { message: "Number of employees required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Must be a positive number",
    }),
});

type IndustryProfileData = z.infer<typeof industryProfileSchema>;

const INDUSTRY_TYPES = [
  "Chemicals & Petrochemicals",
  "Steel & Metallurgy",
  "Cement & Building Materials",
  "Textiles & Apparel",
  "Power & Energy Generation",
  "Automotive & Manufacturing",
  "Pharmaceuticals & Biotech",
  "Paper & Pulp",
  "Food Processing & Agriculture",
  "Logistics & Transport",
  "Other Industrial Sector",
];

export default function IndustryProfilePage() {
  const router = useRouter();
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IndustryProfileData>({
    resolver: zodResolver(industryProfileSchema),
    defaultValues: {
      companyName: "",
      industryType: "",
      gstNumber: "",
      cinNumber: "",
      website: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      contactName: "",
      contactDesignation: "",
      contactEmail: "",
      contactPhone: "",
      facilityName: "",
      latitude: "",
      longitude: "",
      annualEmissions: "",
      employeeCount: "",
    },
  });

  const onSubmit = async (data: IndustryProfileData) => {
    console.log("Profile Data Submitted:", data);
    router.push("/industry/onboarding/documents");
  };

  const handleSaveDraft = () => {
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col justify-between relative overflow-x-hidden transition-colors">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-gradient-to-b from-ocean-300/15 via-mangrove-300/10 to-transparent blur-3xl opacity-70 dark:from-ocean-900/25 dark:via-mangrove-900/15" />

      {/* Navigation Header */}
      <header className="relative z-10 border-b border-ocean-900/5 dark:border-sand-100/5 bg-white/40 dark:bg-[#061418]/40 backdrop-blur-md">
        <div className="container-page section-pad flex h-20 items-center justify-between">
          <Link
            href="/industry/onboarding"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink/70 hover:text-ink dark:text-sand-100/70 dark:hover:text-sand-50 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Onboarding Overview</span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 container-page section-pad py-10 max-w-5xl mx-auto">
        {/* Step Indicator Header Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 rounded-2xl border border-ocean-900/10 bg-white/80 p-4 shadow-sm dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-900 text-sand-50 dark:bg-mangrove-500 dark:text-ink font-semibold text-sm shadow-sm">
              02
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-mangrove-700 dark:text-mangrove-300 font-semibold block">
                Onboarding Step 2 of 4
              </span>
              <h2 className="text-base font-semibold text-ink dark:text-sand-50">
                Facility & Operating Profile
              </h2>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-ink-soft dark:text-sand-100/60 bg-sand-50 dark:bg-[#071a20] px-3 py-1.5 rounded-full border border-ocean-900/5 dark:border-sand-100/5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Auto-saving active
          </div>
        </motion.div>

        {/* Page Header Titles */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-mangrove-700 dark:text-mangrove-300 font-medium">
            Industrial Asset Registration
          </span>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-medium tracking-tight text-ink dark:text-sand-50">
            Corporate & Facility Profile
          </h1>
          <p className="mt-2 text-sm text-ink-soft dark:text-sand-100/70 leading-relaxed">
            Provide organization identity metrics, precise facility coordinates, and operational carbon baseline details to activate automated MRV telemetry.
          </p>
        </div>

        {/* Draft Notification Toast */}
        {isDraftSaved && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-3 shadow-sm"
          >
            <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
            <span>Progress saved successfully! You can resume completion anytime.</span>
          </motion.div>
        )}

        {/* Form Container Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-[28px] border border-ocean-900/10 bg-white/90 p-6 sm:p-10 shadow-soft dark:border-sand-100/10 dark:bg-[#0a232b]/90 backdrop-blur-xl"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* 1. COMPANY INFORMATION */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-ocean-900/10 dark:border-sand-100/10 pb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ocean-900/10 text-ocean-900 dark:bg-mangrove-500/20 dark:text-mangrove-300">
                  <Building2 size={20} />
                </div>
                <h3 className="font-display text-lg font-medium text-ink dark:text-sand-50">
                  1. Company Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Company Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Industrial Energy Corp"
                    {...register("companyName")}
                    className={`w-full rounded-xl border bg-sand-50/50 px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                      errors.companyName
                        ? "border-red-400 focus:ring-red-400"
                        : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                    }`}
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                {/* Industry Type */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                    Industry Type *
                  </label>
                  <select
                    {...register("industryType")}
                    className={`w-full rounded-xl border bg-sand-50/50 px-4 py-2.5 text-sm text-ink transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 ${
                      errors.industryType
                        ? "border-red-400 focus:ring-red-400"
                        : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                    }`}
                  >
                    <option value="">Select Industry Type</option>
                    {INDUSTRY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.industryType && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                      {errors.industryType.message}
                    </p>
                  )}
                </div>

                {/* GST Number */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                    GST Number (GSTIN) *
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint dark:text-sand-100/40">
                      <FileText size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="27AAAAA0000A1Z5"
                      {...register("gstNumber")}
                      className={`w-full rounded-xl border bg-sand-50/50 pl-10 pr-4 py-2.5 text-sm text-ink uppercase placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                        errors.gstNumber
                          ? "border-red-400 focus:ring-red-400"
                          : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                      }`}
                    />
                  </div>
                  {errors.gstNumber && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                      {errors.gstNumber.message}
                    </p>
                  )}
                </div>

                {/* CIN Number */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                    Company Registration (CIN) *
                  </label>
                  <input
                    type="text"
                    placeholder="L27100MH2010PLC203948"
                    {...register("cinNumber")}
                    className={`w-full rounded-xl border bg-sand-50/50 px-4 py-2.5 text-sm text-ink uppercase placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                      errors.cinNumber
                        ? "border-red-400 focus:ring-red-400"
                        : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                    }`}
                  />
                  {errors.cinNumber && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                      {errors.cinNumber.message}
                    </p>
                  )}
                </div>

                {/* Website */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                    Website (Optional)
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint dark:text-sand-100/40">
                      <Globe size={16} />
                    </div>
                    <input
                      type="url"
                      placeholder="https://apexindustrial.com"
                      {...register("website")}
                      className={`w-full rounded-xl border bg-sand-50/50 pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                        errors.website
                          ? "border-red-400 focus:ring-red-400"
                          : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                      }`}
                    />
                  </div>
                  {errors.website && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                      {errors.website.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* 2. COMPANY ADDRESS */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-ocean-900/10 dark:border-sand-100/10 pb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ocean-900/10 text-ocean-900 dark:bg-mangrove-500/20 dark:text-mangrove-300">
                  <MapPin size={20} />
                </div>
                <h3 className="font-display text-lg font-medium text-ink dark:text-sand-50">
                  2. Registered Corporate Address
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Address Line 1 */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    placeholder="Plot 42, MIDC Industrial Area"
                    {...register("addressLine1")}
                    className={`w-full rounded-xl border bg-sand-50/50 px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                      errors.addressLine1
                        ? "border-red-400 focus:ring-red-400"
                        : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                    }`}
                  />
                  {errors.addressLine1 && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                      {errors.addressLine1.message}
                    </p>
                  )}
                </div>

                {/* Address Line 2 */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    placeholder="Phase II, Near Tech Park"
                    {...register("addressLine2")}
                    className="w-full rounded-xl border border-ocean-900/15 bg-sand-50/50 px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="Navi Mumbai"
                    {...register("city")}
                    className={`w-full rounded-xl border bg-sand-50/50 px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                      errors.city
                        ? "border-red-400 focus:ring-red-400"
                        : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    placeholder="Maharashtra"
                    {...register("state")}
                    className={`w-full rounded-xl border bg-sand-50/50 px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                      errors.state
                        ? "border-red-400 focus:ring-red-400"
                        : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                    }`}
                  />
                  {errors.state && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                      {errors.state.message}
                    </p>
                  )}
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    placeholder="400710"
                    {...register("pincode")}
                    className={`w-full rounded-xl border bg-sand-50/50 px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                      errors.pincode
                        ? "border-red-400 focus:ring-red-400"
                        : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                    }`}
                  />
                  {errors.pincode && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                      {errors.pincode.message}
                    </p>
                  )}
                </div>

                {/* Country */}
                <div className="sm:col-span-3">
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    disabled
                    {...register("country")}
                    className="w-full sm:w-1/3 rounded-xl border border-ocean-900/10 bg-sand-100/60 px-4 py-2.5 text-sm text-ink-soft font-medium dark:bg-[#071a20]/40 dark:text-sand-100/60 cursor-not-allowed"
                  />
                </div>
              </div>
            </section>

            {/* 3. CONTACT PERSON */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-ocean-900/10 dark:border-sand-100/10 pb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ocean-900/10 text-ocean-900 dark:bg-mangrove-500/20 dark:text-mangrove-300">
                  <UserCheck size={20} />
                </div>
                <h3 className="font-display text-lg font-medium text-ink dark:text-sand-50">
                  3. Authorized Contact Officer
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Contact Full Name */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Vikramaditya Sharma"
                    {...register("contactName")}
                    className={`w-full rounded-xl border bg-sand-50/50 px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                      errors.contactName
                        ? "border-red-400 focus:ring-red-400"
                        : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                    }`}
                  />
                  {errors.contactName && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                      {errors.contactName.message}
                    </p>
                  )}
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                    Designation *
                  </label>
                  <input
                    type="text"
                    placeholder="Head of ESG & Operations"
                    {...register("contactDesignation")}
                    className={`w-full rounded-xl border bg-sand-50/50 px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                      errors.contactDesignation
                        ? "border-red-400 focus:ring-red-400"
                        : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                    }`}
                  />
                  {errors.contactDesignation && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                      {errors.contactDesignation.message}
                    </p>
                  )}
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                    Official Email *
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint dark:text-sand-100/40">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      placeholder="v.sharma@apexindustrial.com"
                      {...register("contactEmail")}
                      className={`w-full rounded-xl border bg-sand-50/50 pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                        errors.contactEmail
                          ? "border-red-400 focus:ring-red-400"
                          : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                      }`}
                    />
                  </div>
                  {errors.contactEmail && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                      {errors.contactEmail.message}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                    Direct Phone Number *
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint dark:text-sand-100/40">
                      <Phone size={16} />
                    </div>
                    <input
                      type="tel"
                      placeholder="+91 98200 12345"
                      {...register("contactPhone")}
                      className={`w-full rounded-xl border bg-sand-50/50 pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                        errors.contactPhone
                          ? "border-red-400 focus:ring-red-400"
                          : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                      }`}
                    />
                  </div>
                  {errors.contactPhone && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                      {errors.contactPhone.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* 4. FACILITY DETAILS */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-ocean-900/10 dark:border-sand-100/10 pb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ocean-900/10 text-ocean-900 dark:bg-mangrove-500/20 dark:text-mangrove-300">
                  <Factory size={20} />
                </div>
                <h3 className="font-display text-lg font-medium text-ink dark:text-sand-50">
                  4. Industrial Facility & Telemetry Coordinates
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Facility Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                    Primary Plant / Facility Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Navi Mumbai Chemical Plant Alpha"
                    {...register("facilityName")}
                    className={`w-full rounded-xl border bg-sand-50/50 px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                      errors.facilityName
                        ? "border-red-400 focus:ring-red-400"
                        : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                    }`}
                  />
                  {errors.facilityName && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                      {errors.facilityName.message}
                    </p>
                  )}
                </div>

                {/* Latitude */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                    Facility Latitude *
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint dark:text-sand-100/40">
                      <Compass size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="19.0330"
                      {...register("latitude")}
                      className={`w-full rounded-xl border bg-sand-50/50 pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                        errors.latitude
                          ? "border-red-400 focus:ring-red-400"
                          : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                      }`}
                    />
                  </div>
                  {errors.latitude && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                      {errors.latitude.message}
                    </p>
                  )}
                </div>

                {/* Longitude */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                    Facility Longitude *
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint dark:text-sand-100/40">
                      <Compass size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="73.0297"
                      {...register("longitude")}
                      className={`w-full rounded-xl border bg-sand-50/50 pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                        errors.longitude
                          ? "border-red-400 focus:ring-red-400"
                          : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                      }`}
                    />
                  </div>
                  {errors.longitude && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                      {errors.longitude.message}
                    </p>
                  )}
                </div>

                {/* Annual CO2 Emissions */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                    Est. Annual CO₂ Emissions (Metric Tonnes) *
                  </label>
                  <input
                    type="number"
                    placeholder="125000"
                    {...register("annualEmissions")}
                    className={`w-full rounded-xl border bg-sand-50/50 px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                      errors.annualEmissions
                        ? "border-red-400 focus:ring-red-400"
                        : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                    }`}
                  />
                  {errors.annualEmissions && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                      {errors.annualEmissions.message}
                    </p>
                  )}
                </div>

                {/* Total Employees */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft dark:text-sand-100/70 mb-1.5">
                    Total Facility Employees *
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-faint dark:text-sand-100/40">
                      <Users size={16} />
                    </div>
                    <input
                      type="number"
                      placeholder="450"
                      {...register("employeeCount")}
                      className={`w-full rounded-xl border bg-sand-50/50 pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-faint/60 transition-all focus:bg-white focus:outline-none focus:ring-2 dark:bg-[#071a20]/60 dark:text-sand-50 dark:placeholder:text-sand-100/40 ${
                        errors.employeeCount
                          ? "border-red-400 focus:ring-red-400"
                          : "border-ocean-900/15 focus:border-mangrove-500 focus:ring-mangrove-500/30 dark:border-sand-100/15"
                      }`}
                    />
                  </div>
                  {errors.employeeCount && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">
                      {errors.employeeCount.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Form Action Controls */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 border-t border-ocean-900/10 dark:border-sand-100/10 pt-6">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-ocean-900/15 text-xs font-medium text-ink hover:bg-sand-50 dark:border-sand-100/15 dark:text-sand-50 dark:hover:bg-[#071a20] transition-colors"
              >
                <Save size={16} />
                <span>Save Draft</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-ocean-900 text-sand-50 hover:bg-ocean-800 dark:bg-mangrove-500 dark:text-ink dark:hover:bg-mangrove-400 text-sm font-semibold transition-all shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Document Verification</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}