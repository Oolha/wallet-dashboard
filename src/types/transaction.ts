export interface EtherscanTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  isError: "0" | "1";
  blockNumber: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  contractAddress: string;
  input: string;
}

export interface FormattedTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  isError: boolean;
  blockNumber: number;
  type: "sent" | "received";
  gasUsed: string;
}
