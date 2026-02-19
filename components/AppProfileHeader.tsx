type AppProfileHeaderProps = {
  appName: string;
  appLogoUrl: string;
  subtitle?: string;
  context?: "default" | "bill-pay";
};

export default function AppProfileHeader({
  appName,
  appLogoUrl,
  subtitle,
  context = "default"
}: AppProfileHeaderProps) {
  const showSubtitle = context !== "bill-pay" && Boolean(subtitle);

  return (
    <div className="flex items-center gap-3">
      <img src={appLogoUrl} alt="App logo" className="h-10 w-10 rounded-full" />
      <div>
        <div className="text-sm font-semibold">{appName}</div>
        {showSubtitle ? <div className="text-xs text-ink/60">{subtitle}</div> : null}
      </div>
    </div>
  );
}
