import { getCardanoConfig } from './cardano.config';
import { Lucid, Blockfrost, C } from 'lucid-cardano';
import { TokenListType, walletPath } from '../../services/base';
import { ConfigManagerCertPassphrase } from '../../services/config-manager-cert-passphrase';
import { promises as fs } from 'fs';
import fse from 'fs-extra';
import crypto from 'crypto';
import { CardanoController } from './cardano.controller';
import {
  NETWORK_ERROR_CODE,
  NETWORK_ERROR_MESSAGE,
  HttpException,
  TOKEN_NOT_SUPPORTED_ERROR_CODE,
  TOKEN_NOT_SUPPORTED_ERROR_MESSAGE,
} from '../../services/error-handler';

//import { Cardanoish } from "../../services/common-interfaces";
export type CardanoTokenInfo = {
  policyId: string;
  assetName: string;
  decimals: number;
  name: string;
  symbol: string;
  logoURI: string;
};

export class Cardano {
  private static _instances: { [name: string]: Cardano };
  protected tokenList: CardanoTokenInfo[] = [];
  private _tokenMap: Record<string, CardanoTokenInfo[]> = {};
  private _tokenListSource: string;
  private _tokenListType: TokenListType;
  private lucidInstance: Lucid | null = null;
  private network: string;
  public allowedSlippage?: string;
  public blockfrostProjectId: string;
  //public gasLimitEstimate: number;
  public ttl?: string;
  private _chain: string;
  private _ready: boolean = false;
  public apiURL: any;
  public defaultPoolId: string;
  public sundaeswapPoolId: string;
  public nativeTokenSymbol: string;
  public controller: typeof CardanoController;

  private constructor(network: string) {
    // Throw error if network is not 'mainnet' or 'preprod'
    if (
      network !== 'mainnet' &&
      network !== 'preprod' &&
      network !== 'preview'
    ) {
      throw new HttpException(503, NETWORK_ERROR_MESSAGE, NETWORK_ERROR_CODE);
    }
    const config = getCardanoConfig('cardano', network);
    this._chain = 'cardano';
    this.ttl = config.ttl;
    // Determine the appropriate Blockfrost Project ID and API URL
    const networkConfig = {
      preprod: config.preprodBlockfrostProjectId,
      preview: config.previewBlockfrostProjectId,
      mainnet: config.blockfrostProjectId, // Assuming mainnet as default
    };
    this.blockfrostProjectId =
      networkConfig[network] || config.blockfrostProjectId;

    this.allowedSlippage = config.allowedSlippage;
    this.apiURL = config.network.apiurl;
    this.defaultPoolId = config.defaultPoolId;
    this.sundaeswapPoolId = config.sundaeswapPoolId;
    this.network = config.network.name;
    this.nativeTokenSymbol = config.nativeCurrencySymbol;
    this.controller = CardanoController;
    this._tokenListSource = config.tokenListSource;
    this._tokenListType = <TokenListType>config.tokenListType;
  }
  public static getInstance(network: string): Cardano {
    if (Cardano._instances === undefined) {
      Cardano._instances = {};
    }
    if (!(network in Cardano._instances)) {
      Cardano._instances[network] = new Cardano(network);
    }

    return Cardano._instances[network];
  }

  public static getConnectedInstances(): { [name: string]: Cardano } {
    return Cardano._instances;
  }

  public get chain(): string {
    return this._chain;
  }

  public ready(): boolean {
    return this._ready;
  }

  public async init(): Promise<void> {
    if (!this.lucidInstance) {
      this.lucidInstance = await Lucid.new(
        new Blockfrost(this.apiURL, this.blockfrostProjectId),
        this.network === 'preprod'
          ? 'Preprod'
          : this.network === 'preview'
            ? 'Preview'
            : 'Mainnet',
      );
    }

    if (!this._ready) {
      // Ensure we only set ready once
      this._ready = true;
      await this.loadTokens(this._tokenListSource);
    }
  }

