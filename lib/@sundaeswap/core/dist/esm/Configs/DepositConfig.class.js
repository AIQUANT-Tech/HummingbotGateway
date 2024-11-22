import { OrderConfig } from "../Abstracts/OrderConfig.abstract.class.js";
/**
 * The main config class for building valid arguments for a Deposit.
 */
export class DepositConfig extends OrderConfig {
    suppliedAssets;
    constructor(args) {
        super();
        args && this.setFromObject(args);
    }
    setSuppliedAssets(assets) {
        this.suppliedAssets = assets;
        return this;
    }
    buildArgs() {
        this.validate();
        return {
            orderAddresses: this.orderAddresses,
            pool: this.pool,
            suppliedAssets: this.suppliedAssets,
            referralFee: this.referralFee,
        };
    }
    setFromObject({ orderAddresses, pool, suppliedAssets, referralFee, }) {
        this.setOrderAddresses(orderAddresses);
        this.setPool(pool);
        this.setSuppliedAssets(suppliedAssets);
        referralFee && this.setReferralFee(referralFee);
    }
    validate() {
        super.validate();
        if (!this.suppliedAssets) {
            throw new Error("You did not provided funding for this deposit! Make sure you supply both sides of the pool with .setSuppliedAssets()");
        }
    }
}
//# sourceMappingURL=DepositConfig.class.js.map