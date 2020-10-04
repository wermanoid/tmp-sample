const apiKey = process.env.REACT_APP_ETSC_API_KEY;

export interface Transaction {
  blockHash: string;
  blockNumber: string;
  confirmations: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  from: string;
  gas: number
  gasPrice: number
  gasUsed: number
  hash: string;
  input: string;
  isError: number
  nonce: number
  timeStamp: number
  to: string;
  transactionIndex: number
  txreceipt_status: number
  value: number
}

export interface ApiResponse {
  message: string;
  result: Transaction[];
}

export interface ApiClient {
  getAccountBalance: (address: string) => Promise<unknown>;
  getAccountTransactions: (address: string) => Promise<unknown>;
};

export interface ApiProvider {
  balance: (address: string) => string;
  transaction: (address: string) => string;
}

export enum Networks {
  Rinkeby = 'Rinkeby',
  Mainnet = 'Mainnet'
}

export const mainnetProvider = {
  balance: (address: string) =>  `https://api.etherscan.io/api?module=account&action=balance&address=${address}&apikey=${apiKey}`,
  transaction: (address: string) => `http://api.etherscan.io/api?module=account&action=txlist&sort=desc&address=${address}&apikey=${apiKey}`,
};
export const rinkebyProvider = {
  balance: (address: string) => `https://api-rinkeby.etherscan.io/api?module=account&action=balance&address=${address}&apikey=${apiKey}`,
  transaction: (address: string) => `http://api-rinkeby.etherscan.io/api?module=account&action=txlist&sort=desc&address=${address}&apikey=${apiKey}`
};

const fetchJson = (url: string) => fetch(url).then(resp => resp.json());

export class EtherClient implements ApiClient {
  private provider!: ApiProvider;

  constructor(network: Networks) {
    this.setProvider(network)
  }

  setProvider(nextNetwork: Networks) {
    this.provider = {
      [Networks.Mainnet]: mainnetProvider,
      [Networks.Rinkeby]: rinkebyProvider,
    }[nextNetwork];
  }

  getAccountBalance = (address: string) => fetchJson(this.provider.balance(address));
  getAccountTransactions = (address: string) => fetchJson(this.provider.transaction(address));

}