  private getLucid(): Lucid {
    if (!this.lucidInstance) {
      // Use instance-specific Lucid
      throw new Error('Lucid is not initialized. Call `init` first.');
    }
    return this.lucidInstance;
  }

  public async getWalletFromPrivateKey(privateKey: string): Promise<{
    address: string;
  }> {
    if (!this._ready) {
      throw new Error(
        'Cardano instance is not initialized. Call `init` first.',
      );
    }

    try {
      const lucid = this.getLucid();
      const wallet = lucid.selectWalletFromPrivateKey(privateKey);

      // Get wallet address
      const address = await lucid.wallet.address();
      return { address };
    } catch (error: any) {
      throw new Error(
        `Error retrieving wallet from private key: ${error.message}`,
      );
    }
  }

  public async getWalletFromAddress(address: string): Promise<{
    privateKey: string;
  }> {
    const path = `${walletPath}/${this._chain}`;
    const encryptedPrivateKey: string = await fse.readFile(
      `${path}/${address}.json`,
      'utf8',
    );
    const passphrase = ConfigManagerCertPassphrase.readPassphrase();
    if (!passphrase) {
      throw new Error('missing passphrase');
    }

    // Ensure decrypt is awaited if it's asynchronous
    const privateKey = await this.decrypt(encryptedPrivateKey, passphrase);

    return { privateKey }; // Correctly resolved the Promise<string> to string
  }
  // get native balance ADA
  public async getNativeBalance(privateKey: string): Promise<string> {
    const Lucid = this.getLucid();
    const wallet = Lucid.selectWalletFromPrivateKey(privateKey);

    // Get wallet address
    const address = await Lucid.wallet.address();
    // Fetch UTXOs at the wallet's address
    const utxos = await Lucid.utxosAt(address);

    // Calculate total balance in ADA using BigInt
    const totalLovelace = utxos.reduce(
      (acc, utxo) => acc + (utxo.assets.lovelace || 0n),
      0n,
    );

    // Convert Lovelace (BigInt) to ADA (Number)
    const balanceInADA = Number(totalLovelace) / 1_000_000;

    return balanceInADA.toString();
  }
  // get Asset balance like MIN and LP
  async getAssetBalance(privateKey: string, token: string): Promise<string> {
    let tokenAdress: string;
    const tokenInfo = this.getTokenForSymbol(token);

    // If token information is not found, throw an error
    if (!tokenInfo || tokenInfo.length === 0) {
      throw new Error(`Token ${token} is not supported.`);
    }
    // console.log('tokenInfo', tokenInfo);

    tokenAdress = tokenInfo[0]?.policyId + tokenInfo[0]?.assetName;
    // console.log('tokenAdress', tokenAdress);

    const Lucid = this.getLucid();
    const wallet = Lucid.selectWalletFromPrivateKey(privateKey);

    // Get wallet address
    const address = await Lucid.wallet.address();

    // Fetch UTXOs at the wallet's address
    const utxos = await Lucid.utxosAt(address);

    // Calculate token balance
    const calculatedTokenBalance = utxos.reduce((acc, utxo) => {
      if (utxo.assets[tokenAdress]) {
        return acc + Number(utxo.assets[tokenAdress]);
      }
      return acc;
    }, 0);
    // Divide raw balance by 10^decimals to get the actual amount
    const decimals = tokenInfo[0].decimals;
    const actualTokenBalance = calculatedTokenBalance / Math.pow(10, decimals);
    // console.log('calculatedTokenBalance: ', calculatedTokenBalance);
    // console.log('actualTokenBalance: ', actualTokenBalance);

    // Round to the specified decimal places
    return actualTokenBalance.toFixed(decimals);
  }

