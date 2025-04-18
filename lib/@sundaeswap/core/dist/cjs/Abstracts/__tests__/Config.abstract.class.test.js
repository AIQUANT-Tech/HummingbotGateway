"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asset_1 = require("@sundaeswap/asset");
const Config_abstract_class_js_1 = require("../Config.abstract.class.js");
const mockAddress = "addr_test1qzrf9g3ea6hzgpnlkm4dr48kx6hy073t2j2gssnpm4mgcnqdxw2hcpavmh0vexyzg476ytc9urgcnalujkcewtnd2yzsfd9r32";
class TestClass extends Config_abstract_class_js_1.Config {
    constructor() {
        super();
    }
    setFromObject() { }
    buildArgs() {
        this.validate();
        return {};
    }
    validate() {
        super.validate();
    }
}
describe("Config", () => {
    it("should set the referral fee correctly", () => {
        const configWithAmount = new TestClass();
        const amountConfig = {
            destination: mockAddress,
            payment: new asset_1.AssetAmount(10n, { assetId: "", decimals: 6 }),
        };
        configWithAmount.setReferralFee(amountConfig);
        expect(configWithAmount.referralFee).toMatchObject(amountConfig);
        const configWithPercent = new TestClass();
        const percentConfig = {
            destination: mockAddress,
            payment: new asset_1.AssetAmount(10n, { assetId: "", decimals: 6 }),
        };
        configWithPercent.setReferralFee(percentConfig);
        expect(configWithPercent.referralFee).toMatchObject(percentConfig);
        const configWithLabel = new TestClass();
        const labelConfig = {
            destination: mockAddress,
            payment: new asset_1.AssetAmount(10n, { assetId: "", decimals: 6 }),
            feeLabel: "Test Fee",
        };
        configWithLabel.setReferralFee(labelConfig);
        expect(configWithLabel.referralFee).toMatchObject(labelConfig);
    });
    it("should validate the referral fee correctly", () => {
        const configWithAmount = new TestClass();
        const amountConfig = {
            destination: mockAddress,
            // @ts-ignore
            payment: 6,
        };
        configWithAmount.setReferralFee(amountConfig);
        expect(() => configWithAmount.buildArgs()).toThrowError(new Error(configWithAmount.INVALID_FEE_AMOUNT));
    });
});
//# sourceMappingURL=Config.abstract.class.test.js.map