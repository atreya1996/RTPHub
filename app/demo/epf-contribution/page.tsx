"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import EPFContributionFlow from "../../../src/flows/epf/EPFContributionFlow";

function EpfContributionContent() {
  const searchParams = useSearchParams();
  const packId = searchParams.get("pack") ?? "my";
  return <EPFContributionFlow packId={packId} />;
}

export default function EpfContributionPage() {
  return (
    <Suspense fallback={null}>
      <EpfContributionContent />
    </Suspense>
  );
}
