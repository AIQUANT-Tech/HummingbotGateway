"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StableswapConstant = exports.StablePool = exports.PoolV2 = exports.PoolV1 = exports.OrderV1 = exports.NetworkId = exports.MetadataMessage = exports.FIXED_DEPOSIT_ADA = exports.DexV2Constant = exports.DexV1Constant = exports.Dex = exports.DEFAULT_POOL_V2_TRADING_FEE_DENOMINATOR = exports.BlockfrostAdapter = exports.BATCHER_FEE_REDUCTION_SUPPORTED_ASSET = exports.Asset = exports.ADA ;
exports.calculateDeposit = calculateDeposit;
exports.calculateSwapExactIn = calculateSwapExactIn;
exports.calculateSwapExactOut = calculateSwapExactOut;
exports.calculateWithdraw = calculateWithdraw;
exports.calculateZapIn = calculateZapIn;
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.number.to-fixed.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.string.ends-with.js");
require("core-js/modules/es.string.starts-with.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _blockfrostJs = require("@blockfrost/blockfrost-js");
var _tinyInvariant = _interopRequireDefault(require("@minswap/tiny-invariant"));
var _big = _interopRequireDefault(require("big.js"));
try{
  var _lucidCardano = _interopRequireDefault(require("lucid-cardano"));
}catch(error){
  console.log('_lucidCardano-------',error)
}


var _sha = require("sha3");
var _bignumber = _interopRequireDefault(require("bignumber.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
console.log('entry point reached-------3');
const ADA = exports.ADA = {
  policyId: "",
  tokenName: ""
};
var Asset;
(Asset2 => {
  function fromString(s) {
    if (s === "lovelace") {
      return {
        policyId: "",
        tokenName: ""
      };
    }
    const policyId = s.slice(0, 56);
    const tokenName = s.slice(56);
    return {
      policyId,
      tokenName
    };
  }
  Asset2.fromString = fromString;
  function toString(asset) {
    const {
      policyId,
      tokenName
    } = asset;
    if (policyId === "" && tokenName === "") {
      return "lovelace";
    }
    return policyId + tokenName;
  }
  Asset2.toString = toString;
  function toPlutusData(asset) {
    const {
      policyId,
      tokenName
    } = asset;
    return new _lucidCardano.Constr(0, [policyId, tokenName]);
  }
  Asset2.toPlutusData = toPlutusData;
  function fromPlutusData(data) {
    if (data.index !== 0) {
      throw new Error("Index of Asset must be 0, actual: ".concat(data.index));
    }
    return {
      policyId: data.fields[0],
      tokenName: data.fields[1]
    };
  }
  Asset2.fromPlutusData = fromPlutusData;
})(Asset || (exports.Asset = Asset = {}));
var NetworkId = exports.NetworkId = /* @__PURE__ */(NetworkId2 => {
  NetworkId2[NetworkId2["TESTNET"] = 0] = "TESTNET";
  NetworkId2[NetworkId2["MAINNET"] = 1] = "MAINNET";
  return NetworkId2;
})(NetworkId || {});
var DexV1Constant;
(DexV1Constant2 => {
  DexV1Constant2.ORDER_BASE_ADDRESS = {
    [NetworkId.TESTNET]: "addr_test1zzn9efv2f6w82hagxqtn62ju4m293tqvw0uhmdl64ch8uwurajt8r8wqtygrfduwgukk73m5gcnplmztc5tl5ngy0upq932hcy",
    [NetworkId.MAINNET]: "addr1zxn9efv2f6w82hagxqtn62ju4m293tqvw0uhmdl64ch8uw6j2c79gy9l76sdg0xwhd7r0c0kna0tycz4y5s6mlenh8pq6s3z70"
  };
  DexV1Constant2.POOL_SCRIPT_HASH = "script1uychk9f04tqngfhx4qlqdlug5ntzen3uzc62kzj7cyesjk0d9me";
  DexV1Constant2.FACTORY_POLICY_ID = "13aa2accf2e1561723aa26871e071fdf32c867cff7e7d50ad470d62f";
  DexV1Constant2.FACTORY_ASSET_NAME = "4d494e53574150";
  DexV1Constant2.LP_POLICY_ID = "e4214b7cce62ac6fbba385d164df48e157eae5863521b4b67ca71d86";
  DexV1Constant2.POOL_NFT_POLICY_ID = "0be55d262b29f564998ff81efe21bdc0022621c12f15af08d0f2ddb1";
  DexV1Constant2.ORDER_SCRIPT = {
    type: "PlutusV1",
    script: "59014f59014c01000032323232323232322223232325333009300e30070021323233533300b3370e9000180480109118011bae30100031225001232533300d3300e22533301300114a02a66601e66ebcc04800400c5288980118070009bac3010300c300c300c300c300c300c300c007149858dd48008b18060009baa300c300b3754601860166ea80184ccccc0288894ccc04000440084c8c94ccc038cd4ccc038c04cc030008488c008dd718098018912800919b8f0014891ce1317b152faac13426e6a83e06ff88a4d62cce3c1634ab0a5ec133090014a0266008444a00226600a446004602600a601a00626600a008601a006601e0026ea8c03cc038dd5180798071baa300f300b300e3754601e00244a0026eb0c03000c92616300a001375400660106ea8c024c020dd5000aab9d5744ae688c8c0088cc0080080048c0088cc00800800555cf2ba15573e6e1d200201"
  };
})(DexV1Constant || (exports.DexV1Constant = DexV1Constant = {}));
var StableswapConstant;
(StableswapConstant2 => {
  StableswapConstant2.CONFIG = {
    [NetworkId.TESTNET]: [{
      orderAddress: "addr_test1zq8spknltt6yyz2505rhc5lqw89afc4anhu4u0347n5dz8urajt8r8wqtygrfduwgukk73m5gcnplmztc5tl5ngy0upqa63kst",
      poolAddress: "addr_test1zr3hs60rn9x49ahuduuzmnlhnema0jsl4d3ujrf3cmurhmvrajt8r8wqtygrfduwgukk73m5gcnplmztc5tl5ngy0upqcgz9yc",
      nftAsset: "06fe1ba957728130154154d5e5b25a7b533ebe6c4516356c0aa69355646a65642d697573642d76312e342d6c70",
      lpAsset: "d16339238c9e1fb4d034b6a48facb2f97794a9cdb7bc049dd7c49f54646a65642d697573642d76312e342d6c70",
      assets: ["e16c2dc8ae937e8d3790c7fd7168d7b994621ba14ca11415f39fed7274444a4544", "e16c2dc8ae937e8d3790c7fd7168d7b994621ba14ca11415f39fed727469555344"],
      multiples: [1n, 1n],
      fee: 1000000n,
      adminFee: 5000000000n,
      feeDenominator: 10000000000n
    }, {
      orderAddress: "addr_test1zp3mf7r63u8km2d69kh6v2axlvl04yunmmj67vprljuht4urajt8r8wqtygrfduwgukk73m5gcnplmztc5tl5ngy0upqhelj6n",
      poolAddress: "addr_test1zzc8ar93kgntz3lv95uauhe29kj4yj84mxhg5v9dqj4k7p5rajt8r8wqtygrfduwgukk73m5gcnplmztc5tl5ngy0upqujv25l",
      nftAsset: "06fe1ba957728130154154d5e5b25a7b533ebe6c4516356c0aa69355757364632d757364742d76312e342d6c70",
      lpAsset: "8db03e0cc042a5f82434123a0509f590210996f1c7410c94f913ac48757364632d757364742d76312e342d6c70",
      assets: ["e16c2dc8ae937e8d3790c7fd7168d7b994621ba14ca11415f39fed727455534443", "e16c2dc8ae937e8d3790c7fd7168d7b994621ba14ca11415f39fed727455534454"],
      multiples: [1n, 1n],
      fee: 1000000n,
      adminFee: 5000000000n,
      feeDenominator: 10000000000n
    }, {
      orderAddress: "addr_test1zqpmw0kkgm6fp9x0asq5vwuaccweeqdv3edhwckqr2gnvzurajt8r8wqtygrfduwgukk73m5gcnplmztc5tl5ngy0upq9z8vxj",
      poolAddress: "addr_test1zqh2uv0wvrtt579e92q35ktkzcj3lj3nzdm3xjpsdack3q5rajt8r8wqtygrfduwgukk73m5gcnplmztc5tl5ngy0upqud27a8",
      nftAsset: "06fe1ba957728130154154d5e5b25a7b533ebe6c4516356c0aa69355646a65642d697573642d6461692d76312e342d6c70",
      lpAsset: "492fd7252d5914c9f5acb7eeb6b905b3a65b9a952c2300de34eb86c5646a65642d697573642d6461692d76312e342d6c70",
      assets: ["e16c2dc8ae937e8d3790c7fd7168d7b994621ba14ca11415f39fed7274444a4544", "e16c2dc8ae937e8d3790c7fd7168d7b994621ba14ca11415f39fed727469555344", "e16c2dc8ae937e8d3790c7fd7168d7b994621ba14ca11415f39fed7274444149"],
      multiples: [1n, 1n, 1n],
      fee: 1000000n,
      adminFee: 5000000000n,
      feeDenominator: 10000000000n
    }],
    [NetworkId.MAINNET]: [{
      orderAddress: "addr1w9xy6edqv9hkptwzewns75ehq53nk8t73je7np5vmj3emps698n9g",
      poolAddress: "addr1wy7kkcpuf39tusnnyga5t2zcul65dwx9yqzg7sep3cjscesx2q5m5",
      nftAsset: "5d4b6afd3344adcf37ccef5558bb87f522874578c32f17160512e398444a45442d695553442d534c50",
      lpAsset: "2c07095028169d7ab4376611abef750623c8f955597a38cd15248640444a45442d695553442d534c50",
      assets: ["8db269c3ec630e06ae29f74bc39edd1f87c819f1056206e879a1cd61446a65644d6963726f555344", "f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b6988069555344"],
      multiples: [1n, 1n],
      fee: 1000000n,
      adminFee: 5000000000n,
      feeDenominator: 10000000000n
    }, {
      orderAddress: "addr1w93d8cuht3hvqt2qqfjqgyek3gk5d6ss2j93e5sh505m0ng8cmze2",
      poolAddress: "addr1wx8d45xlfrlxd7tctve8xgdtk59j849n00zz2pgyvv47t8sxa6t53",
      nftAsset: "d97fa91daaf63559a253970365fb219dc4364c028e5fe0606cdbfff9555344432d444a45442d534c50",
      lpAsset: "ac49e0969d76ed5aa9e9861a77be65f4fc29e9a979dc4c37a99eb8f4555344432d444a45442d534c50",
      assets: ["25c5de5f5b286073c593edfd77b48abc7a48e5a4f3d4cd9d428ff93555534443", "8db269c3ec630e06ae29f74bc39edd1f87c819f1056206e879a1cd61446a65644d6963726f555344"],
      multiples: [1n, 100n],
      fee: 1000000n,
      adminFee: 5000000000n,
      feeDenominator: 10000000000n
    }, {
      orderAddress: "addr1wxtv9k2lcum5pmcc4wu44a5tufulszahz84knff87wcawycez9lug",
      poolAddress: "addr1w9520fyp6g3pjwd0ymfy4v2xka54ek6ulv4h8vce54zfyfcm2m0sm",
      nftAsset: "96402c6f5e7a04f16b4d6f500ab039ff5eac5d0226d4f88bf5523ce85553444d2d695553442d534c50",
      lpAsset: "31f92531ac9f1af3079701fab7c66ce997eb07988277ee5b9d6403015553444d2d695553442d534c50",
      assets: ["c48cbb3d5e57ed56e276bc45f99ab39abe94e6cd7ac39fb402da47ad0014df105553444d", "f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b6988069555344"],
      multiples: [1n, 1n],
      fee: 1000000n,
      adminFee: 5000000000n,
      feeDenominator: 10000000000n
    }, {
      orderAddress: "addr1wxr9ppdymqgw6g0hvaaa7wc6j0smwh730ujx6lczgdynehsguav8d",
      poolAddress: "addr1wxxdvtj6y4fut4tmu796qpvy2xujtd836yg69ahat3e6jjcelrf94",
      nftAsset: "07b0869ed7488657e24ac9b27b3f0fb4f76757f444197b2a38a15c3c444a45442d5553444d2d534c50",
      lpAsset: "5b042cf53c0b2ce4f30a9e743b4871ad8c6dcdf1d845133395f55a8e444a45442d5553444d2d534c50",
      assets: ["8db269c3ec630e06ae29f74bc39edd1f87c819f1056206e879a1cd61446a65644d6963726f555344", "c48cbb3d5e57ed56e276bc45f99ab39abe94e6cd7ac39fb402da47ad0014df105553444d"],
      multiples: [1n, 1n],
      fee: 1000000n,
      adminFee: 5000000000n,
      feeDenominator: 10000000000n
    }]
  };
  StableswapConstant2.DEPLOYED_SCRIPTS = {
    [NetworkId.TESTNET]: {
      "06fe1ba957728130154154d5e5b25a7b533ebe6c4516356c0aa69355646a65642d697573642d76312e342d6c70": {
        order: {
          "txHash": "527e421bc3eb8b9e5ec0a9ad214bb9b76148f57b9a5a8cbd83a51264f943e91d",
          "outputIndex": 0
        },
        pool: {
          "txHash": "527e421bc3eb8b9e5ec0a9ad214bb9b76148f57b9a5a8cbd83a51264f943e91d",
          "outputIndex": 1
        },
        lp: {
          "txHash": "527e421bc3eb8b9e5ec0a9ad214bb9b76148f57b9a5a8cbd83a51264f943e91d",
          "outputIndex": 2
        },
        poolBatching: {
          "txHash": "527e421bc3eb8b9e5ec0a9ad214bb9b76148f57b9a5a8cbd83a51264f943e91d",
          "outputIndex": 3
        }
      },
      "06fe1ba957728130154154d5e5b25a7b533ebe6c4516356c0aa69355757364632d757364742d76312e342d6c70": {
        order: {
          "txHash": "cf699550642c8ffc1673d1e5d56d8562ca7c7f5c0b513a8428c3f52cdcc8fdb7",
          "outputIndex": 0
        },
        pool: {
          "txHash": "cf699550642c8ffc1673d1e5d56d8562ca7c7f5c0b513a8428c3f52cdcc8fdb7",
          "outputIndex": 1
        },
        lp: {
          "txHash": "cf699550642c8ffc1673d1e5d56d8562ca7c7f5c0b513a8428c3f52cdcc8fdb7",
          "outputIndex": 2
        },
        poolBatching: {
          "txHash": "cf699550642c8ffc1673d1e5d56d8562ca7c7f5c0b513a8428c3f52cdcc8fdb7",
          "outputIndex": 3
        }
      },
      "06fe1ba957728130154154d5e5b25a7b533ebe6c4516356c0aa69355646a65642d697573642d6461692d76312e342d6c70": {
        order: {
          "txHash": "a8ab602259654697c85e2f61752d34cdb631f314eaeded0676fee6f6be70afe7",
          "outputIndex": 0
        },
        pool: {
          "txHash": "a8ab602259654697c85e2f61752d34cdb631f314eaeded0676fee6f6be70afe7",
          "outputIndex": 1
        },
        lp: {
          "txHash": "a8ab602259654697c85e2f61752d34cdb631f314eaeded0676fee6f6be70afe7",
          "outputIndex": 2
        },
        poolBatching: {
          "txHash": "a8ab602259654697c85e2f61752d34cdb631f314eaeded0676fee6f6be70afe7",
          "outputIndex": 3
        }
      }
    },
    [NetworkId.MAINNET]: {
      "5d4b6afd3344adcf37ccef5558bb87f522874578c32f17160512e398444a45442d695553442d534c50": {
        order: {
          "txHash": "20227174ec2f7853a71a02c435d063b3bf63851d4e0ad9a0c09250a087a6577e",
          "outputIndex": 0
        },
        pool: {
          "txHash": "20227174ec2f7853a71a02c435d063b3bf63851d4e0ad9a0c09250a087a6577e",
          "outputIndex": 1
        },
        lp: {
          "txHash": "20227174ec2f7853a71a02c435d063b3bf63851d4e0ad9a0c09250a087a6577e",
          "outputIndex": 2
        },
        poolBatching: {
          "txHash": "20227174ec2f7853a71a02c435d063b3bf63851d4e0ad9a0c09250a087a6577e",
          "outputIndex": 3
        }
      },
      "d97fa91daaf63559a253970365fb219dc4364c028e5fe0606cdbfff9555344432d444a45442d534c50": {
        order: {
          "txHash": "8b880e77a726e76e5dd585cda2c4c2ac93f1cfccc06910f00550fb820ae1fc54",
          "outputIndex": 0
        },
        pool: {
          "txHash": "8b880e77a726e76e5dd585cda2c4c2ac93f1cfccc06910f00550fb820ae1fc54",
          "outputIndex": 1
        },
        lp: {
          "txHash": "8b880e77a726e76e5dd585cda2c4c2ac93f1cfccc06910f00550fb820ae1fc54",
          "outputIndex": 2
        },
        poolBatching: {
          "txHash": "8b880e77a726e76e5dd585cda2c4c2ac93f1cfccc06910f00550fb820ae1fc54",
          "outputIndex": 3
        }
      },
      "96402c6f5e7a04f16b4d6f500ab039ff5eac5d0226d4f88bf5523ce85553444d2d695553442d534c50": {
        order: {
          "txHash": "48019a931af442e1eedab6c5b52b3069cf6eadb2483a2131f517e62fddfd5662",
          "outputIndex": 0
        },
        pool: {
          "txHash": "48019a931af442e1eedab6c5b52b3069cf6eadb2483a2131f517e62fddfd5662",
          "outputIndex": 1
        },
        lp: {
          "txHash": "48019a931af442e1eedab6c5b52b3069cf6eadb2483a2131f517e62fddfd5662",
          "outputIndex": 2
        },
        poolBatching: {
          "txHash": "48019a931af442e1eedab6c5b52b3069cf6eadb2483a2131f517e62fddfd5662",
          "outputIndex": 3
        }
      },
      "07b0869ed7488657e24ac9b27b3f0fb4f76757f444197b2a38a15c3c444a45442d5553444d2d534c50": {
        order: {
          "txHash": "dddccee9cd58cbf712f2ff2c49ea20537db681a333c701106aa13cd57aee3873",
          "outputIndex": 0
        },
        pool: {
          "txHash": "dddccee9cd58cbf712f2ff2c49ea20537db681a333c701106aa13cd57aee3873",
          "outputIndex": 1
        },
        lp: {
          "txHash": "dddccee9cd58cbf712f2ff2c49ea20537db681a333c701106aa13cd57aee3873",
          "outputIndex": 2
        },
        poolBatching: {
          "txHash": "dddccee9cd58cbf712f2ff2c49ea20537db681a333c701106aa13cd57aee3873",
          "outputIndex": 3
        }
      }
    }
  };
})(StableswapConstant || (exports.StableswapConstant = StableswapConstant = {}));
var DexV2Constant;
(DexV2Constant2 => {
  DexV2Constant2.CONFIG = {
    [NetworkId.TESTNET]: {
      factoryAsset: "d6aae2059baee188f74917493cf7637e679cd219bdfbbf4dcbeb1d0b4d5346",
      poolAuthenAsset: "d6aae2059baee188f74917493cf7637e679cd219bdfbbf4dcbeb1d0b4d5350",
      globalSettingAsset: "d6aae2059baee188f74917493cf7637e679cd219bdfbbf4dcbeb1d0b4d534753",
      lpPolicyId: "d6aae2059baee188f74917493cf7637e679cd219bdfbbf4dcbeb1d0b",
      globalSettingScriptHash: "d6aae2059baee188f74917493cf7637e679cd219bdfbbf4dcbeb1d0b",
      orderScriptHash: "da9525463841173ad1230b1d5a1b5d0a3116bbdeb4412327148a1b7a",
      poolScriptHash: "d6ba9b7509eac866288ff5072d2a18205ac56f744bc82dcd808cb8fe",
      poolScriptHashBech32: "script166afkagfatyxv2y075rj62scypdv2mm5f0yzmnvq3ju0uqqmszv",
      poolCreationAddress: "addr_test1zrtt4xm4p84vse3g3l6swtf2rqs943t0w39ustwdszxt3l5rajt8r8wqtygrfduwgukk73m5gcnplmztc5tl5ngy0upqhns793",
      factoryScriptHash: "6e23fe172b5b50e2ad59aded9ee8d488f74c7f4686f91b032220adad",
      expiredOrderCancelAddress: "stake_test17rytpnrpxax5p8leepgjx9cq8ecedgly6jz4xwvvv4kvzfqz6sgpf",
      poolBatchingAddress: "stake_test17rann6nth9675m0y5tz32u3rfhzcfjymanxqnfyexsufu5glcajhf"
    },
    [NetworkId.MAINNET]: {
      factoryAsset: "f5808c2c990d86da54bfc97d89cee6efa20cd8461616359478d96b4c4d5346",
      poolAuthenAsset: "f5808c2c990d86da54bfc97d89cee6efa20cd8461616359478d96b4c4d5350",
      globalSettingAsset: "f5808c2c990d86da54bfc97d89cee6efa20cd8461616359478d96b4c4d534753",
      lpPolicyId: "f5808c2c990d86da54bfc97d89cee6efa20cd8461616359478d96b4c",
      globalSettingScriptHash: "f5808c2c990d86da54bfc97d89cee6efa20cd8461616359478d96b4c",
      orderScriptHash: "c3e28c36c3447315ba5a56f33da6a6ddc1770a876a8d9f0cb3a97c4c",
      poolScriptHash: "ea07b733d932129c378af627436e7cbc2ef0bf96e0036bb51b3bde6b",
      poolScriptHashBech32: "script1agrmwv7exgffcdu27cn5xmnuhsh0p0ukuqpkhdgm800xksw7e2w",
      poolCreationAddress: "addr1z84q0denmyep98ph3tmzwsmw0j7zau9ljmsqx6a4rvaau66j2c79gy9l76sdg0xwhd7r0c0kna0tycz4y5s6mlenh8pq777e2a",
      factoryScriptHash: "7bc5fbd41a95f561be84369631e0e35895efb0b73e0a7480bb9ed730",
      expiredOrderCancelAddress: "stake178ytpnrpxax5p8leepgjx9cq8ecedgly6jz4xwvvv4kvzfq9s6295",
      poolBatchingAddress: "stake17y02a946720zw6pw50upt2arvxsvvpvaghjtl054h0f0gjsfyjz59"
    }
  };
  DexV2Constant2.DEPLOYED_SCRIPTS = {
    [NetworkId.TESTNET]: {
      order: {
        txHash: "8c98f0530cba144d264fbd2731488af25257d7ce6a0cd1586fc7209363724f03",
        outputIndex: 0
      },
      pool: {
        txHash: "9f30b1c3948a009ceebda32d0b1d25699674b2eaf8b91ef029a43bfc1073ce28",
        outputIndex: 0
      },
      factory: {
        txHash: "9741d59656e9ad54f197b0763482eede9a6fa1616c4547797eee6617f92a1396",
        outputIndex: 0
      },
      authen: {
        txHash: "c429b8ee27e5761ba8714e26e3a5899886cd28d136d43e969d4bc1acf0f72d4a",
        outputIndex: 0
      },
      poolBatching: {
        txHash: "b0a6c5512735c7a183a167eed035ac75c191d6ff5be9736dfa1f1f02f7ae5dbc",
        outputIndex: 0
      },
      expiredOrderCancellation: {
        txHash: "ee718dd86e3cb89e802aa8b2be252fccf6f15263f4a26b5f478c5135c40264c6",
        outputIndex: 0
      }
    },
    [NetworkId.MAINNET]: {
      order: {
        txHash: "cf4ecddde0d81f9ce8fcc881a85eb1f8ccdaf6807f03fea4cd02da896a621776",
        outputIndex: 0
      },
      pool: {
        txHash: "2536194d2a976370a932174c10975493ab58fd7c16395d50e62b7c0e1949baea",
        outputIndex: 0
      },
      factory: {
        txHash: "59c7fa5c30cbab4e6d38f65e15d1adef71495321365588506ad089d237b602e0",
        outputIndex: 0
      },
      authen: {
        txHash: "dbc1498500a6e79baa0f34d10de55cdb4289ca6c722bd70e1e1b78a858f136b9",
        outputIndex: 0
      },
      poolBatching: {
        txHash: "d46bd227bd2cf93dedd22ae9b6d92d30140cf0d68b756f6608e38d680c61ad17",
        outputIndex: 0
      },
      expiredOrderCancellation: {
        txHash: "ef3acc7dfc5a98bffe8f4d4400e65a9ade5a1316b2fcb7145c3b83dba38a66f5",
        outputIndex: 0
      }
    }
  };
})(DexV2Constant || (exports.DexV2Constant = DexV2Constant = {}));
const BATCHER_FEE_REDUCTION_SUPPORTED_ASSET = exports.BATCHER_FEE_REDUCTION_SUPPORTED_ASSET = {
  [NetworkId.MAINNET]: ["29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c64d494e", "e4214b7cce62ac6fbba385d164df48e157eae5863521b4b67ca71d866aa2153e1ae896a95539c9d62f76cedcdabdcdf144e564b8955f609d660cf6a2"],
  [NetworkId.TESTNET]: ["e16c2dc8ae937e8d3790c7fd7168d7b994621ba14ca11415f39fed724d494e", "e4214b7cce62ac6fbba385d164df48e157eae5863521b4b67ca71d863bb0079303c57812462dec9de8fb867cef8fd3768de7f12c77f6f0dd80381d0d"]
};
var MetadataMessage = exports.MetadataMessage = /* @__PURE__ */(MetadataMessage2 => {
  MetadataMessage2["DEPOSIT_ORDER"] = "SDK Minswap: Deposit Order";
  MetadataMessage2["CANCEL_ORDER"] = "SDK Minswap: Cancel Order";
  MetadataMessage2["ZAP_IN_ORDER"] = "SDK Minswap: Zap Order";
  MetadataMessage2["SWAP_EXACT_IN_ORDER"] = "SDK Minswap: Swap Exact In Order";
  MetadataMessage2["SWAP_EXACT_IN_LIMIT_ORDER"] = "SDK Minswap: Swap Exact In Limit Order";
  MetadataMessage2["SWAP_EXACT_OUT_ORDER"] = "SDK Minswap: Swap Exact Out Order";
  MetadataMessage2["WITHDRAW_ORDER"] = "SDK Minswap: Withdraw Order";
  return MetadataMessage2;
})(MetadataMessage || {});
const FIXED_DEPOSIT_ADA = exports.FIXED_DEPOSIT_ADA = 2000000n;
function sha3(hex) {
  const hash = new _sha.SHA3(256);
  hash.update(hex, "hex");
  return hash.digest("hex");
}
var LucidCredential;
(LucidCredential2 => {
  function toPlutusData(data) {
    const constructor = data.type === "Key" ? 0 : 1;
    return new _lucidCardano.Constr(constructor, [data.hash]);
  }
  LucidCredential2.toPlutusData = toPlutusData;
  function fromPlutusData(data) {
    switch (data.index) {
      case 0:
        {
          return {
            type: "Key",
            hash: data.fields[0]
          };
        }
      case 1:
        {
          return {
            type: "Script",
            hash: data.fields[0]
          };
        }
      default:
        {
          throw new Error("Index of Credentail must be 0 or 1, actual: ".concat(data.index));
        }
    }
  }
  LucidCredential2.fromPlutusData = fromPlutusData;
  function toCSLStakeCredential(credential) {
    switch (credential.type) {
      case "Key":
        {
          return _lucidCardano.C.StakeCredential.from_keyhash(_lucidCardano.C.Ed25519KeyHash.from_hex(credential.hash));
        }
      case "Script":
        {
          return _lucidCardano.C.StakeCredential.from_scripthash(_lucidCardano.C.ScriptHash.from_hex(credential.hash));
        }
    }
  }
  LucidCredential2.toCSLStakeCredential = toCSLStakeCredential;
})(LucidCredential || (LucidCredential = {}));
var AddressPlutusData;
(AddressPlutusData2 => {
  function toPlutusData(address) {
    const addressDetails = (0, _lucidCardano.getAddressDetails)(address);
    if (addressDetails.type === "Base") {
      (0, _tinyInvariant.default)(addressDetails.paymentCredential && addressDetails.stakeCredential, "baseAddress must have both paymentCredential and stakeCredential");
      return new _lucidCardano.Constr(0, [LucidCredential.toPlutusData(addressDetails.paymentCredential), new _lucidCardano.Constr(0, [new _lucidCardano.Constr(0, [LucidCredential.toPlutusData(addressDetails.stakeCredential)])])]);
    }
    if (addressDetails.type === "Enterprise") {
      (0, _tinyInvariant.default)(addressDetails.paymentCredential, "EnterpriseAddress must has paymentCredential");
      return new _lucidCardano.Constr(0, [LucidCredential.toPlutusData(addressDetails.paymentCredential), new _lucidCardano.Constr(1, [])]);
    }
    throw new Error("only supports base address, enterprise address");
  }
  AddressPlutusData2.toPlutusData = toPlutusData;
  function fromPlutusData(networkId, data) {
    switch (data.index) {
      case 0:
        {
          const paymentCredential = LucidCredential.fromPlutusData(data.fields[0]);
          const cslPaymentCredential = LucidCredential.toCSLStakeCredential(paymentCredential);
          const maybeStakeCredentialConstr = data.fields[1];
          switch (maybeStakeCredentialConstr.index) {
            case 0:
              {
                const stakeCredentialConstr = maybeStakeCredentialConstr.fields[0];
                switch (stakeCredentialConstr.index) {
                  case 0:
                    {
                      const stakeCredential = LucidCredential.fromPlutusData(stakeCredentialConstr.fields[0]);
                      const cslStakeCredential = LucidCredential.toCSLStakeCredential(stakeCredential);
                      const cslAddress = _lucidCardano.C.BaseAddress.new(networkId, cslPaymentCredential, cslStakeCredential).to_address();
                      return cslAddress.to_bech32(void 0);
                    }
                  case 1:
                    {
                      throw new Error("Pointer Address has not been supported yet");
                    }
                  default:
                    {
                      throw new Error("Index of StakeCredentail must be 0 or 1, actual: ".concat(stakeCredentialConstr.index));
                    }
                }
              }
            case 1:
              {
                const cslAddress = _lucidCardano.C.EnterpriseAddress.new(networkId, cslPaymentCredential).to_address();
                return cslAddress.to_bech32(void 0);
              }
            default:
              {
                throw new Error("Index of Maybe Stake Credentail must be 0 or 1, actual: ".concat(maybeStakeCredentialConstr.index));
              }
          }
        }
      default:
        {
          throw new Error("Index of Address must be 0, actual: ".concat(data.index));
        }
    }
  }
  AddressPlutusData2.fromPlutusData = fromPlutusData;
})(AddressPlutusData || (AddressPlutusData = {}));
function getScriptHashFromAddress(addr) {
  var _specificAddr$payment, _specificAddr$payment2;
  const cslAddr = _lucidCardano.C.Address.from_bech32(addr);
  const specificAddr = _lucidCardano.C.BaseAddress.from_address(cslAddr) || _lucidCardano.C.EnterpriseAddress.from_address(cslAddr) || _lucidCardano.C.PointerAddress.from_address(cslAddr) || _lucidCardano.C.RewardAddress.from_address(cslAddr);
  if (!specificAddr) {
    return null;
  }
  return (_specificAddr$payment = (_specificAddr$payment2 = specificAddr.payment_cred().to_scripthash()) === null || _specificAddr$payment2 === void 0 ? void 0 : _specificAddr$payment2.to_bech32("script")) !== null && _specificAddr$payment !== void 0 ? _specificAddr$payment : null;
}
function normalizeAssets(a, b) {
  if (a === "lovelace") {
    return [a, b];
  }
  if (b === "lovelace") {
    return [b, a];
  }
  if (a < b) {
    return [a, b];
  } else {
    return [b, a];
  }
}
var PoolFeeSharing;
(PoolFeeSharing2 => {
  function toPlutusData(feeSharing) {
    const {
      feeTo,
      feeToDatumHash
    } = feeSharing;
    return new _lucidCardano.Constr(0, [AddressPlutusData.toPlutusData(feeTo), feeToDatumHash ? new _lucidCardano.Constr(0, [feeToDatumHash]) : new _lucidCardano.Constr(1, [])]);
  }
  PoolFeeSharing2.toPlutusData = toPlutusData;
  function fromPlutusData(networkId, data) {
    if (data.index !== 0) {
      throw new Error("Index of Pool Profit Sharing must be 0, actual: ".concat(data.index));
    }
    let feeToDatumHash = void 0;
    const maybeFeeToDatumHash = data.fields[1];
    switch (maybeFeeToDatumHash.index) {
      case 0:
        {
          feeToDatumHash = maybeFeeToDatumHash.fields[0];
          break;
        }
      case 1:
        {
          feeToDatumHash = void 0;
          break;
        }
      default:
        {
          throw new Error("Index of Fee To DatumHash must be 0 or 1, actual: ".concat(maybeFeeToDatumHash.index));
        }
    }
    return {
      feeTo: AddressPlutusData.fromPlutusData(networkId, data.fields[0]),
      feeToDatumHash
    };
  }
  PoolFeeSharing2.fromPlutusData = fromPlutusData;
})(PoolFeeSharing || (PoolFeeSharing = {}));
function checkValidPoolOutput(poolAddress, value, datumHash) {
  var _value$find;
  (0, _tinyInvariant.default)(getScriptHashFromAddress(poolAddress) === DexV1Constant.POOL_SCRIPT_HASH, "invalid pool address: ".concat(poolAddress));
  if (((_value$find = value.find(_ref => {
    let {
      unit
    } = _ref;
    return unit === "".concat(DexV1Constant.FACTORY_POLICY_ID).concat(DexV1Constant.FACTORY_ASSET_NAME);
  })) === null || _value$find === void 0 ? void 0 : _value$find.quantity) !== "1") {
    throw new Error("expect pool to have 1 factory token");
  }
  (0, _tinyInvariant.default)(datumHash, "expect pool to have datum hash, got ".concat(datumHash));
}
function isValidPoolOutput(poolAddress, value, datumHash) {
  try {
    checkValidPoolOutput(poolAddress, value, datumHash);
    return true;
  } catch (err) {
    return false;
  }
}
const DEFAULT_POOL_V2_TRADING_FEE_DENOMINATOR = exports.DEFAULT_POOL_V2_TRADING_FEE_DENOMINATOR = 10000n;
var PoolV1;
(PoolV12 => {
  class State {
    constructor(address, txIn, value, datumHash) {
      _defineProperty(this, "address", void 0);
      _defineProperty(this, "txIn", void 0);
      _defineProperty(this, "value", void 0);
      _defineProperty(this, "datumHash", void 0);
      _defineProperty(this, "assetA", void 0);
      _defineProperty(this, "assetB", void 0);
      this.address = address;
      this.txIn = txIn;
      this.value = value;
      this.datumHash = datumHash;
      const nft = value.find(_ref2 => {
        let {
          unit
        } = _ref2;
        return unit.startsWith(DexV1Constant.POOL_NFT_POLICY_ID);
      });
      (0, _tinyInvariant.default)(nft, "pool doesn't have NFT");
      const poolId = nft.unit.slice(56);
      const relevantAssets = value.filter(_ref3 => {
        let {
          unit
        } = _ref3;
        return !unit.startsWith(DexV1Constant.FACTORY_POLICY_ID) && !unit.endsWith(poolId);
      });
      switch (relevantAssets.length) {
        case 2:
          {
            this.assetA = "lovelace";
            const nonADAAssets = relevantAssets.filter(_ref4 => {
              let {
                unit
              } = _ref4;
              return unit !== "lovelace";
            });
            (0, _tinyInvariant.default)(nonADAAssets.length === 1, "pool must have 1 non-ADA asset");
            this.assetB = nonADAAssets[0].unit;
            break;
          }
        case 3:
          {
            const nonADAAssets = relevantAssets.filter(_ref5 => {
              let {
                unit
              } = _ref5;
              return unit !== "lovelace";
            });
            (0, _tinyInvariant.default)(nonADAAssets.length === 2, "pool must have 1 non-ADA asset");
            [this.assetA, this.assetB] = normalizeAssets(nonADAAssets[0].unit, nonADAAssets[1].unit);
            break;
          }
        default:
          throw new Error("pool must have 2 or 3 assets except factory, NFT and LP tokens");
      }
    }
    get nft() {
      const nft = this.value.find(_ref6 => {
        let {
          unit
        } = _ref6;
        return unit.startsWith(DexV1Constant.POOL_NFT_POLICY_ID);
      });
      (0, _tinyInvariant.default)(nft, "pool doesn't have NFT");
      return nft.unit;
    }
    get id() {
      return this.nft.slice(DexV1Constant.POOL_NFT_POLICY_ID.length);
    }
    get assetLP() {
      return "".concat(DexV1Constant.LP_POLICY_ID).concat(this.id);
    }
    get reserveA() {
      var _this$value$find$quan, _this$value$find;
      return BigInt((_this$value$find$quan = (_this$value$find = this.value.find(_ref7 => {
        let {
          unit
        } = _ref7;
        return unit === this.assetA;
      })) === null || _this$value$find === void 0 ? void 0 : _this$value$find.quantity) !== null && _this$value$find$quan !== void 0 ? _this$value$find$quan : "0");
    }
    get reserveB() {
      var _this$value$find$quan2, _this$value$find2;
      return BigInt((_this$value$find$quan2 = (_this$value$find2 = this.value.find(_ref8 => {
        let {
          unit
        } = _ref8;
        return unit === this.assetB;
      })) === null || _this$value$find2 === void 0 ? void 0 : _this$value$find2.quantity) !== null && _this$value$find$quan2 !== void 0 ? _this$value$find$quan2 : "0");
    }
  }
  PoolV12.State = State;
  (Datum2 => {
    function toPlutusData(datum) {
      const {
        assetA,
        assetB,
        totalLiquidity,
        rootKLast,
        feeSharing
      } = datum;
      return new _lucidCardano.Constr(0, [Asset.toPlutusData(assetA), Asset.toPlutusData(assetB), totalLiquidity, rootKLast, feeSharing ? new _lucidCardano.Constr(0, [PoolFeeSharing.toPlutusData(feeSharing)]) : new _lucidCardano.Constr(1, [])]);
    }
    Datum2.toPlutusData = toPlutusData;
    function fromPlutusData(networkId, data) {
      if (data.index !== 0) {
        throw new Error("Index of Pool Datum must be 0, actual: ".concat(data.index));
      }
      let feeSharing = void 0;
      const maybeFeeSharingConstr = data.fields[4];
      switch (maybeFeeSharingConstr.index) {
        case 0:
          {
            feeSharing = PoolFeeSharing.fromPlutusData(networkId, maybeFeeSharingConstr.fields[0]);
            break;
          }
        case 1:
          {
            feeSharing = void 0;
            break;
          }
        default:
          {
            throw new Error("Index of Pool Fee Sharing must be 0 or 1, actual: ".concat(maybeFeeSharingConstr.index));
          }
      }
      return {
        assetA: Asset.fromPlutusData(data.fields[0]),
        assetB: Asset.fromPlutusData(data.fields[1]),
        totalLiquidity: data.fields[2],
        rootKLast: data.fields[3],
        feeSharing
      };
    }
    Datum2.fromPlutusData = fromPlutusData;
  })(PoolV12.Datum || (PoolV12.Datum = {}));
})(PoolV1 || (exports.PoolV1 = PoolV1 = {}));
var StablePool;
(StablePool2 => {
  class State {
    constructor(networkId, address, txIn, value, datum) {
      _defineProperty(this, "address", void 0);
      _defineProperty(this, "txIn", void 0);
      _defineProperty(this, "value", void 0);
      _defineProperty(this, "datumCbor", void 0);
      _defineProperty(this, "datum", void 0);
      _defineProperty(this, "config", void 0);
      this.address = address;
      this.txIn = txIn;
      this.value = value;
      this.datumCbor = datum;
      this.datum = Datum.fromPlutusData(_lucidCardano.Data.from(datum));
      const allConfigs = StableswapConstant.CONFIG[networkId];
      const config = allConfigs.find(cfg => cfg.poolAddress === address);
      if (!config) {
        throw new Error("Invalid Stable Pool address");
      }
      this.config = config;
      if (!value.find(v => v.unit === config.nftAsset && v.quantity === "1")) {
        throw new Error("Cannot find the Pool NFT in the value");
      }
    }
    get assets() {
      return this.config.assets;
    }
    get nft() {
      return this.config.nftAsset;
    }
    get lpAsset() {
      return this.config.lpAsset;
    }
    get reserves() {
      return this.datum.balances;
    }
    get totalLiquidity() {
      return this.datum.totalLiquidity;
    }
    get orderHash() {
      return this.datum.orderHash;
    }
    get amp() {
      return this.datum.amplificationCoefficient;
    }
    get id() {
      return this.nft;
    }
  }
  StablePool2.State = State;
  let Datum;
  (Datum2 => {
    function toPlutusData(datum) {
      const {
        balances,
        totalLiquidity,
        amplificationCoefficient,
        orderHash
      } = datum;
      return new _lucidCardano.Constr(0, [balances, totalLiquidity, amplificationCoefficient, orderHash]);
    }
    Datum2.toPlutusData = toPlutusData;
    function fromPlutusData(data) {
      if (data.index !== 0) {
        throw new Error("Index of Pool Datum must be 0, actual: ".concat(data.index));
      }
      return {
        balances: data.fields[0],
        totalLiquidity: data.fields[1],
        amplificationCoefficient: data.fields[2],
        orderHash: data.fields[3]
      };
    }
    Datum2.fromPlutusData = fromPlutusData;
  })(Datum = StablePool2.Datum || (StablePool2.Datum = {}));
})(StablePool || (exports.StablePool = StablePool = {}));
var PoolV2;
(PoolV22 => {
  function computeLPAssetName(assetA, assetB) {
    const k1 = sha3(assetA.policyId + assetA.tokenName);
    const k2 = sha3(assetB.policyId + assetB.tokenName);
    return sha3(k1 + k2);
  }
  PoolV22.computeLPAssetName = computeLPAssetName;
  class State {
    constructor(networkId, address, txIn, value, datum) {
      _defineProperty(this, "address", void 0);
      _defineProperty(this, "txIn", void 0);
      _defineProperty(this, "value", void 0);
      _defineProperty(this, "datumRaw", void 0);
      _defineProperty(this, "datum", void 0);
      _defineProperty(this, "config", void 0);
      _defineProperty(this, "lpAsset", void 0);
      _defineProperty(this, "authenAsset", void 0);
      this.address = address;
      this.txIn = txIn;
      this.value = value;
      this.datumRaw = datum;
      this.datum = Datum.fromPlutusData(_lucidCardano.Data.from(datum));
      this.config = DexV2Constant.CONFIG[networkId];
      this.lpAsset = {
        policyId: this.config.lpPolicyId,
        tokenName: computeLPAssetName(this.datum.assetA, this.datum.assetB)
      };
      this.authenAsset = Asset.fromString(this.config.poolAuthenAsset);
      if (!value.find(v => v.unit === this.config.poolAuthenAsset && v.quantity === "1")) {
        throw new Error("Cannot find the Pool Authentication Asset in the value");
      }
    }
    get assetA() {
      return Asset.toString(this.datum.assetA);
    }
    get assetB() {
      return Asset.toString(this.datum.assetB);
    }
    get totalLiquidity() {
      return this.datum.totalLiquidity;
    }
    get reserveA() {
      return this.datum.reserveA;
    }
    get reserveB() {
      return this.datum.reserveB;
    }
    get feeA() {
      return [this.datum.baseFee.feeANumerator, DEFAULT_POOL_V2_TRADING_FEE_DENOMINATOR];
    }
    get feeB() {
      return [this.datum.baseFee.feeBNumerator, DEFAULT_POOL_V2_TRADING_FEE_DENOMINATOR];
    }
    get feeShare() {
      if (this.datum.feeSharingNumerator !== void 0) {
        return [this.datum.feeSharingNumerator, DEFAULT_POOL_V2_TRADING_FEE_DENOMINATOR];
      } else {
        return void 0;
      }
    }
  }
  PoolV22.State = State;
  let Datum;
  (Datum2 => {
    function toPlutusData(datum) {
      const {
        poolBatchingStakeCredential,
        assetA,
        assetB,
        totalLiquidity,
        reserveA,
        reserveB,
        baseFee,
        feeSharingNumerator,
        allowDynamicFee
      } = datum;
      return new _lucidCardano.Constr(0, [LucidCredential.toPlutusData(poolBatchingStakeCredential), Asset.toPlutusData(assetA), Asset.toPlutusData(assetB), totalLiquidity, reserveA, reserveB, baseFee.feeANumerator, baseFee.feeBNumerator, feeSharingNumerator !== void 0 ? new _lucidCardano.Constr(0, [feeSharingNumerator]) : new _lucidCardano.Constr(1, []), new _lucidCardano.Constr(allowDynamicFee ? 1 : 0, [])]);
    }
    Datum2.toPlutusData = toPlutusData;
    function fromPlutusData(data) {
      if (data.index !== 0) {
        throw new Error("Index of Pool Datum must be 0, actual: ".concat(data.index));
      }
      let feeSharingNumerator = void 0;
      const maybeFeeSharingConstr = data.fields[8];
      switch (maybeFeeSharingConstr.index) {
        case 0:
          {
            feeSharingNumerator = maybeFeeSharingConstr.fields[0];
            break;
          }
        case 1:
          {
            feeSharingNumerator = void 0;
            break;
          }
        default:
          {
            throw new Error("Index of Pool Fee Sharing must be 0 or 1, actual: ".concat(maybeFeeSharingConstr.index));
          }
      }
      const allowDynamicFeeConstr = data.fields[9];
      const allowDynamicFee = allowDynamicFeeConstr.index === 1;
      return {
        poolBatchingStakeCredential: LucidCredential.fromPlutusData(data.fields[0]),
        assetA: Asset.fromPlutusData(data.fields[1]),
        assetB: Asset.fromPlutusData(data.fields[2]),
        totalLiquidity: data.fields[3],
        reserveA: data.fields[4],
        reserveB: data.fields[5],
        baseFee: {
          feeANumerator: data.fields[6],
          feeBNumerator: data.fields[7]
        },
        feeSharingNumerator,
        allowDynamicFee
      };
    }
    Datum2.fromPlutusData = fromPlutusData;
  })(Datum = PoolV22.Datum || (PoolV22.Datum = {}));
})(PoolV2 || (exports.PoolV2 = PoolV2 = {}));
class BlockfrostAdapter {
  constructor(_ref9) {
    let {
      networkId,
      blockFrost
    } = _ref9;
    _defineProperty(this, "api", void 0);
    _defineProperty(this, "networkId", void 0);
    this.networkId = networkId;
    this.api = blockFrost;
  }
  async getV1Pools(_ref10) {
    let {
      page,
      count = 100,
      order = "asc"
    } = _ref10;
    const utxos = await this.api.addressesUtxos(DexV1Constant.POOL_SCRIPT_HASH, {
      count,
      order,
      page
    });
    return utxos.filter(utxo => isValidPoolOutput(utxo.address, utxo.amount, utxo.data_hash)).map(utxo => {
      (0, _tinyInvariant.default)(utxo.data_hash, "expect pool to have datum hash, got ".concat(utxo.data_hash));
      return new PoolV1.State(utxo.address, {
        txHash: utxo.tx_hash,
        index: utxo.output_index
      }, utxo.amount, utxo.data_hash);
    });
  }
  async getV1PoolById(_ref11) {
    let {
      id
    } = _ref11;
    const nft = "".concat(DexV1Constant.POOL_NFT_POLICY_ID).concat(id);
    const nftTxs = await this.api.assetsTransactions(nft, {
      count: 1,
      page: 1,
      order: "desc"
    });
    if (nftTxs.length === 0) {
      return null;
    }
    return this.getV1PoolInTx({
      txHash: nftTxs[0].tx_hash
    });
  }
  async getV1PoolHistory(_ref12) {
    let {
      id,
      page = 1,
      count = 100,
      order = "desc"
    } = _ref12;
    const nft = "".concat(DexV1Constant.POOL_NFT_POLICY_ID).concat(id);
    const nftTxs = await this.api.assetsTransactions(nft, {
      count,
      page,
      order
    });
    return nftTxs.map(tx => ({
      txHash: tx.tx_hash,
      txIndex: tx.tx_index,
      blockHeight: tx.block_height,
      time: new Date(Number(tx.block_time) * 1e3)
    }));
  }
  async getV1PoolInTx(_ref13) {
    let {
      txHash
    } = _ref13;
    const poolTx = await this.api.txsUtxos(txHash);
    const poolUtxo = poolTx.outputs.find(o => getScriptHashFromAddress(o.address) === DexV1Constant.POOL_SCRIPT_HASH);
    if (!poolUtxo) {
      return null;
    }
    checkValidPoolOutput(poolUtxo.address, poolUtxo.amount, poolUtxo.data_hash);
    (0, _tinyInvariant.default)(poolUtxo.data_hash, "expect pool to have datum hash, got ".concat(poolUtxo.data_hash));
    return new PoolV1.State(poolUtxo.address, {
      txHash,
      index: poolUtxo.output_index
    }, poolUtxo.amount, poolUtxo.data_hash);
  }
  async getAssetDecimals(asset) {
    if (asset === "lovelace") {
      return 6;
    }
    try {
      var _assetAInfo$metadata$, _assetAInfo$metadata;
      const assetAInfo = await this.api.assetsById(asset);
      return (_assetAInfo$metadata$ = (_assetAInfo$metadata = assetAInfo.metadata) === null || _assetAInfo$metadata === void 0 ? void 0 : _assetAInfo$metadata.decimals) !== null && _assetAInfo$metadata$ !== void 0 ? _assetAInfo$metadata$ : 0;
    } catch (err) {
      if (err instanceof _blockfrostJs.BlockfrostServerError && err.status_code === 404) {
        return 0;
      }
      throw err;
    }
  }
  async getV1PoolPrice(_ref14) {
    let {
      pool,
      decimalsA,
      decimalsB
    } = _ref14;
    if (decimalsA === void 0) {
      decimalsA = await this.getAssetDecimals(pool.assetA);
    }
    if (decimalsB === void 0) {
      decimalsB = await this.getAssetDecimals(pool.assetB);
    }
    const adjustedReserveA = (0, _big.default)(pool.reserveA.toString()).div((0, _big.default)(10).pow(decimalsA));
    const adjustedReserveB = (0, _big.default)(pool.reserveB.toString()).div((0, _big.default)(10).pow(decimalsB));
    const priceAB = adjustedReserveA.div(adjustedReserveB);
    const priceBA = adjustedReserveB.div(adjustedReserveA);
    return [priceAB, priceBA];
  }
  async getDatumByDatumHash(datumHash) {
    const scriptsDatum = await this.api.scriptsDatumCbor(datumHash);
    return scriptsDatum.cbor;
  }
  async getAllV2Pools() {
    const v2Config = DexV2Constant.CONFIG[this.networkId];
    const utxos = await this.api.addressesUtxosAssetAll(v2Config.poolScriptHashBech32, v2Config.poolAuthenAsset);
    const pools = [];
    const errors = [];
    for (const utxo of utxos) {
      try {
        if (!utxo.inline_datum) {
          throw new Error("Cannot find datum of Pool V2, tx: ".concat(utxo.tx_hash));
        }
        const pool = new PoolV2.State(this.networkId, utxo.address, {
          txHash: utxo.tx_hash,
          index: utxo.output_index
        }, utxo.amount, utxo.inline_datum);
        pools.push(pool);
      } catch (err) {
        errors.push(err);
      }
    }
    return {
      pools,
      errors
    };
  }
  async getV2Pools(_ref15) {
    let {
      page,
      count = 100,
      order = "asc"
    } = _ref15;
    const v2Config = DexV2Constant.CONFIG[this.networkId];
    const utxos = await this.api.addressesUtxosAsset(v2Config.poolScriptHashBech32, v2Config.poolAuthenAsset, {
      count,
      order,
      page
    });
    const pools = [];
    const errors = [];
    for (const utxo of utxos) {
      try {
        if (!utxo.inline_datum) {
          throw new Error("Cannot find datum of Pool V2, tx: ".concat(utxo.tx_hash));
        }
        const pool = new PoolV2.State(this.networkId, utxo.address, {
          txHash: utxo.tx_hash,
          index: utxo.output_index
        }, utxo.amount, utxo.inline_datum);
        pools.push(pool);
      } catch (err) {
        errors.push(err);
      }
    }
    return {
      pools,
      errors
    };
  }
  async getV2PoolByPair(assetA, assetB) {
    var _allPools$find;
    const [normalizedAssetA, normalizedAssetB] = normalizeAssets(Asset.toString(assetA), Asset.toString(assetB));
    const {
      pools: allPools
    } = await this.getAllV2Pools();
    return (_allPools$find = allPools.find(pool => pool.assetA === normalizedAssetA && pool.assetB === normalizedAssetB)) !== null && _allPools$find !== void 0 ? _allPools$find : null;
  }
  async getAllStablePools() {
    const poolAddresses = StableswapConstant.CONFIG[this.networkId].map(cfg => cfg.poolAddress);
    const pools = [];
    const errors = [];
    for (const poolAddr of poolAddresses) {
      const utxos = await this.api.addressesUtxosAll(poolAddr);
      try {
        for (const utxo of utxos) {
          let datum;
          if (utxo.inline_datum) {
            datum = utxo.inline_datum;
          } else if (utxo.data_hash) {
            datum = await this.getDatumByDatumHash(utxo.data_hash);
          } else {
            throw new Error("Cannot find datum of Stable Pool");
          }
          const pool = new StablePool.State(this.networkId, utxo.address, {
            txHash: utxo.tx_hash,
            index: utxo.output_index
          }, utxo.amount, datum);
          pools.push(pool);
        }
      } catch (err) {
        errors.push(err);
      }
    }
    return {
      pools,
      errors
    };
  }
  async getStablePoolByNFT(nft) {
    var _StableswapConstant$C;
    const poolAddress = (_StableswapConstant$C = StableswapConstant.CONFIG[this.networkId].find(cfg => cfg.nftAsset === Asset.toString(nft))) === null || _StableswapConstant$C === void 0 ? void 0 : _StableswapConstant$C.poolAddress;
    if (!poolAddress) {
      throw new Error("Cannot find Stable Pool having NFT ".concat(Asset.toString(nft)));
    }
    const utxos = await this.api.addressesUtxosAssetAll(poolAddress, Asset.toString(nft));
    for (const utxo of utxos) {
      let datum;
      if (utxo.inline_datum) {
        datum = utxo.inline_datum;
      } else if (utxo.data_hash) {
        datum = await this.getDatumByDatumHash(utxo.data_hash);
      } else {
        throw new Error("Cannot find datum of Stable Pool");
      }
      const pool = new StablePool.State(this.networkId, utxo.address, {
        txHash: utxo.tx_hash,
        index: utxo.output_index
      }, utxo.amount, datum);
      return pool;
    }
    return null;
  }
}
console.log('BlockfrostAdapter-----------',BlockfrostAdapter)
exports.BlockfrostAdapter = BlockfrostAdapter;
const MAX_SAFE_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);
function sqrt(value) {
  (0, _tinyInvariant.default)(value >= 0n, "NEGATIVE");
  if (value < MAX_SAFE_INTEGER) {
    return BigInt(Math.floor(Math.sqrt(Number(value))));
  }
  let z;
  let x;
  z = value;
  x = value / 2n + 1n;
  while (x < z) {
    z = x;
    x = (value / x + x) / 2n;
  }
  return z;
}
function calculateSwapExactIn(options) {
  const {
    amountIn,
    reserveIn,
    reserveOut
  } = options;
  const amtOutNumerator = amountIn * 997n * reserveOut;
  const amtOutDenominator = amountIn * 997n + reserveIn * 1000n;
  const priceImpactNumerator = reserveOut * amountIn * amtOutDenominator * 997n - amtOutNumerator * reserveIn * 1000n;
  const priceImpactDenominator = reserveOut * amountIn * amtOutDenominator * 1000n;
  return {
    amountOut: amtOutNumerator / amtOutDenominator,
    priceImpact: new _big.default(priceImpactNumerator.toString()).mul(new _big.default(100)).div(new _big.default(priceImpactDenominator.toString()))
  };
}
function calculateSwapExactOut(options) {
  const {
    exactAmountOut,
    reserveIn,
    reserveOut
  } = options;
  const amtInNumerator = reserveIn * exactAmountOut * 1000n;
  const amtInDenominator = (reserveOut - exactAmountOut) * 997n;
  const priceImpactNumerator = reserveOut * amtInNumerator * 997n - exactAmountOut * amtInDenominator * reserveIn * 1000n;
  const priceImpactDenominator = reserveOut * amtInNumerator * 1000n;
  return {
    amountIn: amtInNumerator / amtInDenominator + 1n,
    priceImpact: new _big.default(priceImpactNumerator.toString()).mul(new _big.default(100)).div(new _big.default(priceImpactDenominator.toString()))
  };
}
function calculateDeposit(options) {
  const {
    depositedAmountA,
    depositedAmountB,
    reserveA,
    reserveB,
    totalLiquidity
  } = options;
  const deltaLiquidityA = depositedAmountA * totalLiquidity / reserveA;
  const deltaLiquidityB = depositedAmountB * totalLiquidity / reserveB;
  let necessaryAmountA, necessaryAmountB, lpAmount;
  if (deltaLiquidityA > deltaLiquidityB) {
    necessaryAmountA = depositedAmountB * reserveA / reserveB;
    necessaryAmountB = depositedAmountB;
    lpAmount = deltaLiquidityB;
  } else if (deltaLiquidityA < deltaLiquidityB) {
    necessaryAmountA = depositedAmountA;
    necessaryAmountB = depositedAmountA * reserveB / reserveA;
    lpAmount = deltaLiquidityA;
  } else {
    necessaryAmountA = depositedAmountA;
    necessaryAmountB = depositedAmountB;
    lpAmount = deltaLiquidityA;
  }
  return {
    necessaryAmountA,
    necessaryAmountB,
    lpAmount
  };
}
function calculateWithdraw(options) {
  const {
    withdrawalLPAmount,
    reserveA,
    reserveB,
    totalLiquidity
  } = options;
  return {
    amountAReceive: withdrawalLPAmount * reserveA / totalLiquidity,
    amountBReceive: withdrawalLPAmount * reserveB / totalLiquidity
  };
}
function calculateZapIn(options) {
  const {
    amountIn,
    reserveIn,
    reserveOut,
    totalLiquidity
  } = options;
  const swapAmountIn = (sqrt(1997n ** 2n * reserveIn ** 2n + 4n * 997n * 1000n * amountIn * reserveIn) - 1997n * reserveIn) / (2n * 997n);
  const swapToAssetOutAmount = calculateSwapExactIn({
    amountIn: swapAmountIn,
    reserveIn,
    reserveOut
  }).amountOut;
  return swapToAssetOutAmount * totalLiquidity / (reserveOut - swapToAssetOutAmount);
}
const FIXED_BATCHER_FEE = 2000000n;
const BATCHER_FEE_CONFIG_MAINNET = [{
  maximumReduction: 25,
  startTime: new Date("2022-09-14T07:00:00.000Z"),
  endTime: void 0,
  maximumAmountMIN: 50000000000n,
  maximumAmountADAMINLP: 5000000000n
}];
const BATCHER_FEE_CONFIG_TESTNET_PREPROD = [{
  maximumReduction: 25,
  startTime: new Date("2022-09-01T00:00:00.000Z"),
  endTime: void 0,
  maximumAmountMIN: 10000000n,
  maximumAmountADAMINLP: 100000000n
}];
function getBatcherFeeConfigs(network) {
  switch (network) {
    case "Mainnet":
      return BATCHER_FEE_CONFIG_MAINNET;
    case "Preprod":
      return BATCHER_FEE_CONFIG_TESTNET_PREPROD;
    default:
      return null;
  }
}
function getBatcherFee(network, amountMIN, amountLP) {
  const currentTime = new Date().getTime();
  const batcherFeeConfigs = getBatcherFeeConfigs(network);
  if (!batcherFeeConfigs) {
    return FIXED_BATCHER_FEE;
  }
  const activeConfig = batcherFeeConfigs.find(c => {
    return c.startTime.getTime() <= currentTime && c.endTime ? currentTime <= c.endTime.getTime() : true;
  });
  if (!activeConfig) {
    return FIXED_BATCHER_FEE;
  }
  const redunctionOnHoldingMIN = new _bignumber.default(amountMIN.toString()).div(activeConfig.maximumAmountMIN.toString());
  const redunctionOnHoldingLP = new _bignumber.default(amountLP.toString()).div(activeConfig.maximumAmountADAMINLP.toString());
  const totalReductionAmountRatio = redunctionOnHoldingMIN.plus(redunctionOnHoldingLP);
  const maximumReductionAmountRatio = totalReductionAmountRatio.isGreaterThanOrEqualTo(new _bignumber.default(1)) ? new _bignumber.default(1) : totalReductionAmountRatio;
  const totalReduction = new _bignumber.default(activeConfig.maximumReduction).multipliedBy(maximumReductionAmountRatio).div(new _bignumber.default(100));
  const batcherFee = new _bignumber.default(1).minus(totalReduction).multipliedBy(new _bignumber.default(FIXED_BATCHER_FEE.toString())).toFixed(0);
  return BigInt(batcherFee);
}
var OrderV1;
(OrderV12 => {
  (StepType2 => {
    StepType2[StepType2["SWAP_EXACT_IN"] = 0] = "SWAP_EXACT_IN";
    StepType2[StepType2["SWAP_EXACT_OUT"] = 1] = "SWAP_EXACT_OUT";
    StepType2[StepType2["DEPOSIT"] = 2] = "DEPOSIT";
    StepType2[StepType2["WITHDRAW"] = 3] = "WITHDRAW";
    StepType2[StepType2["ZAP_IN"] = 4] = "ZAP_IN";
  })(OrderV12.StepType || (OrderV12.StepType = {}));
  (Datum2 => {
    function toPlutusData(datum) {
      const {
        sender,
        receiver,
        receiverDatumHash,
        step,
        batcherFee,
        depositADA
      } = datum;
      const senderConstr = AddressPlutusData.toPlutusData(sender);
      const receiverConstr = AddressPlutusData.toPlutusData(receiver);
      const receiverDatumHashConstr = receiverDatumHash ? new _lucidCardano.Constr(0, [receiverDatumHash]) : new _lucidCardano.Constr(1, []);
      let datumConstr;
      switch (step.type) {
        case 0 /* SWAP_EXACT_IN */:
          {
            datumConstr = new _lucidCardano.Constr(0, [senderConstr, receiverConstr, receiverDatumHashConstr, new _lucidCardano.Constr(0 /* SWAP_EXACT_IN */, [Asset.toPlutusData(step.desiredAsset), step.minimumReceived]), batcherFee, depositADA]);
            break;
          }
        case 1 /* SWAP_EXACT_OUT */:
          {
            datumConstr = new _lucidCardano.Constr(0, [senderConstr, receiverConstr, receiverDatumHashConstr, new _lucidCardano.Constr(1 /* SWAP_EXACT_OUT */, [Asset.toPlutusData(step.desiredAsset), step.expectedReceived]), batcherFee, depositADA]);
            break;
          }
        case 2 /* DEPOSIT */:
          {
            datumConstr = new _lucidCardano.Constr(0, [senderConstr, receiverConstr, receiverDatumHashConstr, new _lucidCardano.Constr(2 /* DEPOSIT */, [step.minimumLP]), batcherFee, depositADA]);
            break;
          }
        case 3 /* WITHDRAW */:
          {
            datumConstr = new _lucidCardano.Constr(0, [senderConstr, receiverConstr, receiverDatumHashConstr, new _lucidCardano.Constr(3 /* WITHDRAW */, [step.minimumAssetA, step.minimumAssetB]), batcherFee, depositADA]);
            break;
          }
        case 4 /* ZAP_IN */:
          {
            datumConstr = new _lucidCardano.Constr(0, [senderConstr, receiverConstr, receiverDatumHashConstr, new _lucidCardano.Constr(4 /* ZAP_IN */, [Asset.toPlutusData(step.desiredAsset), step.minimumLP]), batcherFee, depositADA]);
            break;
          }
      }
      return datumConstr;
    }
    Datum2.toPlutusData = toPlutusData;
    function fromPlutusData(networkId, data) {
      if (data.index !== 0) {
        throw new Error("Index of Order Datum must be 0, actual: ".concat(data.index));
      }
      const sender = AddressPlutusData.fromPlutusData(networkId, data.fields[0]);
      const receiver = AddressPlutusData.fromPlutusData(networkId, data.fields[1]);
      let receiverDatumHash = void 0;
      const maybeReceiverDatumHash = data.fields[2];
      switch (maybeReceiverDatumHash.index) {
        case 0:
          {
            receiverDatumHash = maybeReceiverDatumHash.fields[0];
            break;
          }
        case 1:
          {
            receiverDatumHash = void 0;
            break;
          }
        default:
          {
            throw new Error("Index of Receiver Datum Hash must be 0 or 1, actual: ".concat(maybeReceiverDatumHash.index));
          }
      }
      let step;
      const orderStepConstr = data.fields[3];
      switch (orderStepConstr.index) {
        case 0 /* SWAP_EXACT_IN */:
          {
            step = {
              type: 0 /* SWAP_EXACT_IN */,
              desiredAsset: Asset.fromPlutusData(orderStepConstr.fields[0]),
              minimumReceived: orderStepConstr.fields[1]
            };
            break;
          }
        case 1 /* SWAP_EXACT_OUT */:
          {
            step = {
              type: 1 /* SWAP_EXACT_OUT */,
              desiredAsset: Asset.fromPlutusData(orderStepConstr.fields[0]),
              expectedReceived: orderStepConstr.fields[1]
            };
            break;
          }
        case 2 /* DEPOSIT */:
          {
            step = {
              type: 2 /* DEPOSIT */,
              minimumLP: orderStepConstr.fields[0]
            };
            break;
          }
        case 3 /* WITHDRAW */:
          {
            step = {
              type: 3 /* WITHDRAW */,
              minimumAssetA: orderStepConstr.fields[0],
              minimumAssetB: orderStepConstr.fields[1]
            };
            break;
          }
        case 4 /* ZAP_IN */:
          {
            step = {
              type: 4 /* ZAP_IN */,
              desiredAsset: Asset.fromPlutusData(orderStepConstr.fields[0]),
              minimumLP: orderStepConstr.fields[1]
            };
            break;
          }
        default:
          {
            throw new Error("Index of Order Step must be in 0-4, actual: ".concat(orderStepConstr.index));
          }
      }
      const batcherFee = data.fields[4];
      const depositADA = data.fields[5];
      return {
        sender,
        receiver,
        receiverDatumHash,
        step,
        batcherFee,
        depositADA
      };
    }
    Datum2.fromPlutusData = fromPlutusData;
  })(OrderV12.Datum || (OrderV12.Datum = {}));
  (Redeemer2 => {
    Redeemer2[Redeemer2["APPLY_ORDER"] = 0] = "APPLY_ORDER";
    Redeemer2[Redeemer2["CANCEL_ORDER"] = 1] = "CANCEL_ORDER";
  })(OrderV12.Redeemer || (OrderV12.Redeemer = {}));
})(OrderV1 || (exports.OrderV1 = OrderV1 = {}));
class Dex {
  constructor(lucid) {
    _defineProperty(this, "lucid", void 0);
    _defineProperty(this, "network", void 0);
    _defineProperty(this, "networkId", void 0);
    this.lucid = lucid;
    this.network = lucid.network;
    this.networkId = lucid.network === "Mainnet" ? NetworkId.MAINNET : NetworkId.TESTNET;
  }
  async buildSwapExactInTx(options) {
    const {
      sender,
      assetIn,
      amountIn,
      assetOut,
      minimumAmountOut,
      isLimitOrder,
      availableUtxos
    } = options;
    (0, _tinyInvariant.default)(amountIn > 0n, "amount in must be positive");
    (0, _tinyInvariant.default)(minimumAmountOut > 0n, "minimum amount out must be positive");
    const orderAssets = {
      [Asset.toString(assetIn)]: amountIn
    };
    const {
      batcherFee,
      reductionAssets
    } = this.calculateBatcherFee(availableUtxos, orderAssets);
    if (orderAssets["lovelace"]) {
      orderAssets["lovelace"] += FIXED_DEPOSIT_ADA + batcherFee;
    } else {
      orderAssets["lovelace"] = FIXED_DEPOSIT_ADA + batcherFee;
    }
    const datum = {
      sender,
      receiver: sender,
      receiverDatumHash: void 0,
      step: {
        type: OrderV1.StepType.SWAP_EXACT_IN,
        desiredAsset: assetOut,
        minimumReceived: minimumAmountOut
      },
      batcherFee,
      depositADA: FIXED_DEPOSIT_ADA
    };
    const tx = this.lucid.newTx().payToContract(DexV1Constant.ORDER_BASE_ADDRESS[this.networkId], _lucidCardano.Data.to(OrderV1.Datum.toPlutusData(datum)), orderAssets).payToAddress(sender, reductionAssets).addSigner(sender);
    if (isLimitOrder) {
      tx.attachMetadata(674, {
        msg: [MetadataMessage.SWAP_EXACT_IN_LIMIT_ORDER]
      });
    } else {
      tx.attachMetadata(674, {
        msg: [MetadataMessage.SWAP_EXACT_IN_ORDER]
      });
    }
    return await tx.complete();
  }
  async buildSwapExactOutTx(options) {
    const {
      sender,
      assetIn,
      assetOut,
      maximumAmountIn,
      expectedAmountOut,
      availableUtxos
    } = options;
    (0, _tinyInvariant.default)(maximumAmountIn > 0n && expectedAmountOut > 0n, "amount in and out must be positive");
    const orderAssets = {
      [Asset.toString(assetIn)]: maximumAmountIn
    };
    const {
      batcherFee,
      reductionAssets
    } = this.calculateBatcherFee(availableUtxos, orderAssets);
    if (orderAssets["lovelace"]) {
      orderAssets["lovelace"] += FIXED_DEPOSIT_ADA + batcherFee;
    } else {
      orderAssets["lovelace"] = FIXED_DEPOSIT_ADA + batcherFee;
    }
    const datum = {
      sender,
      receiver: sender,
      receiverDatumHash: void 0,
      step: {
        type: OrderV1.StepType.SWAP_EXACT_OUT,
        desiredAsset: assetOut,
        expectedReceived: expectedAmountOut
      },
      batcherFee,
      depositADA: FIXED_DEPOSIT_ADA
    };
    return await this.lucid.newTx().payToContract(DexV1Constant.ORDER_BASE_ADDRESS[this.networkId], _lucidCardano.Data.to(OrderV1.Datum.toPlutusData(datum)), orderAssets).payToAddress(sender, reductionAssets).addSigner(sender).attachMetadata(674, {
      msg: [MetadataMessage.SWAP_EXACT_OUT_ORDER]
    }).complete();
  }
  async buildWithdrawTx(options) {
    const {
      sender,
      lpAsset,
      lpAmount,
      minimumAssetAReceived,
      minimumAssetBReceived,
      availableUtxos
    } = options;
    (0, _tinyInvariant.default)(lpAmount > 0n, "LP amount must be positive");
    (0, _tinyInvariant.default)(minimumAssetAReceived > 0n && minimumAssetBReceived > 0n, "minimum asset received must be positive");
    const orderAssets = {
      [Asset.toString(lpAsset)]: lpAmount
    };
    const {
      batcherFee,
      reductionAssets
    } = this.calculateBatcherFee(availableUtxos, orderAssets);
    if (orderAssets["lovelace"]) {
      orderAssets["lovelace"] += FIXED_DEPOSIT_ADA + batcherFee;
    } else {
      orderAssets["lovelace"] = FIXED_DEPOSIT_ADA + batcherFee;
    }
    const datum = {
      sender,
      receiver: sender,
      receiverDatumHash: void 0,
      step: {
        type: OrderV1.StepType.WITHDRAW,
        minimumAssetA: minimumAssetAReceived,
        minimumAssetB: minimumAssetBReceived
      },
      batcherFee,
      depositADA: FIXED_DEPOSIT_ADA
    };
    return await this.lucid.newTx().payToContract(DexV1Constant.ORDER_BASE_ADDRESS[this.networkId], _lucidCardano.Data.to(OrderV1.Datum.toPlutusData(datum)), orderAssets).payToAddress(sender, reductionAssets).addSigner(sender).attachMetadata(674, {
      msg: [MetadataMessage.WITHDRAW_ORDER]
    }).complete();
  }
  async buildZapInTx(options) {
    const {
      sender,
      assetIn,
      amountIn,
      assetOut,
      minimumLPReceived,
      availableUtxos
    } = options;
    (0, _tinyInvariant.default)(amountIn > 0n, "amount in must be positive");
    (0, _tinyInvariant.default)(minimumLPReceived > 0n, "minimum LP received must be positive");
    const orderAssets = {
      [Asset.toString(assetIn)]: amountIn
    };
    const {
      batcherFee,
      reductionAssets
    } = this.calculateBatcherFee(availableUtxos, orderAssets);
    if (orderAssets["lovelace"]) {
      orderAssets["lovelace"] += FIXED_DEPOSIT_ADA + batcherFee;
    } else {
      orderAssets["lovelace"] = FIXED_DEPOSIT_ADA + batcherFee;
    }
    const datum = {
      sender,
      receiver: sender,
      receiverDatumHash: void 0,
      step: {
        type: OrderV1.StepType.ZAP_IN,
        desiredAsset: assetOut,
        minimumLP: minimumLPReceived
      },
      batcherFee,
      depositADA: FIXED_DEPOSIT_ADA
    };
    return await this.lucid.newTx().payToContract(DexV1Constant.ORDER_BASE_ADDRESS[this.networkId], _lucidCardano.Data.to(OrderV1.Datum.toPlutusData(datum)), orderAssets).payToAddress(sender, reductionAssets).addSigner(sender).attachMetadata(674, {
      msg: [MetadataMessage.ZAP_IN_ORDER]
    }).complete();
  }
  async buildDepositTx(options) {
    const {
      sender,
      assetA,
      assetB,
      amountA,
      amountB,
      minimumLPReceived,
      availableUtxos
    } = options;
    (0, _tinyInvariant.default)(amountA > 0n && amountB > 0n, "amount must be positive");
    (0, _tinyInvariant.default)(minimumLPReceived > 0n, "minimum LP received must be positive");
    const orderAssets = {
      [Asset.toString(assetA)]: amountA,
      [Asset.toString(assetB)]: amountB
    };
    const {
      batcherFee,
      reductionAssets
    } = this.calculateBatcherFee(availableUtxos, orderAssets);
    if (orderAssets["lovelace"]) {
      orderAssets["lovelace"] += FIXED_DEPOSIT_ADA + batcherFee;
    } else {
      orderAssets["lovelace"] = FIXED_DEPOSIT_ADA + batcherFee;
    }
    const datum = {
      sender,
      receiver: sender,
      receiverDatumHash: void 0,
      step: {
        type: OrderV1.StepType.DEPOSIT,
        minimumLP: minimumLPReceived
      },
      batcherFee,
      depositADA: FIXED_DEPOSIT_ADA
    };
    return await this.lucid.newTx().payToContract(DexV1Constant.ORDER_BASE_ADDRESS[this.networkId], _lucidCardano.Data.to(OrderV1.Datum.toPlutusData(datum)), orderAssets).payToAddress(sender, reductionAssets).addSigner(sender).attachMetadata(674, {
      msg: [MetadataMessage.DEPOSIT_ORDER]
    }).complete();
  }
  async buildCancelOrder(options) {
    const {
      orderUtxo
    } = options;
    const redeemer = _lucidCardano.Data.to(new _lucidCardano.Constr(OrderV1.Redeemer.CANCEL_ORDER, []));
    const rawDatum = orderUtxo.datum;
    (0, _tinyInvariant.default)(rawDatum, "Cancel Order requires Order UTxOs along with its CBOR Datum");
    const orderDatum = OrderV1.Datum.fromPlutusData(this.networkId, _lucidCardano.Data.from(rawDatum));
    return await this.lucid.newTx().collectFrom([orderUtxo], redeemer).addSigner(orderDatum.sender).attachSpendingValidator(DexV1Constant.ORDER_SCRIPT).attachMetadata(674, {
      msg: [MetadataMessage.CANCEL_ORDER]
    }).complete();
  }
  calculateBatcherFee(utxos, orderAssets) {
    const [minAsset, adaMINLPAsset] = BATCHER_FEE_REDUCTION_SUPPORTED_ASSET[this.networkId];
    let amountMIN = 0n;
    let amountADAMINLP = 0n;
    for (const utxo of utxos) {
      if (utxo.assets[minAsset]) {
        amountMIN += utxo.assets[minAsset];
      }
      if (utxo.assets[adaMINLPAsset]) {
        amountADAMINLP += utxo.assets[adaMINLPAsset];
      }
    }
    if (orderAssets[minAsset]) {
      amountMIN -= orderAssets[minAsset];
    }
    if (orderAssets[adaMINLPAsset]) {
      amountADAMINLP -= orderAssets[adaMINLPAsset];
    }
    const reductionAssets = {};
    if (amountMIN > 0) {
      reductionAssets[minAsset] = amountMIN;
    }
    if (amountADAMINLP > 0) {
      reductionAssets[adaMINLPAsset] = amountADAMINLP;
    }
    return {
      batcherFee: getBatcherFee(this.network, amountMIN, amountADAMINLP),
      reductionAssets
    };
  }
}
exports.Dex = Dex;