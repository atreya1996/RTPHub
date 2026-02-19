"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import DeviceFrame from "../components/DeviceFrame";
import ExplainPanel from "../components/ExplainPanel";
import FlowRunner from "../components/FlowRunner";
import HubTile from "../components/HubTile";
import ThemeStudio from "../components/ThemeStudio";
import DemoControls from "../components/DemoControls";
import AppProfileHeader from "../components/AppProfileHeader";
import type { FlowDefinition, PackManifest, UseCase } from "../lib/schema/types";
import { getPackData, resolveContext } from "../lib/runtime/resolveContext";
import { listPacks, resolvePack } from "../lib/runtime/resolvePack";
import { countryCodeFromPackId } from "../lib/runtime/currencyByCountry";
import myTheme from "../packs/my/theme.json";
import thTheme from "../packs/th/theme.json";
import idTheme from "../packs/id/theme.json";
import phTheme from "../packs/ph/theme.json";
import myStaticQr from "../packs/my/flows/acquiring/static-qr.json";
import myDynamicQr from "../packs/my/flows/acquiring/dynamic-qr.json";
import myLoyalty from "../packs/my/flows/acquiring/loyalty.json";
import myBillbox from "../packs/my/flows/bills/billbox.json";
import myPayAll from "../packs/my/flows/bills/pay-all.json";
import myAgentic from "../packs/my/flows/bills/agentic.json";
import thStaticQr from "../packs/th/flows/acquiring/static-qr.json";
import thDynamicQr from "../packs/th/flows/acquiring/dynamic-qr.json";
import thLoyalty from "../packs/th/flows/acquiring/loyalty.json";
import thBillbox from "../packs/th/flows/bills/billbox.json";
import thPayAll from "../packs/th/flows/bills/pay-all.json";
import thAgentic from "../packs/th/flows/bills/agentic.json";
import idStaticQr from "../packs/id/flows/acquiring/static-qr.json";
import idDynamicQr from "../packs/id/flows/acquiring/dynamic-qr.json";
import idLoyalty from "../packs/id/flows/acquiring/loyalty.json";
import idBillbox from "../packs/id/flows/bills/billbox.json";
import idPayAll from "../packs/id/flows/bills/pay-all.json";
import idAgentic from "../packs/id/flows/bills/agentic.json";
import phStaticQr from "../packs/ph/flows/acquiring/static-qr.json";
import phDynamicQr from "../packs/ph/flows/acquiring/dynamic-qr.json";
import phLoyalty from "../packs/ph/flows/acquiring/loyalty.json";
import phBillbox from "../packs/ph/flows/bills/billbox.json";
import phPayAll from "../packs/ph/flows/bills/pay-all.json";
import phAgentic from "../packs/ph/flows/bills/agentic.json";
import type { Demo } from "@/types/demo";

type FlowMap = Record<string, FlowDefinition>;

const themeMap = {
  my: myTheme,
  th: thTheme,
  id: idTheme,
  ph: phTheme
};

const flowMap: Record<string, FlowMap> = {
  my: {
    "flows/acquiring/static-qr.json": myStaticQr,
    "flows/acquiring/dynamic-qr.json": myDynamicQr,
    "flows/acquiring/loyalty.json": myLoyalty,
    "flows/bills/billbox.json": myBillbox,
    "flows/bills/pay-all.json": myPayAll,
    "flows/bills/agentic.json": myAgentic
  },
  th: {
    "flows/acquiring/static-qr.json": thStaticQr,
    "flows/acquiring/dynamic-qr.json": thDynamicQr,
    "flows/acquiring/loyalty.json": thLoyalty,
    "flows/bills/billbox.json": thBillbox,
    "flows/bills/pay-all.json": thPayAll,
    "flows/bills/agentic.json": thAgentic
  },
  id: {
    "flows/acquiring/static-qr.json": idStaticQr,
    "flows/acquiring/dynamic-qr.json": idDynamicQr,
    "flows/acquiring/loyalty.json": idLoyalty,
    "flows/bills/billbox.json": idBillbox,
    "flows/bills/pay-all.json": idPayAll,
    "flows/bills/agentic.json": idAgentic
  },
  ph: {
    "flows/acquiring/static-qr.json": phStaticQr,
    "flows/acquiring/dynamic-qr.json": phDynamicQr,
    "flows/acquiring/loyalty.json": phLoyalty,
    "flows/bills/billbox.json": phBillbox,
    "flows/bills/pay-all.json": phPayAll,
    "flows/bills/agentic.json": phAgentic
  }
};

