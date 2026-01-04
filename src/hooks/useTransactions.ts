import { useQuery } from "@tanstack/react-query";
import {
  Alchemy,
  Network,
  AssetTransfersCategory,
  SortingOrder,
} from "alchemy-sdk";
import { FormattedTransaction } from "@/types/transaction";

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

  const client = new Alchemy({
    apiKey: ALCHEMY_API_KEY,
    network,
  });
  alchemyClients.set(chainId, client);
  return client;
}

function hexToNumber(hex?: string) {
  if (!hex) return 0;
  return parseInt(hex, 16) || 0;
}

function toUnixSeconds(ts?: string) {
  if (!ts) return 0;
  const ms = Date.parse(ts);
  return Number.isFinite(ms) ? Math.floor(ms / 1000) : 0;
}

export function useTransactions(address?: `0x${string}`, chainId?: number) {
  return useQuery({
    queryKey: ["transactions", chainId, address],
    enabled: Boolean(address) && Boolean(chainId) && Boolean(ALCHEMY_API_KEY),
    staleTime: 30_000,
    queryFn: async () => {
      if (!address || !chainId) return [];

      const alchemy = getAlchemy(chainId);
      if (!alchemy) {
        return [];
      }

      const [sentTransfers, receivedTransfers] = await Promise.all([
        alchemy.core.getAssetTransfers({
          fromAddress: address,
          category: [AssetTransfersCategory.EXTERNAL],
          maxCount: 25,
          order: SortingOrder.DESCENDING,
          withMetadata: true,
        }),
        alchemy.core.getAssetTransfers({
          toAddress: address,
          category: [AssetTransfersCategory.EXTERNAL],
          maxCount: 25,
          order: SortingOrder.DESCENDING,
          withMetadata: true,
        }),
      ]);

      const allTransfers = [
        ...sentTransfers.transfers,
        ...receivedTransfers.transfers,
      ];

      const byHash = new Map<string, (typeof allTransfers)[number]>();
      for (const t of allTransfers) {
        if (t.hash) byHash.set(t.hash, t);
      }

      const sorted = [...byHash.values()]
        .map((t) => {
          const blockNumber = hexToNumber(t.blockNum);
          const timestamp = toUnixSeconds(t.metadata?.blockTimestamp);
          return { t, blockNumber, timestamp };
        })
        .sort((a, b) => {
          if (a.timestamp && b.timestamp) return b.timestamp - a.timestamp;
          return b.blockNumber - a.blockNumber;
        })
        .slice(0, 10);

      const formatted: FormattedTransaction[] = sorted.map(
        ({ t, blockNumber, timestamp }) => {
          const from = t.from || "";
          const to = t.to || "";
          const isSent = from.toLowerCase() === address.toLowerCase();

          return {
            hash: t.hash || "",
            from,
            to,
            value: t.value != null ? String(t.value) : "0",
            timestamp,
            isError: false,
            blockNumber,
            type: isSent ? "sent" : "received",
            gasUsed: "0",
          };
        }
      );

      return formatted;
    },
  });
}
