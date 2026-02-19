"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  SUPPORTED_COUNTRY_CODES,
  countryCodeFromPackId,
  type SupportedCountryCode
} from "../lib/runtime/currencyByCountry";

type LogoMode = "url" | "upload";

type ThemeOverrides = {
  appName: string;
  appLogoPath: string;
  countryCode: SupportedCountryCode;
  appLogoMode?: LogoMode;
  appLogoUploadDataUrl?: string;
};

export default function ThemeStudio({ initial }: { initial: ThemeOverrides }) {
  const [overrides, setOverrides] = useState<ThemeOverrides>(initial);
  const [logoMode, setLogoMode] = useState<LogoMode>("url");
  const [uploadDataUrl, setUploadDataUrl] = useState("");
  const [uploadError, setUploadError] = useState("");
  const uploadObjectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("themeStudioOverrides");
      if (!raw) return;
      const stored = JSON.parse(raw) as ThemeOverrides;
      if (stored.appLogoMode === "upload" || stored.appLogoMode === "url") {
        setLogoMode(stored.appLogoMode);
      }
      if (stored.appLogoUploadDataUrl?.startsWith("data:image/")) {
        setUploadDataUrl(stored.appLogoUploadDataUrl);
      }
      if (stored.appLogoMode === "upload" && stored.appLogoPath?.startsWith("blob:")) {
        setUploadError("Uploaded image preview from a previous session expired. Please upload again.");
      }
    } catch {
      // no-op
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "themeStudioOverrides",
      JSON.stringify({
        appName: overrides.appName,
        appLogoPath: overrides.appLogoPath,
        appLogoMode: logoMode,
        appLogoUploadDataUrl: uploadDataUrl || undefined,
        countryCode: overrides.countryCode
      })
    );
  }, [logoMode, overrides, uploadDataUrl]);

  useEffect(
    () => () => {
      if (uploadObjectUrlRef.current) {
        URL.revokeObjectURL(uploadObjectUrlRef.current);
      }
    },
    []
  );

  const formRows = useMemo(
    () => [
      {
        label: "App name",
        value: overrides.appName,
        onChange: (value: string) => setOverrides((prev) => ({ ...prev, appName: value }))
      }
    ],
    [overrides.appName]
  );

  const handleModeChange = (mode: LogoMode) => {
    setLogoMode(mode);
    setUploadError("");
    setOverrides((prev) => ({
      ...prev,
      appLogoPath: mode === "upload" ? uploadDataUrl || prev.appLogoPath : prev.appLogoPath
    }));
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (uploadObjectUrlRef.current) {
      URL.revokeObjectURL(uploadObjectUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    uploadObjectUrlRef.current = objectUrl;
    setLogoMode("upload");
    setUploadError("");
    setOverrides((prev) => ({ ...prev, appLogoPath: objectUrl }));

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result.startsWith("data:image/")) {
        setUploadError("Unable to store uploaded image. Please try another file.");
        return;
      }
      setUploadDataUrl(result);
      setOverrides((prev) => ({ ...prev, appLogoPath: result }));
    };
    reader.onerror = () => {
      setUploadError("Unable to read uploaded image. Please try another file.");
    };
    reader.readAsDataURL(file);
  };

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
        <div className="flex flex-col gap-2 text-sm font-medium text-ink">
          Logo source
          <div className="flex gap-2">
            <button
              type="button"
              className={`rounded-button px-3 py-2 text-xs font-semibold ${
                logoMode === "url" ? "bg-primary text-white" : "border border-border bg-white"
              }`}
              onClick={() => handleModeChange("url")}
            >
              URL
            </button>
            <button
              type="button"
              className={`rounded-button px-3 py-2 text-xs font-semibold ${
                logoMode === "upload" ? "bg-primary text-white" : "border border-border bg-white"
              }`}
              onClick={() => handleModeChange("upload")}
            >
              Upload
            </button>
          </div>
        </div>
        {logoMode === "url" ? (
          <label className="flex flex-col gap-2 text-sm font-medium text-ink">
            Logo URL
            <input
              className="rounded-button border border-border bg-white px-3 py-2 text-sm"
              value={overrides.appLogoPath}
              onChange={(event) => {
                setUploadError("");
                setOverrides((prev) => ({ ...prev, appLogoPath: event.target.value }));
              }}
            />
          </label>
        ) : (
          <label className="flex flex-col gap-2 text-sm font-medium text-ink">
            Upload image
            <input
              type="file"
              accept="image/*"
              className="rounded-button border border-border bg-white px-3 py-2 text-sm"
              onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
            />
          </label>
        )}
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
        <div className="text-sm text-ink/70">
          <p>Preview updates instantly.</p>
          {uploadError ? <p className="text-xs text-amber-700">{uploadError}</p> : null}
        </div>
      </div>
    </section>
  );
}