function HomePageContent() {
  const searchParams = useSearchParams();
  const pack = resolvePack(searchParams);
  const packData = getPackData(pack.packId);
  const [activeHub, setActiveHub] = useState<"acquiring" | "bills">("acquiring");
  const [activeUsecase, setActiveUsecase] = useState<UseCase>(packData.acquiring[0]);
  const [demo, setDemo] = useState<Demo>({
    networkMode: "Normal",
    outcomeMode: "Happy",
    latencyMultiplier: 1
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("activePack", pack.packId);
    }
  }, [pack.packId]);

  useEffect(() => {
    const theme = themeMap[pack.packId as keyof typeof themeMap];
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty("--color-primary", theme.colors.primary);
    root.style.setProperty("--color-accent1", theme.colors.accent1);
    root.style.setProperty("--color-accent2", theme.colors.accent2);
    root.style.setProperty("--color-ink", theme.colors.ink);
    root.style.setProperty("--color-bg", theme.colors.bg);
    root.style.setProperty("--color-surface", theme.colors.surface);
    root.style.setProperty("--color-border", theme.colors.border);
    root.style.setProperty("--font-family", theme.typography.fontFamily);
    root.style.setProperty("--radius-card", `${theme.radius.card}px`);
    root.style.setProperty("--radius-button", `${theme.radius.button}px`);
    root.style.setProperty("--shadow-card", theme.shadow.card);
  }, [pack.packId]);

  useEffect(() => {
    const list = activeHub === "acquiring" ? packData.acquiring : packData.bills;
    setActiveUsecase(list[0]);
  }, [activeHub, pack.packId]);

  const resolvedContext = useMemo(
    () => resolveContext(pack, activeUsecase, searchParams, demo),
    [pack, activeUsecase, searchParams, demo]
  );

  const flow = flowMap[pack.packId]?.[activeUsecase.flowPath] ?? flowMap.my[activeUsecase.flowPath];
  const packs = listPacks();
  const isBillPayHeaderContext =
    activeHub === "bills" && ["agentic", "pay_all"].includes(activeUsecase.id);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Payments Demo Hub</h1>
            <p className="text-sm text-ink/70">Pack-driven prototype for acquiring and bills.</p>
          </div>
          <div className="flex items-center gap-2">
            {packs.map((item) => (
              <button
                key={item.packId}
                className={`rounded-button px-3 py-2 text-xs font-semibold ${
                  item.packId === pack.packId ? "bg-primary text-white" : "border border-border bg-white"
                }`}
                onClick={() => {
                  if (typeof window !== "undefined") {
                    const url = new URL(window.location.href);
                    url.searchParams.set("pack", item.packId);
                    window.location.href = url.toString();
                  }
                }}
              >
                {item.packId.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <ThemeStudio
          initial={{
            appName: resolvedContext.app.name,
            appLogoPath: resolvedContext.app.logoUrl,
            countryCode: countryCodeFromPackId(pack.packId)
          }}
        />
        {pack.packId === "my" ? (
          <a
            href="/demo/epf-contribution?pack=my"
            className="inline-flex w-fit items-center rounded-button border border-border bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-primary hover:text-primary"
          >
            EPF Voluntary Contribution
          </a>
        ) : null}
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              className={`rounded-button px-4 py-2 text-sm font-semibold ${
                activeHub === "acquiring" ? "bg-primary text-white" : "border border-border bg-white"
              }`}
              onClick={() => setActiveHub("acquiring")}
            >
              Merchant Acquiring
            </button>
            <button
              className={`rounded-button px-4 py-2 text-sm font-semibold ${
                activeHub === "bills" ? "bg-primary text-white" : "border border-border bg-white"
              }`}
              onClick={() => setActiveHub("bills")}
            >
              Bill Payments
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {(activeHub === "acquiring" ? packData.acquiring : packData.bills).map((usecase) => (
              <HubTile
                key={usecase.id}
                usecase={usecase}
                active={usecase.id === activeUsecase.id}
                onSelect={() => setActiveUsecase(usecase)}
              />
            ))}
          </div>
          <DemoControls demo={demo} onChange={setDemo} />
        </div>
        <div className="flex min-h-full flex-1 flex-col gap-phone pb-safe">
          <DeviceFrame>
            <div className="flex min-h-full flex-1 flex-col gap-phone pb-safe">
              <AppProfileHeader
                appName={resolvedContext.app.name}
                appLogoUrl={resolvedContext.app.logoUrl}
                subtitle={resolvedContext.locale}
                context={isBillPayHeaderContext ? "bill-pay" : "default"}
              />
              {flow ? <FlowRunner flow={flow} context={resolvedContext} demo={demo} /> : null}
            </div>
          </DeviceFrame>
          <ExplainPanel title="Explain">
            <p>{activeUsecase.description}</p>
            <p>Pack: {pack.packName}</p>
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
