"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  ChevronRight,
  Clock3,
  FileCheck,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { getSupabaseClient } from "@/lib/supabase";

interface IndustryApplication {
  id: string;
  user_id: string;
  company_name: string | null;
  industry_type: string | null;
  gst_number: string | null;
  cin_number: string | null;
  onboarding_status: string;
  created_at: string;
}

export default function IndustryApplicationsPage() {
  const [applications, setApplications] = useState<IndustryApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setError("Unable to connect to Supabase.");
      setIsLoading(false);
      return;
    }

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Please login as Authority.");
        setIsLoading(false);
        return;
      }

      const { data, error: applicationsError } = await supabase
        .from("industry_profiles")
        .select(
          `
          id,
          user_id,
          company_name,
          industry_type,
          gst_number,
          cin_number,
          onboarding_status,
          created_at
        `
        )
        .eq("onboarding_status", "PENDING_VERIFICATION")
        .order("created_at", { ascending: false });

      if (applicationsError) {
        throw applicationsError;
      }

      setApplications(data || []);
    } catch (err) {
      console.error("Authority applications error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load industry applications."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Authority Dashboard
          </Link>

          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Industry Applications
              </h1>

              <p className="text-sm text-muted-foreground">
                Review industry entities waiting for verification
              </p>
            </div>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />

              <p className="text-sm text-muted-foreground">
                Loading applications...
              </p>
            </div>
          </div>
        ) : applications.length === 0 ? (
          /* Empty */
          <div className="rounded-2xl border border-border/60 bg-card p-12 text-center shadow-sm">
            <Clock3 className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

            <h2 className="text-lg font-semibold">
              No Pending Applications
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              There are currently no Industry applications waiting for
              verification.
            </p>
          </div>
        ) : (
          /* Applications */
          <div className="space-y-4">
            {applications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* Company */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold">
                        {application.company_name || "Unnamed Company"}
                      </h2>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {application.industry_type ||
                          "Industry type not provided"}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600">
                          PENDING VERIFICATION
                        </span>

                        <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
                          CIN: {application.cin_number || "N/A"}
                        </span>

                        <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
                          GST: {application.gst_number || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review */}
                  <Link
                    href={`/admin/users/industry/${application.id}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <FileCheck className="h-4 w-4" />
                    Review Application
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}