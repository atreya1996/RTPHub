import type { Demo } from "../../src/types/demo";

export type Currency = {
  code: string;
  symbol: string;
  minorUnit: number;
  formatStyle: "symbol" | "code";
};

export type AppIdentity = {
  name: string;
  logoPath: string;
};

export type PackManifest = {
  packId: string;
  packName: string;
  defaultLocale: string;
  defaultCurrency: Currency;
  appIdentity: AppIdentity;
  brand: {
    brandSystem: string;
    tokensPath: string;
  };
  data: {
    merchantsPath: string;
    billersPath: string;
    campaignsPath: string;
    usecasesAcquiringPath: string;
    usecasesBillsPath: string;
  };
};

export type Merchant = {
  id: string;
  name: string;
  logoPath: string;
  category: string;
  countryCode: string;
  defaultCurrencyCode: string;
};

export type Biller = {
  id: string;
  name: string;
  logoPath: string;
  refLabel: string;
  sampleRefs: string[];
  countryCode: string;
};

export type Campaign = {
  id: string;
  type: string;
  title: string;
  eligibility: Record<string, unknown>;
  value: { amount: number; currencyCode: string };
  caps?: Record<string, unknown>;
  appliesToMerchantIds: string[];
};

export type UseCase = {
  id: string;
  title: string;
  description: string;
  icon: string;
  flowPath: string;
  contentPath: string;
  merchantRef?: string;
  billerRef?: string;
  overrides?: {
    merchantName?: string;
    merchantLogoPath?: string;
    currencyCode?: string;
    currencySymbol?: string;
  };
  scenario?: {
    optionalModules?: {
      dynamicQROfferDetails?: {
        enabled: boolean;
        variant?: "offer" | "cashback";
      };
    };
  };
};

export type FlowDefinition = {
  id: string;
  title: string;
  entry: string;
  steps: Record<
    string,
    {
      screen: string;
      props?: Record<string, unknown>;
      simulate?: { delayMs: number; result: string };
      on?: Record<string, string>;
    }
  >;
};

export type ResolvedContext = {
  app: { name: string; logoUrl: string };
  locale: string;
  currency: Currency;
  merchant: { id: string; name: string; logoUrl: string; category: string } | null;
  campaigns: Campaign[];
  scenario?: UseCase["scenario"];
  demo: Demo;
};
