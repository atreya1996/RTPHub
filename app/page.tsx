"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import DeviceFrame from "../components/DeviceFrame";
import ExplainPanel from "../components/ExplainPanel";
import FlowRunner from "../components/FlowRunner";
import HubTile from "../components/HubTile";
import ThemeStudio from "../components/ThemeStudio";
import AppProfileHeader from "../components/AppProfileHeader";
import type { ResolvedContext, UseCase } from "../lib/schema/types";
import { countryCodeFromPackId } from "../lib/runtime/currencyByCountry";
import type { Demo } from "@/types/demo";
import Skeleton from "@/components/ui/Skeleton";
import { loadPackBundle, preloadPackBundle, type PackBundle } from "@/runtime/packs/packLoader";

const PACKS = ["my", "ph", "th", "id"] as const;

function resolvePackId(searchParams: URLSearchParams) {
  const queryPack = searchParams.get("pack");
  if (queryPack && PACKS.includes(queryPack as (typeof PACKS)[number])) return queryPack;
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem("activePack");
    if (stored && PACKS.includes(stored as (typeof PACKS)[number])) return stored;
  }
  return "my";
}

function applyTheme(bundle: PackBundle) {
  const root = document.documentElement;
  root.style.setProperty("--color-primary", bundle.theme.colors.primary);
  root.style.setProperty("--color-accent1", bundle.theme.colors.accent1);
  root.style.setProperty("--color-accent2", bundle.theme.colors.accent2);
  root.style.setProperty("--color-ink", bundle.theme.colors.ink);
  root.style.setProperty("--color-bg", bundle.theme.colors.bg);
  root.style.setProperty("--color-surface", bundle.theme.colors.surface);
  root.style.setProperty("--color-border", bundle.theme.colors.border);
  root.style.setProperty("--font-family", bundle.theme.typography.fontFamily);
  root.style.setProperty("--radius-card", `${bundle.theme.radius.card}px`);
  root.style.setProperty("--radius-button", `${bundle.theme.radius.button}px`);
  root.style.setProperty("--shadow-card", bundle.theme.shadow.card);
}

