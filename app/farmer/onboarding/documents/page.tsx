"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileBadge,
  FileText,
  Image as ImageIcon,
  MapPin,
  Upload,
  ArrowLeft,
  ArrowRight,
  Leaf,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";

import { createClient } from "@/lib/supabase";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProgressBar } from "@/components/farmer/ProgressBar";

// Framer Motion Stagger Animation Variants
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

interface UploadState {
  idCard: File | null;
  landOwnership: File | null;
  projectImages: FileList | null;
  geolocationProof: File | null;
}

export default function FarmerDocumentsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [farmerProfileId, setFarmerProfileId] = useState<string | null>(null);

  // Local UI state for document selection preview
  const [uploads, setUploads] = useState<UploadState>({
    idCard: null,
    landOwnership: null,
    projectImages: null,
    geolocationProof: null,
  });

  // Check auth session & load profile ID
  useEffect(() => {
    async function initSession() {
      try {
        setLoading(true);
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          router.replace("/login");
          return;
        }

        setUserId(session.user.id);

        const { data: profile } = await supabase
          .from("farmer_profiles")
          .select("id, onboarding_status")
          .eq("user_id", session.user.id)
          .single();

        if (profile) {
          setFarmerProfileId(profile.id);
        }
      } catch (err) {
        console.error("Error initializing document setup:", err);
      } finally {
        setLoading(false);
      }
    }

    initSession();
  }, [router, supabase]);

  const handleFileChange = (
    key: keyof UploadState,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      if (key === "projectImages") {
        setUploads((prev) => ({ ...prev, [key]: e.target.files }));
      } else {
        setUploads((prev) => ({ ...prev, [key]: e.target.files![0] }));
      }
    }
  };

  const removeFile = (key: keyof UploadState) => {
    setUploads((prev) => ({ ...prev, [key]: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!userId) return;

  try {
    setSubmitting(true);

    const docEntries: Array<{
      user_id: string;
      farmer_profile_id: string | null;
      document_type: string;
      document_url: string;
      document_name: string;
      status: string;
    }> = [];

    // Helper function:
    // Upload the actual file to Supabase Storage
    // and return the exact storage path.
    const uploadFile = async (
      file: File,
      prefix: string,
      index?: number
    ) => {
      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

      const uniquePart = crypto.randomUUID();

      const storageFileName =
        index !== undefined
          ? `${prefix}_${index}_${uniquePart}_${safeFileName}`
          : `${prefix}_${uniquePart}_${safeFileName}`;

      // IMPORTANT:
      // This exact path will be used in both Storage
      // and farmer_documents.document_url
      const storagePath = `${userId}/${storageFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("farmer-documents")
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw new Error(
          `Failed to upload ${file.name}: ${uploadError.message}`
        );
      }

      return storagePath;
    };

    // --------------------------------------------------
    // 1. GOVERNMENT ID
    // --------------------------------------------------
    if (uploads.idCard) {
      const storagePath = await uploadFile(
        uploads.idCard,
        "id_card"
      );

      docEntries.push({
        user_id: userId,
        farmer_profile_id: farmerProfileId,
        document_type: "GOVERNMENT_ID",
        document_url: storagePath,
        document_name: uploads.idCard.name,
        status: "PENDING_VERIFICATION",
      });
    }

    // --------------------------------------------------
    // 2. LAND OWNERSHIP
    // --------------------------------------------------
    if (uploads.landOwnership) {
      const storagePath = await uploadFile(
        uploads.landOwnership,
        "land"
      );

      docEntries.push({
        user_id: userId,
        farmer_profile_id: farmerProfileId,
        document_type: "LAND_OWNERSHIP",
        document_url: storagePath,
        document_name: uploads.landOwnership.name,
        status: "PENDING_VERIFICATION",
      });
    }

    // --------------------------------------------------
    // 3. GEOLOCATION PROOF
    // --------------------------------------------------
    if (uploads.geolocationProof) {
      const storagePath = await uploadFile(
        uploads.geolocationProof,
        "geo"
      );

      docEntries.push({
        user_id: userId,
        farmer_profile_id: farmerProfileId,
        document_type: "GEOLOCATION_MAP",
        document_url: storagePath,
        document_name: uploads.geolocationProof.name,
        status: "PENDING_VERIFICATION",
      });
    }

    // --------------------------------------------------
    // 4. PROJECT IMAGES
    // --------------------------------------------------
    if (
      uploads.projectImages &&
      uploads.projectImages.length > 0
    ) {
      const projectFiles = Array.from(
        uploads.projectImages
      );

      for (let index = 0; index < projectFiles.length; index++) {
        const file = projectFiles[index];

        const storagePath = await uploadFile(
          file,
          "img",
          index
        );

        docEntries.push({
          user_id: userId,
          farmer_profile_id: farmerProfileId,
          document_type: "PROJECT_IMAGE",
          document_url: storagePath,
          document_name: file.name,
          status: "PENDING_VERIFICATION",
        });
      }
    }

    // --------------------------------------------------
    // 5. SAVE DOCUMENT METADATA IN DATABASE
    // --------------------------------------------------
    if (docEntries.length > 0) {
      const { error: docError } = await supabase
        .from("farmer_documents")
        .insert(docEntries);

      if (docError) {
        console.error(
          "Error inserting farmer documents:",
          docError
        );

        alert(
          `Documents uploaded, but metadata could not be saved: ${docError.message}`
        );

        return;
      }
    }

    // --------------------------------------------------
    // 6. UPDATE FARMER PROFILE STATUS
    // --------------------------------------------------
    const { error: profileError } = await supabase
      .from("farmer_profiles")
      .upsert(
        {
          user_id: userId,
          onboarding_status: "PENDING_VERIFICATION",
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      );

    if (profileError) {
      console.error(
        "Error updating profile status:",
        profileError
      );

      alert(
        "Documents were uploaded, but the onboarding status could not be updated."
      );

      return;
    }

    // --------------------------------------------------
    // 7. GO TO VERIFICATION PAGE
    // --------------------------------------------------
    router.push("/farmer/onboarding/verification");
  } catch (err) {
    console.error("Document submit error:", err);

    alert(
      err instanceof Error
        ? err.message
        : "Failed to upload documents. Please try again."
    );
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="min-h-screen bg-sand-100 dark:bg-[#061418] text-ink dark:text-sand-100 flex flex-col justify-between relative overflow-x-hidden transition-colors">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[700px] w-[1000px] rounded-full bg-gradient-to-b from-ocean-300/15 via-mangrove-300/10 to-transparent blur-3xl opacity-70 dark:from-ocean-900/30 dark:via-mangrove-900/20" />

      {/* Global Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-5xl pt-24 sm:pt-28">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4 mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#0a232b]/80 border border-ocean-900/10 dark:border-sand-100/10 shadow-sm backdrop-blur-md">
            <Leaf size={14} className="text-mangrove-600 dark:text-mangrove-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-ink-soft dark:text-sand-100/80">
              Farmer Onboarding
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-ink dark:text-sand-50 tracking-tight">
            Upload Required Documents
          </h1>

          <p className="text-sm sm:text-base text-ink-soft dark:text-sand-100/70 max-w-xl mx-auto leading-relaxed">
            Upload the required documents for verification before submitting your Blue Carbon project.
          </p>
        </motion.div>

        {/* Progress Bar Container (Step 3 of 5) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-10"
        >
          <ProgressBar
            currentStep={3}
            steps={[
              { id: 1, label: "Account" },
              { id: 2, label: "Profile" },
              { id: 3, label: "Documents" },
              { id: 4, label: "Verification" },
              { id: 5, label: "Dashboard" },
            ]}
          />
        </motion.div>

        {/* Upload Cards Grid */}
        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 — Government ID */}
            <motion.div
              variants={cardVariants}
              className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-ocean-900/5 dark:border-sand-100/5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ocean-900/10 text-ocean-900 dark:bg-mangrove-500/20 dark:text-mangrove-300 shrink-0">
                    <FileBadge size={22} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-medium text-ink dark:text-sand-50">
                      Government ID / Proof
                    </h3>
                    <p className="text-xs text-ink-soft dark:text-sand-100/70">
                      Upload your official Government-issued ID card.
                    </p>
                  </div>
                </div>

                {/* Dropzone Container */}
                <div className="relative group border-2 border-dashed border-ocean-900/15 dark:border-sand-100/15 rounded-2xl bg-sand-50/50 dark:bg-[#071a20]/40 p-6 text-center transition-all hover:border-mangrove-500 hover:bg-sand-50 dark:hover:bg-[#071a20]/80">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange("idCard", e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />

                  {uploads.idCard ? (
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-[#0a232b] rounded-xl border border-mangrove-500/30">
                      <div className="flex items-center gap-2.5 truncate">
                        <CheckCircle2 size={18} className="text-mangrove-600 dark:text-mangrove-400 shrink-0" />
                        <span className="text-xs font-mono font-medium text-ink dark:text-sand-50 truncate">
                          {uploads.idCard.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile("idCard");
                        }}
                        className="relative z-30 p-1 text-ink-faint hover:text-red-500 dark:text-sand-100/40 dark:hover:text-red-400 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-[#0a232b] text-ink-soft dark:text-sand-100/60 shadow-sm border border-ocean-900/10 dark:border-sand-100/10 group-hover:scale-105 transition-transform">
                        <Upload size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink dark:text-sand-50">
                          Drag & Drop Government ID here
                        </p>
                        <p className="text-xs text-ink-soft dark:text-sand-100/60 mt-1">
                          or{" "}
                          <span className="text-mangrove-700 dark:text-mangrove-300 underline font-medium">
                            Browse Files
                          </span>
                        </p>
                      </div>
                      <p className="text-[11px] font-mono text-ink-faint dark:text-sand-100/40">
                        Supported Formats: PDF, JPG, PNG (Max 10MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Card 2 — Land Ownership Proof */}
            <motion.div
              variants={cardVariants}
              className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-ocean-900/5 dark:border-sand-100/5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mangrove-500/20 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300 shrink-0">
                    <FileText size={22} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-medium text-ink dark:text-sand-50">
                      Land Ownership Proof
                    </h3>
                    <p className="text-xs text-ink-soft dark:text-sand-100/70">
                      Upload title deeds, lease deeds, or RTC land records.
                    </p>
                  </div>
                </div>

                {/* Dropzone Container */}
                <div className="relative group border-2 border-dashed border-ocean-900/15 dark:border-sand-100/15 rounded-2xl bg-sand-50/50 dark:bg-[#071a20]/40 p-6 text-center transition-all hover:border-mangrove-500 hover:bg-sand-50 dark:hover:bg-[#071a20]/80">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange("landOwnership", e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />

                  {uploads.landOwnership ? (
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-[#0a232b] rounded-xl border border-mangrove-500/30">
                      <div className="flex items-center gap-2.5 truncate">
                        <CheckCircle2 size={18} className="text-mangrove-600 dark:text-mangrove-400 shrink-0" />
                        <span className="text-xs font-mono font-medium text-ink dark:text-sand-50 truncate">
                          {uploads.landOwnership.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile("landOwnership");
                        }}
                        className="relative z-30 p-1 text-ink-faint hover:text-red-500 dark:text-sand-100/40 dark:hover:text-red-400 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-[#0a232b] text-ink-soft dark:text-sand-100/60 shadow-sm border border-ocean-900/10 dark:border-sand-100/10 group-hover:scale-105 transition-transform">
                        <Upload size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink dark:text-sand-50">
                          Drag & Drop Land Records here
                        </p>
                        <p className="text-xs text-ink-soft dark:text-sand-100/60 mt-1">
                          or{" "}
                          <span className="text-mangrove-700 dark:text-mangrove-300 underline font-medium">
                            Browse Files
                          </span>
                        </p>
                      </div>
                      <p className="text-[11px] font-mono text-ink-faint dark:text-sand-100/40">
                        Supported Formats: PDF, JPG, PNG (Max 15MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Card 3 — Mangrove Project Images */}
            <motion.div
              variants={cardVariants}
              className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-ocean-900/5 dark:border-sand-100/5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ocean-900/10 text-ocean-900 dark:bg-mangrove-500/20 dark:text-mangrove-300 shrink-0">
                    <ImageIcon size={22} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-medium text-ink dark:text-sand-50">
                      Mangrove Project Images
                    </h3>
                    <p className="text-xs text-ink-soft dark:text-sand-100/70">
                      Upload ground-level photos of mangrove vegetation.
                    </p>
                  </div>
                </div>

                {/* Dropzone Container */}
                <div className="relative group border-2 border-dashed border-ocean-900/15 dark:border-sand-100/15 rounded-2xl bg-sand-50/50 dark:bg-[#071a20]/40 p-6 text-center transition-all hover:border-mangrove-500 hover:bg-sand-50 dark:hover:bg-[#071a20]/80">
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => handleFileChange("projectImages", e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />

                  {uploads.projectImages && uploads.projectImages.length > 0 ? (
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-[#0a232b] rounded-xl border border-mangrove-500/30">
                      <div className="flex items-center gap-2.5 truncate">
                        <CheckCircle2 size={18} className="text-mangrove-600 dark:text-mangrove-400 shrink-0" />
                        <span className="text-xs font-mono font-medium text-ink dark:text-sand-50 truncate">
                          {uploads.projectImages.length} Image(s) Selected
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile("projectImages");
                        }}
                        className="relative z-30 p-1 text-ink-faint hover:text-red-500 dark:text-sand-100/40 dark:hover:text-red-400 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-[#0a232b] text-ink-soft dark:text-sand-100/60 shadow-sm border border-ocean-900/10 dark:border-sand-100/10 group-hover:scale-105 transition-transform">
                        <Upload size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink dark:text-sand-50">
                          Drag & Drop Photos here
                        </p>
                        <p className="text-xs text-ink-soft dark:text-sand-100/60 mt-1">
                          or{" "}
                          <span className="text-mangrove-700 dark:text-mangrove-300 underline font-medium">
                            Browse Files
                          </span>
                        </p>
                      </div>
                      <p className="text-[11px] font-mono text-ink-faint dark:text-sand-100/40">
                        Supported Formats: JPG, PNG, WEBP (Multiple allowed)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Card 4 — Geo-location Proof */}
            <motion.div
              variants={cardVariants}
              className="rounded-[28px] border border-ocean-900/10 bg-white/80 dark:border-sand-100/10 dark:bg-[#0a232b]/80 backdrop-blur-md p-6 sm:p-8 shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-ocean-900/5 dark:border-sand-100/5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mangrove-500/20 text-mangrove-800 dark:bg-mangrove-500/20 dark:text-mangrove-300 shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-medium text-ink dark:text-sand-50">
                      Geo-location Proof
                    </h3>
                    <p className="text-xs text-ink-soft dark:text-sand-100/70">
                      Upload KML, KMZ, or geo-tagged field photo maps.
                    </p>
                  </div>
                </div>

                {/* Dropzone Container */}
                <div className="relative group border-2 border-dashed border-ocean-900/15 dark:border-sand-100/15 rounded-2xl bg-sand-50/50 dark:bg-[#071a20]/40 p-6 text-center transition-all hover:border-mangrove-500 hover:bg-sand-50 dark:hover:bg-[#071a20]/80">
                  <input
                    type="file"
                    accept=".kml,.kmz,.pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange("geolocationProof", e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />

                  {uploads.geolocationProof ? (
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-[#0a232b] rounded-xl border border-mangrove-500/30">
                      <div className="flex items-center gap-2.5 truncate">
                        <CheckCircle2 size={18} className="text-mangrove-600 dark:text-mangrove-400 shrink-0" />
                        <span className="text-xs font-mono font-medium text-ink dark:text-sand-50 truncate">
                          {uploads.geolocationProof.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile("geolocationProof");
                        }}
                        className="relative z-30 p-1 text-ink-faint hover:text-red-500 dark:text-sand-100/40 dark:hover:text-red-400 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-[#0a232b] text-ink-soft dark:text-sand-100/60 shadow-sm border border-ocean-900/10 dark:border-sand-100/10 group-hover:scale-105 transition-transform">
                        <Upload size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink dark:text-sand-50">
                          Drag & Drop Boundary Map here
                        </p>
                        <p className="text-xs text-ink-soft dark:text-sand-100/60 mt-1">
                          or{" "}
                          <span className="text-mangrove-700 dark:text-mangrove-300 underline font-medium">
                            Browse Files
                          </span>
                        </p>
                      </div>
                      <p className="text-[11px] font-mono text-ink-faint dark:text-sand-100/40">
                        Supported Formats: KML, KMZ, PDF, JPG, PNG
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation Buttons Row */}
          <motion.div
            variants={cardVariants}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4"
          >
            <Link
              href="/farmer/onboarding/profile"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-ocean-900/15 bg-white px-6 py-3.5 text-sm font-medium text-ink shadow-sm hover:bg-sand-50 transition-all dark:border-sand-100/15 dark:bg-[#0a232b] dark:text-sand-100 dark:hover:bg-[#071a20]"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-ocean-900 hover:bg-ocean-700 dark:bg-mangrove-500 dark:hover:bg-mangrove-300 dark:text-ink px-8 py-3.5 text-sm font-medium tracking-wide text-sand-50 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-mangrove-500 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting Documents...</span>
                </>
              ) : (
                <>
                  <span>Submit Documents</span>
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