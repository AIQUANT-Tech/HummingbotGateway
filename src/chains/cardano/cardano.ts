import { getCardanoConfig } from "./cardano.config";
import { Lucid, Blockfrost, C } from "lucid-cardano";
import { TokenListType, walletPath } from '../../services/base';
import { ConfigManagerCertPassphrase } from '../../services/config-manager-cert-passphrase';
import fse from 'fs-extra';
import crypto from 'crypto';
import { CardanoController } from "./cardano.controller";

//import { Cardanoish } from "../../services/common-interfaces";

export class Cardano {
  private static _instances: { [name: string]: Cardano };
  private static lucidInstance: Lucid | null = null;
  private network: string;
  public allowedSlippage?: string;
  public blockfrostProjectId: string;
  //public gasLimitEstimate: number;
  public ttl?: string;
  private _chain: string;
  private _ready: boolean = false;
  public apiURL: any;
  public defaultPoolId: string;
  public nativeTokenSymbol: string;
  public controller: typeof CardanoController;

  private constructor(network: string) {
    const config = getCardanoConfig('cardano', network);
    this._chain = 'cardano';
    this.ttl = config.ttl;
    // Determine the appropriate Blockfrost Project ID and API URL
    this.blockfrostProjectId =
      network === "preprod"
        ? config.preprodBlockfrostProjectId
        : config.blockfrostProjectId;

    // this.gasLimitEstimate = config.gasLimitEstimate;
    this.allowedSlippage = config.allowedSlippage;
    // this.network = config.network;
    this.apiURL = config.network.apiurl;
    this.defaultPoolId = config.defaultPoolId;
    this.network = config.network.name;
    this.nativeTokenSymbol = config.nativeCurrencySymbol;
    this.controller = CardanoController;
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
    if (!Cardano.lucidInstance) {
      Cardano.lucidInstance = await Lucid.new(
        new Blockfrost(this.apiURL, this.blockfrostProjectId),
        this.network === "preprod" ? "Preprod" : "Mainnet"
      );
    }
    this._ready = true;
    return;
  }

  private getLucid(): Lucid {
    if (!Cardano.lucidInstance) {
      throw new Error("Lucid is not initialized. Call `init` first.");
    }
    return Cardano.lucidInstance;
  }

  public async getWalletFromPrivateKey(privateKey: string,): Promise<{
    address: string;
  }> {
    if (!this._ready) {
      throw new Error("Cardano instance is not initialized. Call `init` first.");
    }

    try {
      const lucid = this.getLucid();
      const wallet = lucid.selectWalletFromPrivateKey(privateKey);

      // Get wallet address
      const address = await lucid.wallet.address();
      return { address };
    } catch (error: any) {
      throw new Error(`Error retrieving wallet from private key: ${error.message}`);
    }
  }

  public async getWalletFromAddress(address: string): Promise<{
    privateKey: string;
  }> {
    const path = `${walletPath}/${this._chain}`;
    const encryptedPrivateKey: string = await fse.readFile(
      `${path}/${address}.json`,
      'utf8'
    );
    const passphrase = ConfigManagerCertPassphrase.readPassphrase();
    if (!passphrase) {
      throw new Error('missing passphrase');
    }

    // Ensure decrypt is awaited if it's asynchronous
    const privateKey = await this.decrypt(encryptedPrivateKey, passphrase);

    return { privateKey }; // Correctly resolved the Promise<string> to string
  }

  public async getAssetBalance(privateKey: string): Promise<string> {
    const Lucid = this.getLucid();
    const wallet = Lucid.selectWalletFromPrivateKey(privateKey);

    // Get wallet address
    const address = await Lucid.wallet.address();
    // Fetch UTXOs at the wallet's address
    const utxos = await Lucid.utxosAt(address);
    console.log("UTXOs:", utxos);

    // Calculate total balance in ADA using BigInt
    const totalLovelace = utxos.reduce(
      (acc, utxo) => acc + (utxo.assets.lovelace || 0n),
      0n
    );

    // Convert Lovelace (BigInt) to ADA (Number)
    const balanceInADA = Number(totalLovelace) / 1_000_000;

    return balanceInADA.toString();
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
    const response = await fetch(
      `${this.apiURL}/blocks/latest`,
      {
        headers: {
          project_id: this.blockfrostProjectId,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching latest block: ${response.statusText}`);
    }

    const latestBlock = await response.json();
    return latestBlock.height;
  }

}