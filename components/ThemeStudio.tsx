"use client";

import { useEffect, useMemo, useState } from "react";
import {
  SUPPORTED_COUNTRY_CODES,
  countryCodeFromPackId,
  type SupportedCountryCode
} from "../lib/runtime/currencyByCountry";

type ThemeOverrides = {
  appName: string;
  appLogoPath: string;
  countryCode: SupportedCountryCode;
};

export default function ThemeStudio({ initial }: { initial: ThemeOverrides }) {
  const [overrides, setOverrides] = useState<ThemeOverrides>(initial);

  useEffect(() => {
    window.localStorage.setItem(
      "themeStudioOverrides",
      JSON.stringify({
        appName: overrides.appName,
        appLogoPath: overrides.appLogoPath,
        countryCode: overrides.countryCode
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
      }
    ],
    [overrides]
  );

  return (
    <section className="rounded-card border border-border bg-surface p-6 shadow-card">
      <h2 className="text-lg font-semibold text-ink">Theme Studio</h2>
      <p className="mt-1 text-sm text-ink/70">
        Edit brand and country, persisted to localStorage. Query params take priority when present.
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
        <label className="flex flex-col gap-2 text-sm font-medium text-ink">
          Country
          <select
            className="rounded-button border border-border bg-white px-3 py-2 text-sm"
            value={overrides.countryCode}
            onChange={(event) =>
              setOverrides((prev) => ({
                ...prev,
                countryCode: countryCodeFromPackId(event.target.value)
              }))
            }
          >
            {SUPPORTED_COUNTRY_CODES.map((countryCode) => (
              <option key={countryCode} value={countryCode}>
                {countryCode}
              </option>
            ))}
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
