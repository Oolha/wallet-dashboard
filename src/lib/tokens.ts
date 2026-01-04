import defaultTokenList from "@uniswap/default-token-list";
import { Token } from "@/types/token";

const POPULAR_SYMBOLS = ["USDC", "DAI", "WETH", "USDT", "WBTC"];

export const MAINNET_TOKENS: Token[] = defaultTokenList.tokens
  .filter((token) => token.chainId === 1) 
  .filter((token) => POPULAR_SYMBOLS.includes(token.symbol))
  .map((token) => ({
    address: token.address as `0x${string}`,
    symbol: token.symbol,
    name: token.name,
    decimals: token.decimals,
    logoUri: token.logoURI,
  }))
  .sort((a, b) => {
    return (
      POPULAR_SYMBOLS.indexOf(a.symbol) - POPULAR_SYMBOLS.indexOf(b.symbol)
    );
  });
