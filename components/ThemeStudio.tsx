"use client";

import { useEffect, useMemo, useState } from "react";
import type { Currency } from "../lib/schema/types";

const defaultCurrency: Currency = {
  code: "MYR",
  symbol: "RM",
  minorUnit: 2,
  formatStyle: "symbol"
};

type ThemeOverrides = {
  appName: string;
  appLogoPath: string;
  locale: string;
  currency: Currency;
};

export default function ThemeStudio({ initial }: { initial: ThemeOverrides }) {
  const [overrides, setOverrides] = useState<ThemeOverrides>(initial);

  useEffect(() => {
    window.localStorage.setItem(
      "themeStudioOverrides",
      JSON.stringify({
        appName: overrides.appName,
        appLogoPath: overrides.appLogoPath,
        locale: overrides.locale,
        currencyCode: overrides.currency.code,
        currencySymbol: overrides.currency.symbol,
        currencyMinorUnit: overrides.currency.minorUnit,
        currencyFormatStyle: overrides.currency.formatStyle
      })
    );
  }, [overrides]);

  const formRows = useMemo(
    () => [
      {
        label: "App name",
        value: overrides.appName,
        onChange: (value: string) => setOverrides((prev) => ({ ...prev, appName: value }))
      },
      {
        label: "Logo URL",
        value: overrides.appLogoPath,
        onChange: (value: string) => setOverrides((prev) => ({ ...prev, appLogoPath: value }))
      },
      {
        label: "Locale",
        value: overrides.locale,
        onChange: (value: string) => setOverrides((prev) => ({ ...prev, locale: value }))
      }
    ],
    [overrides]
  );

  const currency = overrides.currency ?? defaultCurrency;

  return (
    <section className="rounded-card border border-border bg-surface p-6 shadow-card">
      <h2 className="text-lg font-semibold text-ink">Theme Studio</h2>
      <p className="mt-1 text-sm text-ink/70">
        Edit brand and locale, persisted to localStorage. Query params take priority when present.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {formRows.map((row) => (
          <label key={row.label} className="flex flex-col gap-2 text-sm font-medium text-ink">
            {row.label}
            <input
              className="rounded-button border border-border bg-white px-3 py-2 text-sm"
              value={row.value}
              onChange={(event) => row.onChange(event.target.value)}
            />
          </label>
        ))}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-ink">
          Currency code
          <input
            className="rounded-button border border-border bg-white px-3 py-2 text-sm"
            value={currency.code}
            onChange={(event) =>
              setOverrides((prev) => ({
                ...prev,
                currency: { ...currency, code: event.target.value }
              }))
            }
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-ink">
          Symbol
          <input
            className="rounded-button border border-border bg-white px-3 py-2 text-sm"
            value={currency.symbol}
            onChange={(event) =>
              setOverrides((prev) => ({
                ...prev,
                currency: { ...currency, symbol: event.target.value }
              }))
            }
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-ink">
          Minor unit
          <input
            type="number"
            className="rounded-button border border-border bg-white px-3 py-2 text-sm"
            value={currency.minorUnit}
            onChange={(event) =>
              setOverrides((prev) => ({
                ...prev,
                currency: { ...currency, minorUnit: Number(event.target.value) }
              }))
            }
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-ink">
          Format style
          <select
            className="rounded-button border border-border bg-white px-3 py-2 text-sm"
            value={currency.formatStyle}
            onChange={(event) =>
              setOverrides((prev) => ({
                ...prev,
                currency: { ...currency, formatStyle: event.target.value as Currency["formatStyle"] }
              }))
            }
          >
            <option value="symbol">Symbol</option>
            <option value="code">Code</option>
          </select>
        </label>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="h-12 w-12 overflow-hidden rounded-full border border-border bg-white">
          {overrides.appLogoPath ? (
            <img src={overrides.appLogoPath} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-ink/40">Logo</div>
          )}
        </div>
        <span className="text-sm text-ink/70">Preview updates instantly.</span>
      </div>
    </section>
  );
}
