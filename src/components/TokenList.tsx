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
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="bg-linear-to-r from-purple-500 to-pink-600 text-white pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Coins className="h-5 w-5" />
              ERC20 Tokens
            </CardTitle>
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30"
            >
              {tokens.length} tokens
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
              <Coins className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-center text-sm">
                Connect your wallet to view tokens
              </p>
            </div>
          )}

          {mounted && address && chainId && !isSupportedChain && (
            <div className="flex flex-col items-center justify-center py-8">
              <Coins className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-900 text-center text-sm font-medium">
                Unsupported network for token discovery
              </p>
              <p className="text-gray-500 text-center text-xs mt-1">
                Switch to Ethereum Mainnet (1) or Sepolia (11155111)
              </p>
            </div>
          )}

          {mounted && address && isSupportedChain && isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-purple-500 animate-spin mb-3" />
              <p className="text-gray-500 text-sm">Loading tokens...</p>
            </div>
          )}

          {mounted && address && isSupportedChain && !isLoading && isError && (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
              <p className="text-red-600 text-sm mb-1">Failed to load tokens</p>
              <p className="text-gray-500 text-xs">
                Check your API key / network configuration
              </p>
            </div>
          )}

          {mounted && address && isSupportedChain && !isLoading && !isError && (
            <>
              {tokens.length === 0 ? (
                <div className="flex flex-col items-center justify-center">
                  <Coins className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-center text-sm">
                    No token balances found
                  </p>
                  <p className="text-gray-400 text-xs mt-1 text-center">
                    This wallet doesn&apos;t hold ERC20 tokens on this network
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tokens.map((token: any) => {
                    const displayBalance = formatTokenAmount(
                      token.balance as bigint,
                      token.decimals
                    );

                    return (
                      <div
                        key={token.address}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            {token.logoUri ? (
                              <img
                                src={token.logoUri}
                                alt={token.symbol}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-bold text-purple-700">
                                {token.symbol.slice(0, 2)}
                              </span>
                            )}
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              {token.symbol}
                            </p>
                            <p className="text-xs text-gray-500">
                              {token.name}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {displayBalance}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">
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
