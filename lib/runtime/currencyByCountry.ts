import type { Currency } from "../schema/types";

export const SUPPORTED_COUNTRY_CODES = ["MY", "TH", "ID", "PH"] as const;

export type SupportedCountryCode = (typeof SUPPORTED_COUNTRY_CODES)[number];

const CURRENCY_BY_COUNTRY: Record<SupportedCountryCode, Currency> = {
  MY: { code: "MYR", symbol: "RM", minorUnit: 2, formatStyle: "symbol" },
  TH: { code: "THB", symbol: "฿", minorUnit: 2, formatStyle: "symbol" },
  ID: { code: "IDR", symbol: "Rp", minorUnit: 0, formatStyle: "symbol" },
  PH: { code: "PHP", symbol: "₱", minorUnit: 2, formatStyle: "symbol" }
};

export function isSupportedCountryCode(value: string | undefined | null): value is SupportedCountryCode {
  if (!value) return false;
  return SUPPORTED_COUNTRY_CODES.includes(value.toUpperCase() as SupportedCountryCode);
}

export function currencyByCountry(countryCode: SupportedCountryCode): Currency {
  return CURRENCY_BY_COUNTRY[countryCode];
}

export function countryCodeFromPackId(packId: string): SupportedCountryCode {
  const normalized = packId.toUpperCase();
  return isSupportedCountryCode(normalized) ? normalized : "MY";
}
