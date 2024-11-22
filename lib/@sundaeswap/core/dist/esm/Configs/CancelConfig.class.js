import { OrderConfig } from "../Abstracts/OrderConfig.abstract.class.js";
/**
 * The main config class for building valid arguments for a Cancel.
 */
export class CancelConfig extends OrderConfig {
    ownerAddress;
    utxo;
    constructor(args) {
        super();
        args && this.setFromObject(args);
    }
    setUTXO(utxo) {
        this.utxo = utxo;
        return this;
    }
    setOwnerAddress(address) {
        this.ownerAddress = address;
    }
    buildArgs() {
        this.validate();
        return {
            ownerAddress: this.ownerAddress,
            utxo: this.utxo,
            referralFee: this.referralFee,
        };
    }
    setFromObject({ utxo, ownerAddress, referralFee }) {
        this.setUTXO(utxo);
        this.setOwnerAddress(ownerAddress);
        referralFee && this.setReferralFee(referralFee);
    }
    validate() {
        if (!this.utxo) {
            throw new Error("You did not add the order's UTXO for this cancellation. Set a valid UTXO with .setUTXO()");
        }
        if (!this.ownerAddress) {
            throw new Error("An owner address is required for validation purposes. Set the owner address of the order with .setOwnerAddress()");
        }
    }
}
//# sourceMappingURL=CancelConfig.class.js.map