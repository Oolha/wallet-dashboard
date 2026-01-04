import { formatUnits } from "viem";

export function formatTokenAmount(raw: bigint, decimals: number) {
  const s = formatUnits(raw, decimals);
  const n = Number(s);

  if (!Number.isFinite(n)) return "0.0000";
  if (n > 0 && n < 0.0001) return "<0.0001";
  return n.toFixed(4);
}
