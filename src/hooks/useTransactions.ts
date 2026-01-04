import { useQuery } from "@tanstack/react-query";
import {
  Alchemy,
  Network,
  AssetTransfersCategory,
  SortingOrder,
} from "alchemy-sdk";
import { FormattedTransaction } from "@/types/transaction";

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "";

const alchemy = new Alchemy({
  apiKey: ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA,
});

export function useTransactions(address?: `0x${string}`) {
  return useQuery({
    queryKey: ["transactions", address],
    queryFn: async () => {
      if (!address) return [];

      try {
        const sentTransfers = await alchemy.core.getAssetTransfers({
          fromAddress: address,
          category: [AssetTransfersCategory.EXTERNAL],
          maxCount: 5,
          order: SortingOrder.DESCENDING,
        });

        const receivedTransfers = await alchemy.core.getAssetTransfers({
          toAddress: address,
          category: [AssetTransfersCategory.EXTERNAL],
          maxCount: 5,
          order: SortingOrder.DESCENDING,
        });

        const allTransfers = [
          ...sentTransfers.transfers,
          ...receivedTransfers.transfers,
        ];

        const topTransfers = allTransfers.slice(0, 10);

        const formatted: FormattedTransaction[] = topTransfers.map((tx) => {
          const isSent = tx.from.toLowerCase() === address.toLowerCase();

          return {
            hash: tx.hash || "",
            from: tx.from || "",
            to: tx.to || "",
            value: tx.value?.toString() || "0",
            timestamp: Date.now() / 1000,
            isError: false,
            blockNumber: parseInt(tx.blockNum || "0", 16),
            type: isSent ? "sent" : "received",
            gasUsed: "0",
          };
        });

        return formatted;
      } catch (error) {
        console.error("Alchemy API error:", error);
        return [];
      }
    },
    enabled: !!address && !!ALCHEMY_API_KEY,
    staleTime: 30000,
  });
}
