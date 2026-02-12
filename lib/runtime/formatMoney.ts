import type { Currency } from "../schema/types";

export function formatMoney(amount: number, currency: Currency, locale: string): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: currency.formatStyle === "code" ? "currency" : "currency",
    currency: currency.code,
    currencyDisplay: currency.formatStyle === "code" ? "code" : "symbol",
    minimumFractionDigits: currency.minorUnit,
    maximumFractionDigits: currency.minorUnit
  });
  return formatter.format(amount);
}
