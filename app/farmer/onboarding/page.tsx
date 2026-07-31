import ProgressBar from "@/components/farmer/ProgressBar";

export default function FarmerPage() {
  return (
    <main className="min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto px-8 py-14">

        <h1 className="text-5xl font-bold text-center">
          Farmer Onboarding
        </h1>

        <p className="text-gray-600 text-center mt-4">
          Complete your setup to register your Blue Carbon project.
        </p>

        <div className="mt-16">
          <ProgressBar currentStep={2} />
        </div>

      </div>

    </main>
  );
}