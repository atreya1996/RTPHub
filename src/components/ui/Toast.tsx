export default function Toast({ message }: { message: string }) {
  if (!message) return null;
  return <div className="rounded-xl bg-slate-900 px-3 py-2 text-xs text-white">{message}</div>;
}
