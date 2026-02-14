import type { Currency, UseCase } from "../schema/types";

export type ThemeOverrides = {
  appName?: string;
  appLogoPath?: string;
  locale?: string;
  currencyCode?: string;
  currencySymbol?: string;
  currencyMinorUnit?: number;
  currencyFormatStyle?: "symbol" | "code";
};

export function readQueryOverrides(searchParams: URLSearchParams): ThemeOverrides {
  return {
    appName: searchParams.get("appName") ?? undefined,
    appLogoPath: searchParams.get("appLogo") ?? undefined,
    locale: searchParams.get("locale") ?? undefined,
    currencyCode: searchParams.get("currencyCode") ?? undefined,
    currencySymbol: searchParams.get("currencySymbol") ?? undefined,
    currencyMinorUnit: searchParams.get("currencyMinorUnit")
      ? Number(searchParams.get("currencyMinorUnit"))
      : undefined,
    currencyFormatStyle: (searchParams.get("currencyFormatStyle") as
      | "symbol"
      | "code"
      | null) ?? undefined
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
  return {
    code: overrides.currencyCode ?? usecaseOverrides?.currencyCode ?? merchantCurrencyCode ?? base.code,
    symbol: overrides.currencySymbol ?? usecaseOverrides?.currencySymbol ?? base.symbol,
    minorUnit: overrides.currencyMinorUnit ?? base.minorUnit,
    formatStyle: overrides.currencyFormatStyle ?? base.formatStyle
  };
}
