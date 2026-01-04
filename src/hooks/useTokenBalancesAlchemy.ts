import { useQuery } from "@tanstack/react-query";
import { Alchemy, Network } from "alchemy-sdk";
import { Token } from "@/types/token";

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "";

const ALCHEMY_NETWORK_BY_CHAIN: Record<number, Network> = {
  1: Network.ETH_MAINNET,
  11155111: Network.ETH_SEPOLIA,
};

const alchemyClients = new Map<number, Alchemy>();
function getAlchemy(chainId: number) {
  const existing = alchemyClients.get(chainId);
  if (existing) return existing;

  const network = ALCHEMY_NETWORK_BY_CHAIN[chainId];
  if (!network) return null;

  const client = new Alchemy({ apiKey: ALCHEMY_API_KEY, network });
  alchemyClients.set(chainId, client);
  return client;
}

function hexToBigInt(hex?: string | null) {
  if (!hex || hex === "0x" || hex === "0x0") return 0n;
  try {
    return BigInt(hex);
  } catch {
    return 0n;
  }
}

export function useTokenBalancesAlchemy(
  address?: `0x${string}`,
  chainId?: number
) {
  return useQuery({
    queryKey: ["tokenBalances", chainId, address],
    enabled: Boolean(address) && Boolean(chainId) && Boolean(ALCHEMY_API_KEY),
    staleTime: 30_000,
    queryFn: async () => {
      if (!address || !chainId) return [];

      const alchemy = getAlchemy(chainId);
      if (!alchemy) return [];

      const balancesResp = await alchemy.core.getTokenBalances(address);
      const nonZero = balancesResp.tokenBalances
        .map((tb) => ({
          address: tb.contractAddress as `0x${string}`,
          balance: hexToBigInt(tb.tokenBalance),
        }))
        .filter((t) => t.balance > 0n);

      if (nonZero.length === 0) return [];

      const metas = await Promise.all(
        nonZero.map(async (t) => {
          try {
            const meta = await alchemy.core.getTokenMetadata(t.address);
            return {
              ...t,
              symbol: meta.symbol || "TOKEN",
              name: meta.name || "Unknown Token",
              decimals: typeof meta.decimals === "number" ? meta.decimals : 18,
              logoUri: meta.logo || undefined,
            };
          } catch {
            return {
              ...t,
              symbol: "TOKEN",
              name: "Unknown Token",
              decimals: 18,
              logoUri: undefined,
            };
          }
        })
      );

      const result: Token[] = metas.map((m) => ({
        address: m.address,
        symbol: m.symbol,
        name: m.name,
        decimals: m.decimals,
        logoUri: m.logoUri,
        balance: m.balance,
      }));

      result.sort((a: any, b: any) => (b.balance > a.balance ? 1 : -1));

      return result;
    },
  });
}
