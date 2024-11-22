import { AssetAmount } from "@sundaeswap/asset";
/**
 * The Config class represents a base configuration for all SDK methods.
 * It is meant to be extended by more specific configuration classes.
 * @template Args The type of the arguments object, defaulting to an empty object.
 */
export class Config {
    INVALID_FEE_AMOUNT = `The fee amount must be of type AssetAmount.`;
    /**
     * An optional argument that contains referral fee data.
     */
    referralFee;
    /**
     * An inherited method that allows a config to add an optional referral fee.
     *
     * @param {ITxBuilderReferralFee} fee The desired fee.
     */
    setReferralFee(fee) {
        this.referralFee = fee;
    }
    /**
     * A method to validate the current configuration.
     * Implementations should check their properties and throw errors if they are invalid.
     * @throws {Error} If the configuration is invalid.
     */
    validate() {
        if (!this.referralFee) {
            return;
        }
        if (!(this.referralFee.payment instanceof AssetAmount)) {
            throw new Error(this.INVALID_FEE_AMOUNT);
        }
    }
}
//# sourceMappingURL=Config.abstract.class.js.map