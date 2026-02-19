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
  const [lastKnownStepId, setLastKnownStepId] = useState(flow.entry);

  useEffect(() => {
    setStepId(flow.entry);
    setLastKnownStepId(flow.entry);
  }, [flow.entry]);

  const isComplete = stepId === "END";
  const step = isComplete ? undefined : flow.steps[stepId];
  const lastKnownStep = flow.steps[lastKnownStepId];

  useEffect(() => {
    if (step) {
      setLastKnownStepId(stepId);
    }
  }, [step, stepId]);

  useEffect(() => {
    if (!step?.simulate) return;
    const delay = step.simulate.delayMs * demo.latencyMultiplier * (demo.networkMode === "Low" ? 1.5 : 1);
    const timer = window.setTimeout(() => {
      const event = demo.outcomeMode === "Failure" ? "FAILURE" : demo.outcomeMode === "Pending" ? "PENDING" : step.simulate?.result;
      if (event) {
        const next = step.on?.[event];
        if (next) {
          setStepId(next);
        }
      }
    }, delay);
    return () => window.clearTimeout(timer);
  }, [step, demo]);

  const ScreenComponent = useMemo(() => {
    if (!step) return null;
    return screenRegistry[step.screen as keyof typeof screenRegistry];
  }, [step]);

  if (isComplete) {
    const FlowFinalScreen = screenRegistry.FlowFinalScreen;
    return (
      <FlowFinalScreen
        context={context}
        onAction={() => setStepId(flow.entry)}
        props={{
          status: "SUCCESS",
          flowLabel: flow.title,
          txId: typeof lastKnownStep?.props?.txId === "string" ? lastKnownStep.props.txId : undefined,
          amount: typeof lastKnownStep?.props?.amount === "number" ? lastKnownStep.props.amount : undefined,
          reference: typeof lastKnownStep?.props?.reference === "string" ? lastKnownStep.props.reference : undefined
        }}
      />
    );
  }

  if (!step || !ScreenComponent) {
    const FlowFinalScreen = screenRegistry.FlowFinalScreen;
    return (
      <FlowFinalScreen
        context={context}
        onAction={() => setStepId(flow.entry)}
        props={{
          status: "FAILURE",
          flowLabel: flow.title,
          reference: `Unknown state: ${stepId}`
        }}
      />
    );
  }

  const onAction: ScreenProps["onAction"] = (event) => {
    const next = step.on?.[event];
    if (next) {
      setStepId(next);
    }
  };

  return <ScreenComponent context={context} onAction={onAction} props={step.props} />;
}
