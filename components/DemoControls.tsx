"use client";

import React from "react";

import type { Demo } from "@/types/demo";

type DemoControlsProps = {
  demo: Demo;
  onChange: React.Dispatch<React.SetStateAction<Demo>> | ((demo: Demo) => void);
};

export default function DemoControls({ demo, onChange }: DemoControlsProps) {
  return (
    <div className="rounded-card border border-border bg-surface p-4 text-xs text-ink/80">
      <div className="flex flex-wrap gap-3">
        <label className="flex flex-col gap-1">
          Network
          <select
            className="rounded-button border border-border bg-white px-2 py-1"
            value={demo.networkMode}
            onChange={(event) => onChange({ ...demo, networkMode: event.target.value as DemoControlsProps["demo"]["networkMode"] })}
          >
            <option value="Normal">Normal</option>
            <option value="Low">Low</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          Outcome
          <select
            className="rounded-button border border-border bg-white px-2 py-1"
            value={demo.outcomeMode}
            onChange={(event) => onChange({ ...demo, outcomeMode: event.target.value as DemoControlsProps["demo"]["outcomeMode"] })}
          >
            <option value="Happy">Happy</option>
            <option value="Failure">Failure</option>
            <option value="Pending">Pending</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          Latency
          <input
            type="number"
            min="0.5"
            step="0.5"
            className="rounded-button border border-border bg-white px-2 py-1"
            value={demo.latencyMultiplier}
            onChange={(event) => onChange({ ...demo, latencyMultiplier: Number(event.target.value) })}
          />
        </label>
      </div>
    </div>
  );
}
