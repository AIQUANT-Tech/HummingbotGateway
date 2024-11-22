import { ICancelConfigArgs, TUTXO } from "../@types/index.js";
import { OrderConfig } from "../Abstracts/OrderConfig.abstract.class.js";
/**
 * The main config class for building valid arguments for a Cancel.
 */
export declare class CancelConfig extends OrderConfig<ICancelConfigArgs> {
    ownerAddress?: string;
    utxo?: TUTXO;
    constructor(args?: ICancelConfigArgs);
    setUTXO(utxo: TUTXO): this;
    setOwnerAddress(address: string): void;
    buildArgs(): ICancelConfigArgs;
    setFromObject({ utxo, ownerAddress, referralFee }: ICancelConfigArgs): void;
    validate(): never | void;
}
//# sourceMappingURL=CancelConfig.class.d.ts.map