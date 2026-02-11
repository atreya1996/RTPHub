import myPack from "../../packs/my/pack.json";
import thPack from "../../packs/th/pack.json";
import idPack from "../../packs/id/pack.json";
import phPack from "../../packs/ph/pack.json";
import type { PackManifest } from "../schema/types";

const packMap: Record<string, PackManifest> = {
  my: myPack,
  th: thPack,
  id: idPack,
  ph: phPack
};

export function resolvePack(searchParams?: URLSearchParams): PackManifest {
  const queryPack = searchParams?.get("pack");
  if (queryPack && packMap[queryPack]) {
    return packMap[queryPack];
  }
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem("activePack");
    if (stored && packMap[stored]) {
      return packMap[stored];
    }
  }
  const envPack = process.env.PACK_ID;
  if (envPack && packMap[envPack]) {
    return packMap[envPack];
  }
  return packMap.my;
}

export function listPacks(): PackManifest[] {
  return Object.values(packMap);
}
