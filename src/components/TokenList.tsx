"use client";

import { useAccount, useChainId } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useTokenBalancesAlchemy } from "@/hooks/useTokenBalancesAlchemy";
import { formatTokenAmount } from "@/utils/formatAmount";

const SUPPORTED_CHAINS = new Set<number>([1, 11155111]);

export function TokenList() {
  const [mounted, setMounted] = useState(false);
  const { address } = useAccount();
  const chainId = useChainId();

  useEffect(() => setMounted(true), []);

  const isSupportedChain = useMemo(
    () => Boolean(chainId && SUPPORTED_CHAINS.has(chainId)),
    [chainId]
  );

  const {
    data: tokens = [],
    isLoading,
    isError,
  } = useTokenBalancesAlchemy(address, chainId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-white/40 bg-white/60 backdrop-blur-sm group">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />

        <CardHeader className="relative bg-linear-to-r from-purple-400 via-pink-400 to-rose-400 text-white pb-4">
          <div className="absolute top-2 right-2 text-white/20 text-2xl">✦</div>

          <div className="flex items-center justify-between relative z-10">
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Artifact Collection
            </CardTitle>
            <Badge className="bg-white/30 text-white border-white/40 backdrop-blur-sm font-serif text-xs min-w-17.5">
              {tokens.length} items
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6 min-h-45">
          {!mounted && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-pink-400 animate-spin mb-3" />
              <p className="text-slate-600 text-sm font-light">Summoning...</p>
            </div>
          )}

          {mounted && !address && (
            <div className="flex flex-col items-center justify-center py-8">
              <Coins className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-600 text-center text-sm font-light">
                Connect your wallet to view artifacts
              </p>
            </div>
          )}

          {mounted && address && chainId && !isSupportedChain && (
            <div className="flex flex-col items-center justify-center py-8">
              <Coins className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-800 text-center text-sm font-medium">
                Unsupported realm
              </p>
              <p className="text-slate-500 text-center text-xs mt-1 font-light">
                Switch to Ethereum Mainnet or Sepolia
              </p>
            </div>
          )}

          {mounted && address && isSupportedChain && isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-purple-500 animate-spin mb-3" />
              <p className="text-slate-600 text-sm font-light">
                Gathering artifacts...
              </p>
            </div>
          )}

          {mounted && address && isSupportedChain && !isLoading && isError && (
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

          {mounted && address && isSupportedChain && !isLoading && !isError && (
            <>
              {tokens.length === 0 ? (
                <div className="flex flex-col items-center justify-center">
                  <Coins className="h-12 w-12 text-slate-300 mb-4" />
                  <p className="text-slate-600 text-center text-sm font-light">
                    No artifacts found
                  </p>
                  <p className="text-slate-400 text-xs mt-1 text-center font-light">
                    This grimoire holds no magical items on this realm
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tokens.map((token: any) => {
                    const displayBalance = formatTokenAmount(
                      token.balance as bigint,
                      token.decimals
                    );

                    return (
                      <div
                        key={token.address}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-linear-to-r hover:from-purple-50/50 hover:to-pink-50/50 transition-all duration-200 border border-transparent hover:border-purple-200/40 group/item"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center border-2 border-white shadow-sm">
                            {token.logoUri ? (
                              <img
                                src={token.logoUri}
                                alt={token.symbol}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-bold bg-linear-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {token.symbol.slice(0, 2)}
                              </span>
                            )}
                          </div>

                          <div>
                            <p className="font-medium text-slate-800 group-hover/item:text-purple-700 transition-colors">
                              {token.symbol}
                            </p>
                            <p className="text-xs text-slate-500">
                              {token.name}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-slate-800">
                            {displayBalance}
                          </p>
                          <p className="text-xs text-slate-500 font-mono">
                            {token.symbol}
                          </p>
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
