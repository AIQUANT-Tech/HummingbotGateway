"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const asset_1 = require("@sundaeswap/asset");
/**
 * The Config class represents a base configuration for all SDK methods.
 * It is meant to be extended by more specific configuration classes.
 * @template Args The type of the arguments object, defaulting to an empty object.
 */
class Config {
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
        if (!(this.referralFee.payment instanceof asset_1.AssetAmount)) {
            throw new Error(this.INVALID_FEE_AMOUNT);
        }
    }
}
exports.Config = Config;
//# sourceMappingURL=Config.abstract.class.js.map