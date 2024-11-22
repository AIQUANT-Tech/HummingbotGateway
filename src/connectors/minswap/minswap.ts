import { logger } from "../../services/logger";

export class MinSwap  {
    private static _instances: { [name: string]: MinSwap };
    constructor(network: string) {
       logger.info('Minswap Network',network)
      }
    public static getInstance(network: string): MinSwap {
        if (MinSwap._instances === undefined) {
            this._instances = {};
        }
        if (!(network in this._instances)) {
            this._instances[network] = new MinSwap(network);
        }
    
        return this._instances[network];
      }
    public async init() {  }
    public ready(): boolean {
        return true;
      }
}