"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Leaf, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { getSupabaseClient } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

const NAV_LINKS = [
  { label: "Solutions", href: "#solutions" },
  { label: "Technology", href: "#technology" },
  { label: "GIS Registry", href: "#gis-registry" },
  { label: "Marketplace", href: "#marketplace" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // =====================================================
  // SCROLL EFFECT
  // =====================================================

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // =====================================================
  // SUPABASE AUTH STATE
  // =====================================================

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setUser(null);
      return;
    }

    // Get currently logged-in user
    supabase.auth
      .getUser()
      .then(({ data: { user } }) => {
        setUser(user);
      })
      .catch((error) => {
        console.error("Unable to get current user:", error);
        setUser(null);
      });

    // Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // =====================================================
  // SIGN OUT
  // =====================================================

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      const supabase = getSupabaseClient();

      // Sign out from Supabase
      if (supabase) {
        const { error } = await supabase.auth.signOut();

        if (error) {
          console.error("Supabase sign out error:", error);
        }
      }

      // Clear stored role
      localStorage.removeItem("selectedRole");

      // Clear local user state
      setUser(null);

      // Close mobile menu
      setOpen(false);

      // Go to home page and replace current history
      router.replace("/");
    } catch (error) {
      console.error("Sign out error:", error);

      // Even if Supabase sign out fails,
      // clear local role and leave the dashboard
      localStorage.removeItem("selectedRole");

      setUser(null);
      setOpen(false);

      router.replace("/");
    } finally {
      setIsSigningOut(false);
    }
  };

  // =====================================================
  // GET STARTED
  // =====================================================

  const handleGetStarted = () => {
    setOpen(false);

    router.push("/role-selection");
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-sand-50/85 backdrop-blur-md shadow-[0_1px_0_0_rgba(10,61,92,0.08)] dark:bg-[#061418]/85"
          : "bg-transparent"
      )}
    >
      <nav className="container-page section-pad flex h-[72px] items-center justify-between">

        {/* =================================================
            LOGO
        ================================================= */}

        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ocean-900 text-mangrove-300 dark:bg-mangrove-500 dark:text-ink">
            <Leaf size={15} strokeWidth={2.25} />
          </span>

          <span className="font-display text-[17px] font-medium tracking-tight text-ink dark:text-sand-50">
            BlueCarbon Nexus
          </span>
        </Link>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13.5px] font-medium text-ink/70 transition-colors hover:text-ink dark:text-sand-100/70 dark:hover:text-sand-50"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* =================================================
            DESKTOP ACTIONS
        ================================================= */}

        <div className="hidden items-center gap-3 lg:flex">

          <ThemeToggle />

          <Button
            variant="primary"
            size="md"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>

          {/* =================================================
              LOGGED-IN USER
          ================================================= */}

          {user ? (
            <div className="flex items-center gap-2">

              {/* User Email */}

              <div className="flex items-center gap-2 rounded-full border border-ocean-900/10 bg-sand-100/60 px-3.5 py-1.5 text-xs font-medium text-ink dark:border-sand-100/15 dark:bg-[#0a232b] dark:text-sand-100">

                <User
                  size={14}
                  className="text-mangrove-600 dark:text-mangrove-400"
                />

                <span className="max-w-[150px] truncate">
                  {user.email}
                </span>

              </div>

              {/* Sign Out */}

              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-sand-100/70 dark:hover:text-red-400"
                title="Sign Out"
              >
                <LogOut size={14} />

                <span>
                  {isSigningOut ? "Signing Out..." : "Sign Out"}
                </span>
              </button>

            </div>
          ) : null}

        </div>

        {/* =================================================
            MOBILE ACTIONS
        ================================================= */}

        <div className="flex items-center gap-2 lg:hidden">

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink dark:text-sand-50"
          >
            {open ? (
              <X size={19} />
            ) : (
              <Menu size={19} />
            )}
          </button>

        </div>

      </nav>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            className="overflow-hidden border-t border-ocean-900/10 bg-sand-50 lg:hidden dark:border-sand-100/10 dark:bg-[#061418]"
          >

            <div className="section-pad flex flex-col gap-1 py-4">

              {/* Navigation Links */}

              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-[14px] font-medium text-ink/80 hover:bg-ocean-900/[0.04] dark:text-sand-100/80 dark:hover:bg-sand-100/[0.06]"
                >
                  {link.label}
                </a>
              ))}

              {/* =================================================
                  MOBILE USER SECTION
              ================================================= */}

              <div className="mt-2 flex flex-col gap-2 px-3">

                {user ? (
                  <div className="flex flex-col gap-2 border-t border-ocean-900/10 pt-2 dark:border-sand-100/10">

                    {/* User Email */}

                    <div className="flex items-center gap-2 text-xs font-medium text-ink dark:text-sand-100">

                      <User
                        size={14}
                        className="text-mangrove-600 dark:text-mangrove-400"
                      />

                      <span className="truncate">
                        {user.email}
                      </span>

                    </div>

                    {/* Mobile Sign Out */}

                    <Button
                      variant="secondary"
                      size="md"
                      className="w-full"
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                    >
                      {isSigningOut
                        ? "Signing Out..."
                        : "Sign Out"}
                    </Button>

                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={handleGetStarted}
                  >
                    Get Started
                  </Button>
                )}

              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}