  async encrypt(secret: string, password: string): Promise<string> {
    try {
      const algorithm = 'aes-256-ctr';
      const iv = crypto.randomBytes(16);
      const salt = crypto.randomBytes(32);
      const key = crypto.pbkdf2Sync(password, salt, 5000, 32, 'sha512');
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      const encrypted = Buffer.concat([cipher.update(secret), cipher.final()]);

      const ivJSON = iv.toJSON();
      const saltJSON = salt.toJSON();
      const encryptedJSON = encrypted.toJSON();

      return JSON.stringify({
        algorithm,
        iv: ivJSON,
        salt: saltJSON,
        encrypted: encryptedJSON,
      });

      // return JSON.stringify({
      //   secret
      // });
    } catch (error: any) {
      throw new Error(`Error encrypting private key: ${error.message}`);
    }
  }

  async decrypt(encryptedSecret: string, password: string): Promise<string> {
    const hash = JSON.parse(encryptedSecret);
    const salt = Buffer.from(hash.salt, 'utf8');
    const iv = Buffer.from(hash.iv, 'utf8');

    const key = crypto.pbkdf2Sync(password, salt, 5000, 32, 'sha512');

    const decipher = crypto.createDecipheriv(hash.algorithm, key, iv);

    const decrpyted = Buffer.concat([
      decipher.update(Buffer.from(hash.encrypted, 'hex')),
      decipher.final(),
    ]);

    return decrpyted.toString();
  }

  async getCurrentBlockNumber(): Promise<number> {
    const response = await fetch(`${this.apiURL}/blocks/latest`, {
      headers: {
        project_id: this.blockfrostProjectId,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching latest block: ${response.statusText}`);
    }

    const latestBlock = await response.json();
    return latestBlock.height;
  }

  public async getTransaction(txHash: string): Promise<Object> {
    try {
      // Fetch transaction details from Blockfrost
      const response = await fetch(`${this.apiURL}/txs/${txHash}`, {
        method: 'GET',
        headers: {
          project_id: this.blockfrostProjectId, // Pass project ID in the header
        },
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Failed to fetch transaction: ${response.statusText}`);
      }

      // Parse the response JSON
      const tx = await response.json();

      // Simplify the response for the bot
      return {
        txHash: tx.hash,
        block: tx.block,
        blockHeight: tx.block_height,
        blockTime: tx.block_time,
        fees: tx.fees,
        validContract: tx.valid_contract,
        status: tx.block ? 'confirmed' : 'pending', // Simplified status
      };
    } catch (error) {
      console.error(`Error fetching transaction: ${error}`);
      throw error;
    }
  }

  async loadTokens(tokenListSource: string): Promise<void> {
    this.tokenList = await this.getTokenList(tokenListSource);
    if (this.tokenList) {
      this.tokenList.forEach((token: CardanoTokenInfo) => {
        if (!this._tokenMap[token.symbol]) {
          this._tokenMap[token.symbol] = [];
        }

        this._tokenMap[token.symbol].push(token);
      });
    }
  }

  async getTokenList(tokenListSource: string): Promise<CardanoTokenInfo[]> {
    let tokenList = JSON.parse(await fs.readFile(tokenListSource, 'utf8'));
    return tokenList.tokens;
  }

  public get storedTokenList(): CardanoTokenInfo[] {
    return this.tokenList;
  }

  public getTokenForSymbol(symbol: string): CardanoTokenInfo[] {
    return this._tokenMap[symbol] ?? [];
  }

  public getTokenAddress(symbol: string): string {
    let tokenAddress: string = '';
    let tokenInfo = this.getTokenForSymbol(symbol);
    // If token information is not found, throw an error
    if (!tokenInfo || tokenInfo.length === 0) {
      // Handle token not supported errors
      throw new HttpException(
        500,
        TOKEN_NOT_SUPPORTED_ERROR_MESSAGE,
        TOKEN_NOT_SUPPORTED_ERROR_CODE,
      );
    }
    // console.log("tokenInfo", tokenInfo);

    tokenAddress = tokenInfo[0]?.policyId + tokenInfo[0]?.assetName;
    // console.log("tokenAdress", tokenAddress);

    return tokenAddress;
  }

  async close() {
    if (this._chain in Cardano._instances) {
      delete Cardano._instances[this._chain];
    }
  }
}
