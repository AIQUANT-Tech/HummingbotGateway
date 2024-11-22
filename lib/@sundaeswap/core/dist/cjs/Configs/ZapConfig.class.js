"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZapConfig = void 0;
const OrderConfig_abstract_class_js_1 = require("../Abstracts/OrderConfig.abstract.class.js");
/**
 * The main config class for building valid arguments for a Zap.
 */
class ZapConfig extends OrderConfig_abstract_class_js_1.OrderConfig {
    suppliedAsset;
    zapDirection;
    swapSlippage;
    constructor(args) {
        super();
        args && this.setFromObject(args);
    }
    setSwapSlippage(amount) {
        this.swapSlippage = amount;
        return this;
    }
    setSuppliedAsset(asset) {
        this.suppliedAsset = asset;
        return this;
    }
    setZapDirection(direction) {
        this.zapDirection = direction;
        return this;
    }
    buildArgs() {
        this.validate();
        return {
            orderAddresses: this.orderAddresses,
            pool: this.pool,
            suppliedAsset: this.suppliedAsset,
            zapDirection: this.zapDirection,
            swapSlippage: (this.swapSlippage ?? 0),
            referralFee: this.referralFee,
        };
    }
    setFromObject({ orderAddresses, pool, suppliedAsset, zapDirection, swapSlippage, referralFee, }) {
        this.setOrderAddresses(orderAddresses);
        this.setPool(pool);
        this.setSuppliedAsset(suppliedAsset);
        this.setZapDirection(zapDirection);
        this.setSwapSlippage(swapSlippage ?? 0);
        referralFee && this.setReferralFee(referralFee);
    }
    validate() {
        super.validate();
        if (this.swapSlippage && (this.swapSlippage > 1 || this.swapSlippage < 0)) {
            throw new Error("You provided an invalid number for the desired swap slippage. Please choose a float number between 0 and 1.");
        }
        if (!this.suppliedAsset) {
            throw new Error("You did not provided funding for this deposit! Make sure you supply both sides of the pool with .setSuppliedAssets()");
        }
        if (typeof this.zapDirection === "undefined") {
            throw new Error("You did not provide a Zap Direction for this deposit! Make sure you supply the Zap Direction with .setZapDirection()");
        }
    }
}
exports.ZapConfig = ZapConfig;
//# sourceMappingURL=ZapConfig.class.js.map