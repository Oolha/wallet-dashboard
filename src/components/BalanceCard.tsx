"use client";

import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function BalanceCard() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const {
    data: balance,
    isLoading,
    isError,
  } = useBalance({
    address: address,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const ethBalance = balance ? formatEther(balance.value) : "0";
  const formattedBalance = parseFloat(ethBalance).toFixed(4);

  const shouldShowConnectMessage = mounted && !address;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="bg-linear-to-r from-blue-500 to-indigo-600 text-white pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              ETH Balance
            </CardTitle>
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30"
            >
              Sepolia
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6 min-h-45 flex items-center justify-center">
          {!mounted && (
            <div className="flex flex-col items-center justify-center text-center w-full">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-3" />
              <p className="text-gray-500 text-sm">Loading...</p>
            </div>
          )}

          {shouldShowConnectMessage && (
            <div className="flex flex-col items-center justify-center text-center w-full">
              <Wallet className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-sm">
                Connect your wallet to view balance
              </p>
            </div>
          )}

          {mounted && address && (
            <>
              {isLoading && (
                <div className="flex flex-col items-center justify-center text-center w-full">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-3" />
                  <p className="text-gray-500 text-sm">Loading balance...</p>
                </div>
              )}

              {!isLoading && isError && (
                <div className="flex flex-col items-center justify-center text-center w-full">
                  <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
                  <p className="text-red-600 text-sm mb-1">
                    Failed to load balance
                  </p>
                  <p className="text-gray-500 text-xs">Please try refreshing</p>
                </div>
              )}

              {!isLoading && !isError && balance && (
                <div className="space-y-4 w-full">
                  <div>
                    <p className="text-4xl font-bold text-gray-900 mb-1">
                      {formattedBalance}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <span className="font-mono">{balance.symbol}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>Testnet ETH</span>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
