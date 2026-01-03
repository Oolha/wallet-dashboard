import { useReadContracts } from "wagmi";
import { erc20Abi } from "viem";
import { Token } from "@/types/token";

export function useTokenBalances(tokens: Token[], address?: `0x${string}`) {
  const contracts = tokens.map((token) => ({
    address: token.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  }));

  const { data, isLoading, isError } = useReadContracts({
    contracts,
  });

  const balances = tokens.map((token, index) => ({
    ...token,
    balance:
      data?.[index]?.status === "success" ? (data[index].result as bigint) : 0n,
  }));

  return {
    balances,
    isLoading,
    isError,
  };
}
