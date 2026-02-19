import type { Currency, UseCase } from "../schema/types";
import { currencyByCountry, isSupportedCountryCode } from "./currencyByCountry";

export type ThemeOverrides = {
  appName?: string;
  appLogoPath?: string;
  appLogoMode?: "url" | "upload";
  appLogoUploadDataUrl?: string;
  countryCode?: string;
};

export function readQueryOverrides(searchParams: URLSearchParams): ThemeOverrides {
  return {
    appName: searchParams.get("appName") ?? undefined,
    appLogoPath: searchParams.get("appLogo") ?? undefined,
    countryCode: searchParams.get("countryCode") ?? undefined
  };
}

export function readStoredOverrides(): ThemeOverrides {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const raw = window.localStorage.getItem("themeStudioOverrides");
    if (!raw) return {};
    return JSON.parse(raw) as ThemeOverrides;
  } catch {
    return {};
  }
}

export function mergeCurrency(
  base: Currency,
  overrides: ThemeOverrides,
  usecaseOverrides: UseCase["overrides"] | undefined,
  merchantCurrencyCode?: string
): Currency {
  const normalizedCountryCode = overrides.countryCode?.toUpperCase();
  if (isSupportedCountryCode(normalizedCountryCode)) {
    return {
      ...currencyByCountry(normalizedCountryCode),
      formatStyle: "symbol"
    };
  }

  return {
    code: usecaseOverrides?.currencyCode ?? merchantCurrencyCode ?? base.code,
    symbol: usecaseOverrides?.currencySymbol ?? base.symbol,
    minorUnit: base.minorUnit,
    formatStyle: "symbol"
  };
}
