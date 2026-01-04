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
  Scroll,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { formatTime } from "@/utils/formatTime";

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
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-white/40 bg-white/60 backdrop-blur-sm group">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />
        <CardHeader className="relative bg-linear-to-r from-teal-400 via-emerald-400 to-green-400 text-white pb-4">
          <div className="absolute top-2 right-2 text-white/20 text-2xl">✦</div>

          <div className="flex items-center justify-between relative z-10">
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Scroll className="h-5 w-5" />
              Journey Chronicle
            </CardTitle>
            <Badge className="bg-white/30 text-white border-white/40 backdrop-blur-sm font-serif text-xs min-w-17.5">
              Last {DISPLAY_LIMIT}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6 min-h-45">
          {!mounted && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-emerald-400 animate-spin mb-3" />
              <p className="text-slate-600 text-sm font-light">Summoning...</p>
            </div>
          )}

          {mounted && !address && (
            <div className="flex flex-col items-center justify-center py-8">
              <History className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-600 text-center text-sm font-light">
                Connect your wallet to view chronicle
              </p>
            </div>
          )}

          {showUnsupportedNetworkNote && (
            <div className="mb-4 rounded-lg border border-amber-200/60 bg-amber-50/60 backdrop-blur-sm p-3">
              <p className="text-amber-800 text-sm font-light">
                Explorer scrolls aren&apos;t available for this realm (chainId:{" "}
                {chainId})
              </p>
            </div>
          )}

          {mounted && address && isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-green-500 animate-spin mb-3" />
              <p className="text-slate-600 text-sm font-light">
                Reading chronicles...
              </p>
            </div>
          )}

          {mounted && address && !isLoading && isError && (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
              <p className="text-red-600 text-sm mb-1 font-medium">
                Spell failed
              </p>
              <p className="text-slate-500 text-xs font-light">
                Check your API key or network
              </p>
            </div>
          )}

          {mounted && address && !isLoading && !isError && (
            <>
              {displayedTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <History className="h-12 w-12 text-slate-300 mb-4" />
                  <p className="text-slate-600 text-center text-sm font-light">
                    No journeys recorded yet
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
                        className="flex flex-col md:flex-row md:items-center md:justify-between p-3 rounded-xl hover:bg-linear-to-r hover:from-teal-50/50 hover:to-emerald-50/50 transition-all duration-200 border border-transparent hover:border-teal-200/40 gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center ${
                              tx.type === "sent"
                                ? "bg-linear-to-br from-red-100 to-orange-100"
                                : "bg-linear-to-br from-emerald-100 to-teal-100"
                            }`}
                          >
                            {tx.type === "sent" ? (
                              <ArrowUpRight className="h-5 w-5 text-orange-600" />
                            ) : (
                              <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-slate-800 capitalize text-sm">
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
                            <p className="text-xs text-slate-500 font-mono truncate">
                              {tx.type === "sent" ? "To: " : "From: "}
                              {formatAddress(
                                tx.type === "sent" ? tx.to : tx.from
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-3 pl-[52px] md:pl-0">
                          <div className="text-left md:text-right">
                            <p className="font-semibold text-slate-800 text-sm">
                              {formatEthValue(tx.value)} ETH
                            </p>
                            <p className="text-xs text-slate-500">
                              {formatTime(tx.timestamp)}
                            </p>
                          </div>

                          {isExplorerAvailable ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-teal-100/50 flex-shrink-0"
                              asChild
                            >
                              <a
                                href={`${explorerBase}${tx.hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Open in explorer"
                              >
                                <ExternalLink className="h-4 w-4 text-slate-400" />
                              </a>
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 flex-shrink-0"
                              disabled
                              aria-label="Explorer unavailable"
                            >
                              <ExternalLink className="h-4 w-4 text-slate-300" />
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
