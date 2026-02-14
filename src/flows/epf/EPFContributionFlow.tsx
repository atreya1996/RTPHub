"use client";

import { useEffect, useMemo, useState } from "react";
import { formatMoney } from "../../../lib/runtime/formatMoney";
import type { Currency } from "../../../lib/schema/types";
import PhoneShell from "../../components/phone-shell/PhoneShell";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Sheet from "../../components/ui/Sheet";
import Skeleton from "../../components/ui/Skeleton";
import Stepper from "../../components/ui/Stepper";
import { loadEpfConfig, type EpfConfig } from "../../runtime/packs/loadPack";

type DemoOutcome = "success" | "failure" | "timeout";
type DemoLatency = "fast" | "normal" | "slow";
type Screen = "login" | "dashboard" | "amount" | "confirm" | "method" | "methodFlow" | "success" | "receipt";

const latencyMap: Record<DemoLatency, number> = { fast: 450, normal: 1200, slow: 2400 };

export default function EPFContributionFlow({ packId = "my" }: { packId?: string }) {
  const [config, setConfig] = useState<EpfConfig | null>(null);
  const [screen, setScreen] = useState<Screen>("login");
  const [id, setId] = useState("");
  const [amount, setAmount] = useState(100);
  const [methodId, setMethodId] = useState("duitnow");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showExplain, setShowExplain] = useState(true);
  const [showSheet, setShowSheet] = useState(false);
  const [bankId, setBankId] = useState("maybank2u");
  const [walletId, setWalletId] = useState("tng");
  const [otp, setOtp] = useState("");
  const [outcome, setOutcome] = useState<DemoOutcome>("success");
  const [latency, setLatency] = useState<DemoLatency>("normal");
  const [enabledMethods, setEnabledMethods] = useState<Record<string, boolean>>({ duitnow: true, fpx: true, debit: true, wallet: true });

  const currency: Currency = { code: "MYR", symbol: "RM", minorUnit: 2, formatStyle: "symbol" };

  useEffect(() => {
    loadEpfConfig(packId).then((next) => {
      setConfig(next);
      setAmount(next.contributionRules.presets[1] ?? 100);
    });
  }, [packId]);

  const method = useMemo(() => config?.paymentMethods.find((item) => item.id === methodId), [config, methodId]);

  useEffect(() => {
    if (config?.epfBrand?.primaryColor) {
      document.documentElement.style.setProperty("--epf-primary", config.epfBrand.primaryColor);
    }
  }, [config]);

  const runNetworkStep = (message: string, next: () => void) => {
    setLoading(true);
    setStatus(message);
    window.setTimeout(() => {
      setLoading(false);
      next();
    }, latencyMap[latency]);
  };

  if (!config) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <Skeleton className="h-10 w-52" />
        <Skeleton className="mt-4 h-72 w-full" />
      </div>
    );
  }

  const validateAmount = amount >= config.contributionRules.min && amount <= config.contributionRules.max;
  const updatedBalance = config.sampleMember.balance + amount;

  const pay = () => {
    if (methodId === "duitnow") {
      setShowSheet(true);
      return;
    }
    runNetworkStep("Processing payment in real-time…", () => {
      if (outcome === "success") setScreen("success");
      else setStatus(outcome === "failure" ? "Payment failed. Please retry." : "Payment timeout. Awaiting bank callback.");
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">EPF Voluntary Contribution Demo</h1>
        <button className="rounded-full border px-3 py-1 text-xs" onClick={() => setShowExplain((prev) => !prev)}>
          {showExplain ? "Hide" : "Show"} explanation
        </button>
      </div>
      <div className="grid gap-6 lg:grid-cols-[440px_1fr]">
        <PhoneShell>
          <div className="p-4">
            <Stepper step={["login","dashboard","amount","confirm","method","methodFlow","success","receipt"].indexOf(screen)+1} total={8} />
            <div className="mt-4">
              {screen === "login" && (
                <Card>
                  <img src={config.epfBrand.logoPath} className="h-10 w-auto" alt="KWSP EPF" />
                  <h2 className="mt-4 text-xl font-semibold text-slate-900">Selamat datang ke i-Akaun (Ahli)</h2>
                  <label htmlFor="user-id" className="mt-4 block text-sm">ID pengguna</label>
                  <input id="user-id" value={id} onChange={(e)=>setId(e.target.value)} className="mt-2 w-full rounded-xl border px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--epf-primary,#0F4FA8)]" />
                  {loading ? <Skeleton className="mt-3 h-10 w-full" /> : null}
                  <Button className="mt-4" disabled={!id || loading} onClick={()=>runNetworkStep("Fetching EPF account…", ()=>setScreen("dashboard"))}>Log masuk sekarang</Button>
                  <div className="mt-3 space-y-2 text-xs text-blue-700">
                    <p>Lupa ID pengguna atau kata laluan?</p><p>Pertama kali? Aktifkan menggunakan OTP</p>
                  </div>
                </Card>
              )}
              {screen === "dashboard" && (
                <div className="space-y-3">
                  <Card><p className="text-xs text-slate-500">Jumlah Simpanan</p><p className="text-3xl font-semibold text-slate-900">{formatMoney(config.sampleMember.balance,currency,"en-MY")}</p></Card>
                  <div className="grid grid-cols-2 gap-3">
                    <Card><p className="text-xs text-slate-500">Last contribution</p><p className="mt-1 font-semibold">{formatMoney(config.sampleMember.lastContribution,currency,"en-MY")}</p></Card>
                    <Card><p className="text-xs text-slate-500">Dividend rate</p><p className="mt-1 font-semibold">{config.sampleMember.dividendRate}</p></Card>
                  </div>
                  <Button onClick={()=>setScreen("amount")}>Tambah Caruman Sukarela</Button>
                </div>
              )}
              {screen === "amount" && (
                <Card>
                  <h2 className="text-lg font-semibold">Enter contribution amount</h2>
                  <input type="number" value={amount} onChange={(e)=>setAmount(Number(e.target.value))} className="mt-3 w-full rounded-xl border px-3 py-2 text-xl font-semibold" />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {config.contributionRules.presets.map((preset)=><button key={preset} onClick={()=>setAmount(preset)} className="rounded-full border px-3 py-1 text-xs">{preset}</button>)}
                    <button className="rounded-full border px-3 py-1 text-xs">Other</button>
                  </div>
                  {!validateAmount ? <p className="mt-2 text-xs text-red-600">Amount must be between {formatMoney(config.contributionRules.min,currency,"en-MY")} and {formatMoney(config.contributionRules.max,currency,"en-MY")}.</p> : null}
                  <Button className="mt-4" disabled={!validateAmount} onClick={()=>runNetworkStep("Validating amount…", ()=>setScreen("confirm"))}>Continue</Button>
                </Card>
              )}
              {screen === "confirm" && (
                <Card>
                  <h2 className="text-lg font-semibold">Confirm details</h2>
                  <div className="mt-3 space-y-2 text-sm"><p>Amount: <b>{formatMoney(amount,currency,"en-MY")}</b></p><p>Member ID: {config.sampleMember.memberIdMasked}</p><p>Contribution type: Voluntary</p><p>Processing: Real-time where available</p></div>
                  <Button className="mt-4" onClick={()=>setScreen("method")}>Confirm</Button>
                </Card>
              )}
              {screen === "method" && (
                <Card>
                  <h2 className="text-lg font-semibold">Choose payment method</h2>
                  <div className="mt-3 space-y-2">
                    {config.paymentMethods.filter((m)=>enabledMethods[m.id]!==false).map((m)=><button key={m.id} onClick={()=>setMethodId(m.id)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left ${methodId===m.id?"border-[var(--epf-primary,#0F4FA8)]":"border-slate-200"}`}><img src={m.logo} alt={m.label} className="h-8 w-12 rounded object-cover"/><div className="flex-1"><p className="text-sm font-semibold">{m.label}</p><p className="text-xs text-slate-500">{m.description}</p></div><span className="text-xs text-slate-500">{m.feeLabel}</span></button>)}
                  </div>
                  <Button className="mt-4" onClick={()=>setScreen("methodFlow")}>Pay {formatMoney(amount,currency,"en-MY")}</Button>
                </Card>
              )}
              {screen === "methodFlow" && (
                <Card>
                  <h2 className="text-lg font-semibold">{method?.label}</h2>
                  {methodId === "fpx" && <div className="mt-3 space-y-2">{config.banksList.map((bank)=><button key={bank.id} onClick={()=>setBankId(bank.id)} className={`flex w-full items-center gap-2 rounded-xl border p-2 ${bank.id===bankId?"border-[var(--epf-primary,#0F4FA8)]":"border-slate-200"}`}><img src={bank.logo} alt={bank.name} className="h-7 w-10"/><span className="text-sm">{bank.name}</span></button>)}<Button className="mt-2" onClick={()=>runNetworkStep("Redirecting to FPX…", pay)}>Continue</Button></div>}
                  {methodId === "debit" && <div className="mt-3 space-y-2"><input placeholder="Card number" className="w-full rounded-xl border px-3 py-2"/><div className="grid grid-cols-2 gap-2"><input placeholder="MM/YY" className="rounded-xl border px-3 py-2"/><input placeholder="CVV" className="rounded-xl border px-3 py-2"/></div><input placeholder="OTP" value={otp} onChange={(e)=>setOtp(e.target.value)} className="w-full rounded-xl border px-3 py-2"/><Button className="mt-2" disabled={!otp} onClick={pay}>Pay</Button></div>}
                  {methodId === "wallet" && <div className="mt-3 space-y-2">{config.wallets.map((wallet)=><button key={wallet.id} onClick={()=>setWalletId(wallet.id)} className={`flex w-full items-center gap-2 rounded-xl border p-2 ${wallet.id===walletId?"border-[var(--epf-primary,#0F4FA8)]":"border-slate-200"}`}><img src={wallet.logo} alt={wallet.name} className="h-7 w-10"/><span className="text-sm">{wallet.name}</span></button>)}<Button className="mt-2" onClick={()=>runNetworkStep("Opening wallet…", pay)}>Open wallet</Button></div>}
                  {methodId === "duitnow" && <div className="mt-3 space-y-2"><p className="text-sm">Awaiting DuitNow authorization…</p><Button onClick={pay}>Open QR simulation</Button></div>}
                  {status ? <p className="mt-3 rounded-xl bg-slate-100 p-2 text-xs text-slate-700">{status}</p> : null}
                </Card>
              )}
              {screen === "success" && (
                <Card>
                  <h2 className="text-lg font-semibold text-emerald-700">Contribution successful</h2>
                  <p className="mt-2 text-sm">Amount paid: <b>{formatMoney(amount,currency,"en-MY")}</b></p>
                  <p className="mt-1 text-sm">Updated balance: <b>{formatMoney(updatedBalance,currency,"en-MY")}</b></p>
                  <p className="mt-1 text-xs text-slate-500">Ref: EPF-{Date.now().toString().slice(-6)}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2"><Button className="!py-2" onClick={()=>setScreen("receipt")}>View receipt</Button><Button className="!py-2 !bg-slate-700" onClick={()=>window.location.href="/"}>Done</Button></div>
                </Card>
              )}
              {screen === "receipt" && (
                <Card>
                  <h2 className="text-lg font-semibold">Receipt</h2>
                  <div className="mt-3 space-y-1 text-sm"><p>EPF reference: EPF-{Date.now().toString().slice(-6)}</p><p>Rail: {method?.label}</p><p>Timestamp: {new Date().toLocaleString("en-MY")}</p><p>Amount: {formatMoney(amount,currency,"en-MY")}</p><p>Fees: {formatMoney(0,currency,"en-MY")}</p></div>
                  <Button className="mt-4">Download PDF</Button>
                </Card>
              )}
            </div>
          </div>
        </PhoneShell>

        {showExplain ? (
          <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="font-semibold">Demo Controls</h3>
            <div className="space-y-2 text-sm">
              <label className="block">Outcome<select className="mt-1 w-full rounded-lg border px-2 py-1" value={outcome} onChange={(e)=>setOutcome(e.target.value as DemoOutcome)}><option value="success">success</option><option value="failure">failure</option><option value="timeout">timeout</option></select></label>
              <label className="block">Latency<select className="mt-1 w-full rounded-lg border px-2 py-1" value={latency} onChange={(e)=>setLatency(e.target.value as DemoLatency)}><option value="fast">fast</option><option value="normal">normal</option><option value="slow">slow</option></select></label>
              <div><p className="mb-1">Methods enabled</p>{config.paymentMethods.map((m)=><label key={m.id} className="mb-1 flex items-center gap-2"><input type="checkbox" checked={enabledMethods[m.id]!==false} onChange={(e)=>setEnabledMethods((prev)=>({...prev,[m.id]:e.target.checked}))} />{m.label}</label>)}</div>
            </div>
            <p className="text-xs text-slate-600">Narrative: bank-operated payment hub, multi-rail acceptance, and real-time status updates for member confidence.</p>
          </aside>
        ) : null}
      </div>
      <Sheet open={showSheet}>
        <h3 className="font-semibold">Scan to pay</h3>
        <div className="mt-3 flex h-44 items-center justify-center rounded-2xl border border-dashed">QR MOCK</div>
        <p className="mt-2 text-sm">Amount: {formatMoney(amount,currency,"en-MY")}</p>
        <p className="text-xs text-slate-500">Ref: EPFVOL-{Date.now().toString().slice(-5)}</p>
        <div className="mt-3 grid grid-cols-2 gap-2"><Button className="!py-2" onClick={()=>{setShowSheet(false);setScreen("success");setStatus("Payment confirmed");}}>Simulate success</Button><Button className="!py-2 !bg-slate-700" onClick={()=>{setShowSheet(false);setStatus("Payment failed. Retry.");}}>Simulate failure</Button></div>
      </Sheet>
    </div>
  );
}
