"use client";

import { useRouter } from "next/navigation";

export default function RoleSelectionPage() {
  const router = useRouter();

  const chooseRole = (role: string) => {
    // we'll save this later
    localStorage.setItem("selectedRole", role);

    // go to signup
    router.push("/signup");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-4xl w-full px-6">

        <h1 className="text-4xl font-bold text-center">
          Choose Your Role
        </h1>

        <p className="text-center text-gray-500 mt-3">
          Select how you want to use BlueCarbon Nexus.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-12">

          <div
            onClick={() => chooseRole("farmer")}
            className="cursor-pointer rounded-xl border p-8 hover:shadow-xl transition"
          >
            <h2 className="text-2xl font-bold">
              🌱 Farmer
            </h2>

            <p className="mt-3 text-gray-600">
              Register mangrove projects and earn carbon credits.
            </p>
          </div>

          <div
            onClick={() => chooseRole("buyer")}
            className="cursor-pointer rounded-xl border p-8 hover:shadow-xl transition"
          >
            <h2 className="text-2xl font-bold">
              🏭 Industry Buyer
            </h2>

            <p className="mt-3 text-gray-600">
              Purchase verified carbon credits.
            </p>
          </div>

          <div
            onClick={() => chooseRole("admin")}
            className="cursor-pointer rounded-xl border p-8 hover:shadow-xl transition"
          >
            <h2 className="text-2xl font-bold">
              🛡 Admin
            </h2>

            <p className="mt-3 text-gray-600">
              Manage the BlueCarbon Nexus platform.
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}