export type EpfConfig = {
  epfBrand: { logoPath: string; primaryColor: string; surfaceColor: string; textColor: string };
  sampleMember: { memberIdMasked: string; name?: string; balance: number; lastContribution: number; dividendRate: string };
  contributionRules: { min: number; max: number; presets: number[] };
  paymentMethods: Array<{ id: string; label: string; description: string; feeLabel: string; logo: string; subOptions?: string[] }>;
  banksList: Array<{ id: string; name: string; logo: string }>;
  wallets: Array<{ id: string; name: string; logo: string }>;
};

const cache = new Map<string, Promise<EpfConfig>>();

export function loadEpfConfig(packId: string): Promise<EpfConfig> {
  const key = packId || "my";
  if (!cache.has(key)) {
    cache.set(
      key,
      fetch(`/packs/${key}/epf.json`).then((response) => {
        if (!response.ok) {
          return fetch("/packs/my/epf.json").then((fallback) => fallback.json() as Promise<EpfConfig>);
        }
        return response.json() as Promise<EpfConfig>;
      })
    );
  }
  return cache.get(key)!;
}
