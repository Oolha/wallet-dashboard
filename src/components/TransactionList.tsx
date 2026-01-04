"use client";

import { useAccount, useChainId } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  History,
  Loader2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";

const EXPLORER_TX_BY_CHAIN: Record<number, string> = {
  1: "https://etherscan.io/tx/",
  11155111: "https://sepolia.etherscan.io/tx/",
};

const DISPLAY_LIMIT = 5;

export function TransactionList() {
  const [mounted, setMounted] = useState(false);
  const { address } = useAccount();
  const chainId = useChainId();

  const {
    data: transactions,
    isLoading,
    isError,
  } = useTransactions(address, chainId);

  useEffect(() => {
    setMounted(true);
  }, []);

  const explorerBase = useMemo(() => {
    if (!chainId) return undefined;
    return EXPLORER_TX_BY_CHAIN[chainId];
  }, [chainId]);

  const displayedTransactions = useMemo(() => {
    return (transactions ?? []).slice(0, DISPLAY_LIMIT);
  }, [transactions]);

  const formatTime = (timestamp: number) => {
    if (!timestamp) return "—";

    const now = Date.now() / 1000;
    const diff = now - timestamp;

    if (diff < 0) return "Just now";
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const formatAddress = (addr: string) => {
    if (!addr) return "—";
    if (addr.length <= 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatEthValue = (value: string) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return "0.0000";
    if (n > 0 && n < 0.0001) return "<0.0001";
    return n.toFixed(4);
  };

  const showUnsupportedNetworkNote =
    mounted && address && !!chainId && !explorerBase;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="bg-linear-to-r from-green-500 to-teal-600 text-white pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30"
            >
              Last {DISPLAY_LIMIT}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6 min-h-45">
          {!mounted && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-3" />
              <p className="text-gray-500 text-sm">Loading...</p>
            </div>
          )}

          {mounted && !address && (
            <div className="flex flex-col items-center justify-center py-8">
              <History className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-center text-sm">
                Connect your wallet to view transactions
              </p>
            </div>
          )}

          {showUnsupportedNetworkNote && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-amber-800 text-sm">
                Explorer links aren&apos;t configured for this network (chainId:{" "}
                {chainId}).
              </p>
            </div>
          )}

          {mounted && address && isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-green-500 animate-spin mb-3" />
              <p className="text-gray-500 text-sm">Loading transactions...</p>
            </div>
          )}

          {mounted && address && !isLoading && isError && (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
              <p className="text-red-600 text-sm mb-1">
                Failed to load transactions
              </p>
              <p className="text-gray-500 text-xs">
                Check your API key / network configuration
              </p>
            </div>
          )}

          {mounted && address && !isLoading && !isError && (
            <>
              {displayedTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <History className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-center text-sm">
                    No transactions yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {displayedTransactions.map((tx) => {
                    const isExplorerAvailable =
                      Boolean(explorerBase) && !!tx.hash;

                    return (
                      <div
                        key={tx.hash}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              tx.type === "sent" ? "bg-red-100" : "bg-green-100"
                            }`}
                          >
                            {tx.type === "sent" ? (
                              <ArrowUpRight className="h-5 w-5 text-red-600" />
                            ) : (
                              <ArrowDownLeft className="h-5 w-5 text-green-600" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900 capitalize">
                                {tx.type}
                              </p>
                              {tx.isError && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Failed
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 font-mono truncate">
                              {tx.type === "sent" ? "To: " : "From: "}
                              {formatAddress(
                                tx.type === "sent" ? tx.to : tx.from
                              )}
                            </p>
                          </div>

                          <div className="text-right mr-2">
                            <p className="font-semibold text-gray-900">
                              {formatEthValue(tx.value)} ETH
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatTime(tx.timestamp)}
                            </p>
                          </div>

                          {isExplorerAvailable ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              asChild
                            >
                              <a
                                href={`${explorerBase}${tx.hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Open in explorer"
                              >
                                <ExternalLink className="h-4 w-4 text-gray-400" />
                              </a>
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              disabled
                              aria-label="Explorer unavailable"
                            >
                              <ExternalLink className="h-4 w-4 text-gray-300" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