function HomePageContent() {
  const searchParams = useSearchParams();
  const currentPackId = resolvePackId(searchParams);
  const [bundle, setBundle] = useState<PackBundle | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "timeout" | "ready">("loading");
  const [activeHub, setActiveHub] = useState<"acquiring" | "bills">("acquiring");
  const [activeUsecase, setActiveUsecase] = useState<UseCase | null>(null);
  const [query, setQuery] = useState("");
  const [demo, setDemo] = useState<Demo>({ networkMode: "Normal", outcomeMode: "Happy", latencyMultiplier: 1 });

  useEffect(() => {
    setLoadState("loading");
    const timer = window.setTimeout(() => {
      setLoadState((prev) => (prev === "loading" ? "timeout" : prev));
    }, 3000);

    loadPackBundle(currentPackId).then((data) => {
      clearTimeout(timer);
      applyTheme(data);
      setBundle(data);
      setLoadState("ready");
      setActiveUsecase((activeHub === "acquiring" ? data.acquiring : data.bills)[0]);
      window.localStorage.setItem("activePack", data.pack.packId);

      const firstMerchant = data.merchants[0];
      if (firstMerchant?.logoPath) {
        const img = new Image();
        img.src = `/packs/${data.pack.packId}/${firstMerchant.logoPath}`;
      }
    });

    return () => clearTimeout(timer);
  }, [currentPackId]);

  useEffect(() => {
    PACKS.forEach((id) => preloadPackBundle(id));
  }, []);

  useEffect(() => {
    if (!bundle) return;
    setActiveUsecase((activeHub === "acquiring" ? bundle.acquiring : bundle.bills)[0]);
  }, [activeHub, bundle]);

  const usecases = useMemo(() => {
    const list = activeHub === "acquiring" ? bundle?.acquiring ?? [] : bundle?.bills ?? [];
    return list.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()) || item.description.toLowerCase().includes(query.toLowerCase()));
  }, [bundle, activeHub, query]);

  const context: ResolvedContext | null = useMemo(() => {
    if (!bundle || !activeUsecase) return null;
    const merchant = bundle.merchants.find((item) => item.id === activeUsecase.merchantRef);
    return {
      app: {
        name: bundle.pack.appIdentity.name,
        logoUrl: `/packs/${bundle.pack.packId}/${bundle.pack.appIdentity.logoPath}`
      },
      locale: bundle.pack.defaultLocale,
      currency: {
        ...bundle.pack.defaultCurrency,
        code: activeUsecase.overrides?.currencyCode ?? bundle.pack.defaultCurrency.code,
        symbol: activeUsecase.overrides?.currencySymbol ?? bundle.pack.defaultCurrency.symbol
      },
      merchant: merchant
        ? {
            id: merchant.id,
            name: activeUsecase.overrides?.merchantName ?? merchant.name,
            logoUrl: `/packs/${bundle.pack.packId}/${activeUsecase.overrides?.merchantLogoPath ?? merchant.logoPath}`,
            category: merchant.category
          }
        : null,
      campaigns: bundle.campaigns,
      demo
    };
  }, [bundle, activeUsecase, demo]);

  if (loadState !== "ready" || !bundle || !activeUsecase || !context) {
    return (
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <section className="space-y-4">
          <Skeleton className="h-14 w-72" />
          <div className="grid gap-4 sm:grid-cols-4">
            {PACKS.map((id) => (
              <Skeleton key={id} className="h-10 w-full" />
            ))}
          </div>
          <Skeleton className="h-40 w-full" />
        </section>
        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-3">
            <Skeleton className="h-11 w-60" />
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full" />
              ))}
            </div>
          </div>
          <DeviceFrame>
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-[520px] w-full" />
            </div>
          </DeviceFrame>
        </section>
        {loadState === "timeout" ? (
          <div className="surface-card space-y-3 p-4 text-sm">
            <div className="font-semibold">Still preparing this pack</div>
            <div className="text-ink/70">You can retry this pack or jump to MY fallback for demo continuity.</div>
            <div className="flex gap-2">
              <button className="rounded-button border border-border bg-surface px-3 py-2" onClick={() => window.location.reload()}>
                Retry
              </button>
              <button
                className="rounded-button bg-primary px-3 py-2 text-white"
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.set("pack", "my");
                  window.location.href = url.toString();
                }}
              >
                Use MY fallback
              </button>
            </div>
          </div>
        ) : null}
      </main>
    );
  }

  const flow = bundle.flows[activeUsecase.flowPath];

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="surface-card space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Payments Demo Hub</h1>
            <p className="text-sm text-ink/70">Recommended path: Static QR → Confirm payment → Receipt share/download.</p>
          </div>
          <div className="flex items-center gap-2">
            {PACKS.map((item) => (
              <button
                key={item}
                className={`rounded-button px-3 py-2 text-xs font-semibold ${item === bundle.pack.packId ? "bg-primary text-white" : "border border-border bg-white"}`}
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.set("pack", item);
                  window.location.href = url.toString();
                }}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <ThemeStudio
          initial={{ appName: context.app.name, appLogoPath: context.app.logoUrl, countryCode: countryCodeFromPackId(bundle.pack.packId) }}
          onOverridesChange={() => undefined}
          demo={demo}
          onDemoChange={setDemo}
        />
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <div className="surface-card space-y-3 p-3">
            <div className="flex gap-2">
              <button className={`rounded-button px-4 py-2 text-sm font-semibold ${activeHub === "acquiring" ? "bg-primary text-white" : "border border-border bg-white"}`} onClick={() => setActiveHub("acquiring")}>Merchant Acquiring</button>
              <button className={`rounded-button px-4 py-2 text-sm font-semibold ${activeHub === "bills" ? "bg-primary text-white" : "border border-border bg-white"}`} onClick={() => setActiveHub("bills")}>Bill Payments</button>
            </div>
            <input className="min-h-11 w-full rounded-button border border-border px-3 text-sm" placeholder="Search use case" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {usecases.map((usecase) => (
              <HubTile key={usecase.id} usecase={usecase} active={usecase.id === activeUsecase.id} onSelect={() => setActiveUsecase(usecase)} />
            ))}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-phone">
          <DeviceFrame>
            <div className="flex h-full min-h-0 flex-1 flex-col gap-phone">
              <AppProfileHeader appName={context.app.name} appLogoUrl={context.app.logoUrl} subtitle={context.locale} />
              <FlowRunner flow={flow} context={context} demo={demo} />
            </div>
          </DeviceFrame>
          <ExplainPanel title="Demo value">
            <p>{activeUsecase.description}</p>
            <p>What it proves: realistic orchestration, retries, and merchant-grade completion UX.</p>
            <p>Bank value: faster stakeholder sign-off for payment journeys in {bundle.pack.packName}.</p>
          </ExplainPanel>
        </div>
      </section>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageContent />
    </Suspense>
  );
}
