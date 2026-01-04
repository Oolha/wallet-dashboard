"use client";

import { useAccount, useBalance, useChainId } from "wagmi";
import { formatEther } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const CHAIN_NAME: Record<number, string> = {
  1: "Ethereum Mainnet",
  11155111: "Sepolia",
};

export function BalanceCard() {
  const [mounted, setMounted] = useState(false);
  const { address } = useAccount();
  const chainId = useChainId();
  const enabled = Boolean(address);

  const {
    data: balance,
    isLoading,
    isError,
  } = useBalance({
    address,
    query: { enabled },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const chainName = useMemo(() => {
    if (!chainId) return "—";
    return CHAIN_NAME[chainId] ?? `Chain ${chainId}`;
  }, [chainId]);

  const formattedBalance = useMemo(() => {
    if (!balance) return "0.0000";
    const eth = formatEther(balance.value);
    const n = Number(eth);
    if (!Number.isFinite(n)) return "0.0000";
    if (n > 0 && n < 0.0001) return "<0.0001";
    return n.toFixed(4);
  }, [balance]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-white/40 bg-white/60 backdrop-blur-sm group">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />

        <CardHeader className="relative bg-linear-to-r from-sky-400 via-cyan-400 to-teal-400 text-white pb-4">
          <div className="absolute top-2 right-2 text-white/20 text-2xl">✦</div>

          <div className="flex items-center justify-between relative z-10">
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Magical Essence
            </CardTitle>
            <Badge className="bg-white/30 text-white border-white/40 backdrop-blur-sm font-serif text-xs">
              {chainName}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6 min-h-45 flex items-center justify-center relative">
          {!mounted && (
            <div className="flex flex-col items-center justify-center text-center w-full">
              <Loader2 className="h-8 w-8 text-cyan-400 animate-spin mb-3" />
              <p className="text-slate-600 text-sm font-light">Summoning...</p>
            </div>
          )}

          {mounted && !address && (
            <div className="flex flex-col items-center justify-center text-center w-full py-8">
              <Wallet className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-600 text-sm font-light">
                Connect your wallet to view essence
              </p>
            </div>
          )}

          {mounted && address && isLoading && (
            <div className="flex flex-col items-center justify-center text-center w-full">
              <Loader2 className="h-8 w-8 text-cyan-500 animate-spin mb-3" />
              <p className="text-slate-600 text-sm font-light">
                Gathering magical essence...
              </p>
            </div>
          )}

          {mounted && address && !isLoading && isError && (
            <div className="flex flex-col items-center justify-center text-center w-full">
              <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
              <p className="text-red-600 text-sm mb-1 font-medium">
                Spell failed
              </p>
              <p className="text-slate-500 text-xs">Please try refreshing</p>
            </div>
          )}

          {mounted && address && !isLoading && !isError && balance && (
            <div className="space-y-4 w-full">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-cyan-500" />
                  <p className="text-5xl font-bold bg-linear-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                    {formattedBalance}
                  </p>
                  <Sparkles className="h-5 w-5 text-cyan-500" />
                </div>
                <p className="text-sm text-slate-600 font-mono font-medium">
                  {balance.symbol}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <div className="w-12 h-px bg-linear-to-r from-transparent via-cyan-300 to-transparent" />
                <span className="text-xs text-cyan-600/60">✦</span>
                <div className="w-12 h-px bg-linear-to-r from-transparent via-cyan-300 to-transparent" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
