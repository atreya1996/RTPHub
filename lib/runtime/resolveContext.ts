import type { Campaign, Merchant, PackManifest, ResolvedContext, UseCase } from "../schema/types";
import { mergeCurrency, readQueryOverrides, readStoredOverrides } from "./applyOverrides";
import { countryCodeFromPackId } from "./currencyByCountry";
import myMerchants from "../../packs/my/merchants.json";
import myBillers from "../../packs/my/billers.json";
import myCampaigns from "../../packs/my/campaigns.json";
import myUsecasesAcquiring from "../../packs/my/usecases.acquiring.json";
import myUsecasesBills from "../../packs/my/usecases.bills.json";
import thMerchants from "../../packs/th/merchants.json";
import thBillers from "../../packs/th/billers.json";
import thCampaigns from "../../packs/th/campaigns.json";
import thUsecasesAcquiring from "../../packs/th/usecases.acquiring.json";
import thUsecasesBills from "../../packs/th/usecases.bills.json";
import idMerchants from "../../packs/id/merchants.json";
import idBillers from "../../packs/id/billers.json";
import idCampaigns from "../../packs/id/campaigns.json";
import idUsecasesAcquiring from "../../packs/id/usecases.acquiring.json";
import idUsecasesBills from "../../packs/id/usecases.bills.json";
import phMerchants from "../../packs/ph/merchants.json";
import phBillers from "../../packs/ph/billers.json";
import phCampaigns from "../../packs/ph/campaigns.json";
import phUsecasesAcquiring from "../../packs/ph/usecases.acquiring.json";
import phUsecasesBills from "../../packs/ph/usecases.bills.json";


function resolvePackAssetPath(packId: string, assetPath?: string): string {
  if (!assetPath) return "";
  if (assetPath.startsWith("/") || assetPath.startsWith("http://") || assetPath.startsWith("https://")) {
    return assetPath;
  }
  return `/packs/${packId}/${assetPath}`;
}

const packData = {
  my: {
    merchants: myMerchants,
    billers: myBillers,
    campaigns: myCampaigns,
    acquiring: myUsecasesAcquiring,
    bills: myUsecasesBills
  },
  th: {
    merchants: thMerchants,
    billers: thBillers,
    campaigns: thCampaigns,
    acquiring: thUsecasesAcquiring,
    bills: thUsecasesBills
  },
  id: {
    merchants: idMerchants,
    billers: idBillers,
    campaigns: idCampaigns,
    acquiring: idUsecasesAcquiring,
    bills: idUsecasesBills
  },
  ph: {
    merchants: phMerchants,
    billers: phBillers,
    campaigns: phCampaigns,
    acquiring: phUsecasesAcquiring,
    bills: phUsecasesBills
  }
};

export function getPackData(packId: string) {
  return packData[packId as keyof typeof packData] ?? packData.my;
}

export function resolveContext(
  pack: PackManifest,
  usecase: UseCase,
  searchParams: URLSearchParams,
  demoOverrides?: Partial<ResolvedContext["demo"]>
): ResolvedContext {
  const storedOverrides = readStoredOverrides();
  const queryOverrides = readQueryOverrides(searchParams);
  const overrides = {
    ...storedOverrides,
    ...queryOverrides,
    countryCode: queryOverrides.countryCode ?? storedOverrides.countryCode ?? countryCodeFromPackId(pack.packId)
  };
  const packId = pack.packId as keyof typeof packData;
  const data = packData[packId] ?? packData.my;
  const merchant = data.merchants.find((item) => item.id === usecase.merchantRef) as Merchant | undefined;

  const merchantName = usecase.overrides?.merchantName ?? merchant?.name ?? "Demo Merchant";

  const merchantLogo =
    usecase.overrides?.merchantLogoPath ??
    resolvePackAssetPath(pack.packId, merchant?.logoPath ?? "assets/merchants/sample.svg");

  const currency = mergeCurrency(pack.defaultCurrency, overrides, usecase.overrides, merchant?.defaultCurrencyCode);

  return {
    app: {
      name: overrides.appName ?? pack.appIdentity.name,
      logoUrl: overrides.appLogoPath ?? resolvePackAssetPath(pack.packId, pack.appIdentity.logoPath)
    },
    locale: pack.defaultLocale,
    currency,
    merchant: merchant
      ? {
          id: merchant.id,
          name: merchantName,
          logoUrl: merchantLogo,
          category: merchant.category
        }
      : null,
    campaigns: (data.campaigns as Campaign[]).filter((campaign) =>
      campaign.appliesToMerchantIds.includes(merchant?.id ?? "")
    ),
    demo: {
      networkMode: demoOverrides?.networkMode ?? "Normal",
      outcomeMode: demoOverrides?.outcomeMode ?? "Happy",
      latencyMultiplier: demoOverrides?.latencyMultiplier ?? 1
    }
  };
}
