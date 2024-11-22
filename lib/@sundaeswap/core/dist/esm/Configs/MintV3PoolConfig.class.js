import { Config } from "../Abstracts/Config.abstract.class.js";
export class MintV3PoolConfig extends Config {
    static MAX_FEE = 500n;
    assetA;
    assetB;
    fees;
    marketTimings;
    donateToTreasury;
    ownerAddress;
    constructor(args) {
        super();
        args && this.setFromObject(args);
    }
    setFromObject({ assetA, assetB, fees, marketOpen, ownerAddress, referralFee, donateToTreasury, }) {
        referralFee && this.setReferralFee(referralFee);
        this.setAssetA(assetA);
        this.setAssetB(assetB);
        this.setFees(fees);
        this.setMarketOpen(marketOpen || 0n);
        this.setOwnerAddress(ownerAddress);
        this.setDonateToTreasury(donateToTreasury);
    }
    buildArgs() {
        this.validate();
        return {
            assetA: this.assetA,
            assetB: this.assetB,
            fees: this.fees,
            marketOpen: this.marketTimings,
            ownerAddress: this.ownerAddress,
            referralFee: this.referralFee,
            donateToTreasury: this.donateToTreasury,
        };
    }
    setDonateToTreasury(val) {
        this.donateToTreasury = val;
        return this;
    }
    setAssetA(assetA) {
        this.assetA = assetA;
        return this;
    }
    setAssetB(assetB) {
        this.assetB = assetB;
        return this;
    }
    setFees(fees) {
        this.fees =
            typeof fees === "bigint"
                ? {
                    ask: fees,
                    bid: fees,
                }
                : fees;
        return this;
    }
    setMarketOpen(timing) {
        this.marketTimings = timing;
        return this;
    }
    setOwnerAddress(address) {
        this.ownerAddress = address;
        return this;
    }
    validate() {
        super.validate();
        if (!this.fees) {
            throw new Error(`No fees were set, but are required.`);
        }
        if (this.fees.ask === this.fees.bid) {
            if (this.fees.ask > MintV3PoolConfig.MAX_FEE ||
                this.fees.bid > MintV3PoolConfig.MAX_FEE) {
                throw new Error(`Fees cannot supersede the max fee of ${MintV3PoolConfig.MAX_FEE}.`);
            }
        }
        else {
            if (this.fees.ask > MintV3PoolConfig.MAX_FEE) {
                throw new Error(`Ask fee cannot supersede the max fee of ${MintV3PoolConfig.MAX_FEE}.`);
            }
            if (this.fees.bid > MintV3PoolConfig.MAX_FEE) {
                throw new Error(`Bid fee cannot supersede the max fee of ${MintV3PoolConfig.MAX_FEE}.`);
            }
        }
        if (this.donateToTreasury &&
            (this.donateToTreasury > 100n || this.donateToTreasury < 0n)) {
            throw new Error(`Donation value is determined as a percentage between 0 and 100`);
        }
    }
}
//# sourceMappingURL=MintV3PoolConfig.class.js.map