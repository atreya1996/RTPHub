"use client";

import { useSearchParams } from "next/navigation";
import EPFContributionFlow from "../../../src/flows/epf/EPFContributionFlow";

export default function EpfContributionPage() {
  const searchParams = useSearchParams();
  const packId = searchParams.get("pack") ?? "my";
  return <EPFContributionFlow packId={packId} />;
}
