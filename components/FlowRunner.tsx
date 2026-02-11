"use client";

import { useEffect, useMemo, useState } from "react";
import type { FlowDefinition, ResolvedContext } from "../lib/schema/types";
import { screenRegistry, type ScreenProps } from "./screens";

export default function FlowRunner({
  flow,
  context,
  demo
}: {
  flow: FlowDefinition;
  context: ResolvedContext;
  demo: ResolvedContext["demo"];
}) {
  const [stepId, setStepId] = useState(flow.entry);

  useEffect(() => {
    setStepId(flow.entry);
  }, [flow.entry]);

  const step = flow.steps[stepId];

  useEffect(() => {
    if (!step?.simulate) return;
    const delay = step.simulate.delayMs * demo.latencyMultiplier * (demo.networkMode === "Low" ? 1.5 : 1);
    const timer = window.setTimeout(() => {
      const event = demo.outcomeMode === "Failure" ? "FAILURE" : demo.outcomeMode === "Pending" ? "PENDING" : step.simulate?.result;
      if (event && step.on?.[event]) {
        setStepId(step.on[event]);
      }
    }, delay);
    return () => window.clearTimeout(timer);
  }, [step, demo]);

  const ScreenComponent = useMemo(() => {
    if (!step) return null;
    return screenRegistry[step.screen as keyof typeof screenRegistry];
  }, [step]);

  if (!step || !ScreenComponent) {
    return <div className="text-sm text-ink/70">Flow unavailable.</div>;
  }

  const onAction: ScreenProps["onAction"] = (event) => {
    const next = step.on?.[event];
    if (next) {
      setStepId(next);
    }
  };

  return <ScreenComponent context={context} onAction={onAction} props={step.props} />;
}
