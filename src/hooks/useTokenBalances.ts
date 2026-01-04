import { useReadContracts } from "wagmi";
import { erc20Abi } from "viem";
import { Token } from "@/types/token";

export function useTokenBalances(tokens: Token[], address?: `0x${string}`) {
  const enabled = Boolean(address) && tokens.length > 0;

  const contracts = enabled
    ? tokens.map((token) => ({
        address: token.address,
        abi: erc20Abi,
        functionName: "balanceOf" as const,
        args: [address!],
      }))
    : [];

  const { data, isLoading, isError } = useReadContracts({
    contracts,
    query: { enabled },
    allowFailure: true,
  });

  const balances = tokens.map((token, index) => ({
    ...token,
    balance:
      enabled && data?.[index]?.status === "success"
        ? (data[index]!.result as bigint)
        : 0n,
  }));

  return {
    balances,
    isLoading,
    isError: enabled ? isError : false,
  };
}
