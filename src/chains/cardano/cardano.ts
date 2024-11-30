import { getCardanoConfig } from "./cardano.config";
import { Lucid, Blockfrost, C } from "lucid-cardano";
import crypto from 'crypto';

//import { Cardanoish } from "../../services/common-interfaces";

export class Cardano {
  private static _instances: { [name: string]: Cardano };
  private cardanoNetwork: string;
  public allowedSlippage?: string;
  public blockfrostProjectId: string;
  //public gasLimitEstimate: number;
  public ttl?: string;
  private _chain: string;
  private _ready: boolean = false;
  public apiURL: any;
  public defaultPoolId: string;

  private constructor(network: string) {
    const config = getCardanoConfig('cardano', network);
    this._chain = 'cardano';
    this.ttl = config.ttl;
    // Determine the appropriate Blockfrost Project ID and API URL
    if (network === "preprod") {
      this.blockfrostProjectId = config.preprodBlockfrostProjectId;
    } else {
      this.blockfrostProjectId = config.blockfrostProjectId;
    }
    // this.blockfrostProjectId = config.blockfrostProjectId;
    //config.
    //this.gasLimitEstimate = config.gasLimitEstimate;
    this.allowedSlippage = config.allowedSlippage;
    // this.network = config.network;
    this.apiURL = config.network.apiurl;
    this.defaultPoolId = config.defaultPoolId;
    this.cardanoNetwork = config.network.name;

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

    this._ready = true;
    return;
  }

  public async getWalletFromPrivateKey(privateKey: string,): Promise<{
    address: string;
  }> {
    if (!this._ready) {
      throw new Error("Cardano instance is not initialized. Call `init` first.");
    }

    try {
      // we can create address from private key using lucid-cardano
      // Initialize Lucid
      const lucid = await Lucid.new(
        new Blockfrost(this.apiURL, this.blockfrostProjectId),
        this.cardanoNetwork == "preprod" ? "Preprod" : "Mainnet"
      );
      const wallet = lucid.selectWalletFromPrivateKey(privateKey);

      // Get wallet address
      const address = await lucid.wallet.address();
      return { address };
    } catch (error: any) {
      throw new Error(`Error retrieving wallet from private key: ${error.message}`);
    }
  }

  async encrypt(secret: string,): Promise<string> {
    try {
      // const algorithm = 'aes-256-ctr';
      // const iv = crypto.randomBytes(16);
      // const salt = crypto.randomBytes(32);
      // const key = crypto.pbkdf2Sync(password, salt, 5000, 32, 'sha512');
      // const cipher = crypto.createCipheriv(algorithm, key, iv);
      // const encrypted = Buffer.concat([cipher.update(secret), cipher.final()]);

      // const ivJSON = iv.toJSON();
      // const saltJSON = salt.toJSON();
      // const encryptedJSON = encrypted.toJSON();

      // return JSON.stringify({
      //   algorithm,
      //   iv: ivJSON,
      //   salt: saltJSON,
      //   encrypted: encryptedJSON,
      // });

      return JSON.stringify({
        secret
      });
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

}