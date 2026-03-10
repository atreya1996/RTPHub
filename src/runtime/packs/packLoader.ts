import type { Campaign, FlowDefinition, Merchant, PackManifest, UseCase } from "../../../lib/schema/types";

type ThemeConfig = {
  colors: Record<string, string>;
  typography: { fontFamily: string };
  radius: { card: number; button: number };
  shadow: { card: string };
};

export type PackBundle = {
  pack: PackManifest;
  theme: ThemeConfig;
  merchants: Merchant[];
  campaigns: Campaign[];
  acquiring: UseCase[];
  bills: UseCase[];
  flows: Record<string, FlowDefinition>;
};

const loaders = {
  my: async (): Promise<PackBundle> => {
    const [pack, theme, merchants, campaigns, acquiring, bills, s, d, le, lr, cb, lc, bb, pa, ag] = await Promise.all([
      import("../../../packs/my/pack.json"),
      import("../../../packs/my/theme.json"),
      import("../../../packs/my/merchants.json"),
      import("../../../packs/my/campaigns.json"),
      import("../../../packs/my/usecases.acquiring.json"),
      import("../../../packs/my/usecases.bills.json"),
      import("../../../packs/my/flows/acquiring/static-qr.json"),
      import("../../../packs/my/flows/acquiring/dynamic-qr.json"),
      import("../../../packs/my/flows/acquiring/loyalty-earn.json"),
      import("../../../packs/my/flows/acquiring/loyalty-redeem.json"),
      import("../../../packs/my/flows/acquiring/cashback.json"),
      import("../../../packs/my/flows/acquiring/loyalty-combined.json"),
      import("../../../packs/my/flows/bills/billbox.json"),
      import("../../../packs/my/flows/bills/pay-all.json"),
      import("../../../packs/my/flows/bills/agentic.json")
    ]);
    return {
      pack: pack.default as PackManifest,
      theme: theme.default as ThemeConfig,
      merchants: merchants.default as Merchant[],
      campaigns: campaigns.default as Campaign[],
      acquiring: acquiring.default as UseCase[],
      bills: bills.default as UseCase[],
      flows: {
        "flows/acquiring/static-qr.json": s.default as FlowDefinition,
        "flows/acquiring/dynamic-qr.json": d.default as FlowDefinition,
        "flows/acquiring/loyalty-earn.json": le.default as FlowDefinition,
        "flows/acquiring/loyalty-redeem.json": lr.default as FlowDefinition,
        "flows/acquiring/cashback.json": cb.default as FlowDefinition,
        "flows/acquiring/loyalty-combined.json": lc.default as FlowDefinition,
        "flows/bills/billbox.json": bb.default as FlowDefinition,
        "flows/bills/pay-all.json": pa.default as FlowDefinition,
        "flows/bills/agentic.json": ag.default as FlowDefinition
      }
    };
  },
  ph: async (): Promise<PackBundle> => {
    const [pack, theme, merchants, campaigns, acquiring, bills, s, d, l, bb, pa, ag] = await Promise.all([
      import("../../../packs/ph/pack.json"),
      import("../../../packs/ph/theme.json"),
      import("../../../packs/ph/merchants.json"),
      import("../../../packs/ph/campaigns.json"),
      import("../../../packs/ph/usecases.acquiring.json"),
      import("../../../packs/ph/usecases.bills.json"),
      import("../../../packs/ph/flows/acquiring/static-qr.json"),
      import("../../../packs/ph/flows/acquiring/dynamic-qr.json"),
      import("../../../packs/ph/flows/acquiring/loyalty.json"),
      import("../../../packs/ph/flows/bills/billbox.json"),
      import("../../../packs/ph/flows/bills/pay-all.json"),
      import("../../../packs/ph/flows/bills/agentic.json")
    ]);
    return {
      pack: pack.default as PackManifest,
      theme: theme.default as ThemeConfig,
      merchants: merchants.default as Merchant[],
      campaigns: campaigns.default as Campaign[],
      acquiring: acquiring.default as UseCase[],
      bills: bills.default as UseCase[],
      flows: {
        "flows/acquiring/static-qr.json": s.default as FlowDefinition,
        "flows/acquiring/dynamic-qr.json": d.default as FlowDefinition,
        "flows/acquiring/loyalty.json": l.default as FlowDefinition,
        "flows/bills/billbox.json": bb.default as FlowDefinition,
        "flows/bills/pay-all.json": pa.default as FlowDefinition,
        "flows/bills/agentic.json": ag.default as FlowDefinition
      }
    };
  },
  th: async (): Promise<PackBundle> => {
    const [pack, theme, merchants, campaigns, acquiring, bills, s, d, l, bb, pa, ag] = await Promise.all([
      import("../../../packs/th/pack.json"),
      import("../../../packs/th/theme.json"),
      import("../../../packs/th/merchants.json"),
      import("../../../packs/th/campaigns.json"),
      import("../../../packs/th/usecases.acquiring.json"),
      import("../../../packs/th/usecases.bills.json"),
      import("../../../packs/th/flows/acquiring/static-qr.json"),
      import("../../../packs/th/flows/acquiring/dynamic-qr.json"),
      import("../../../packs/th/flows/acquiring/loyalty.json"),
      import("../../../packs/th/flows/bills/billbox.json"),
      import("../../../packs/th/flows/bills/pay-all.json"),
      import("../../../packs/th/flows/bills/agentic.json")
    ]);
    return {
      pack: pack.default as PackManifest,
      theme: theme.default as ThemeConfig,
      merchants: merchants.default as Merchant[],
      campaigns: campaigns.default as Campaign[],
      acquiring: acquiring.default as UseCase[],
      bills: bills.default as UseCase[],
      flows: {
        "flows/acquiring/static-qr.json": s.default as FlowDefinition,
        "flows/acquiring/dynamic-qr.json": d.default as FlowDefinition,
        "flows/acquiring/loyalty.json": l.default as FlowDefinition,
        "flows/bills/billbox.json": bb.default as FlowDefinition,
        "flows/bills/pay-all.json": pa.default as FlowDefinition,
        "flows/bills/agentic.json": ag.default as FlowDefinition
      }
    };
  },
  id: async (): Promise<PackBundle> => {
    const [pack, theme, merchants, campaigns, acquiring, bills, s, d, l, bb, pa, ag] = await Promise.all([
      import("../../../packs/id/pack.json"),
      import("../../../packs/id/theme.json"),
      import("../../../packs/id/merchants.json"),
      import("../../../packs/id/campaigns.json"),
      import("../../../packs/id/usecases.acquiring.json"),
      import("../../../packs/id/usecases.bills.json"),
      import("../../../packs/id/flows/acquiring/static-qr.json"),
      import("../../../packs/id/flows/acquiring/dynamic-qr.json"),
      import("../../../packs/id/flows/acquiring/loyalty.json"),
      import("../../../packs/id/flows/bills/billbox.json"),
      import("../../../packs/id/flows/bills/pay-all.json"),
      import("../../../packs/id/flows/bills/agentic.json")
    ]);
    return {
      pack: pack.default as PackManifest,
      theme: theme.default as ThemeConfig,
      merchants: merchants.default as Merchant[],
      campaigns: campaigns.default as Campaign[],
      acquiring: acquiring.default as UseCase[],
      bills: bills.default as UseCase[],
      flows: {
        "flows/acquiring/static-qr.json": s.default as FlowDefinition,
        "flows/acquiring/dynamic-qr.json": d.default as FlowDefinition,
        "flows/acquiring/loyalty.json": l.default as FlowDefinition,
        "flows/bills/billbox.json": bb.default as FlowDefinition,
        "flows/bills/pay-all.json": pa.default as FlowDefinition,
        "flows/bills/agentic.json": ag.default as FlowDefinition
      }
    };
  }
};

const cache = new Map<string, Promise<PackBundle>>();

export function loadPackBundle(packId: string): Promise<PackBundle> {
  const safePack = (packId in loaders ? packId : "my") as keyof typeof loaders;
  if (!cache.has(safePack)) {
    cache.set(safePack, loaders[safePack]());
  }
  return cache.get(safePack)!;
}

export function preloadPackBundle(packId: string) {
  void loadPackBundle(packId);
}
