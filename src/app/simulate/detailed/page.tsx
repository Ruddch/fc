import { Suspense } from "react";
import DetailedSimulationResultsClient from "./DetailedSimulationResultsClient";

export default function DetailedSimulationResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen city-pop-bg relative z-10"><div className="md:ml-86 p-4 md:p-8 pt-16 md:pt-8"><div className="flex items-center justify-center min-h-[60vh]"><div className="text-lg text-white/60 font-medium">Loading...</div></div></div></div>}>
      <DetailedSimulationResultsClient />
    </Suspense>
  );
}

