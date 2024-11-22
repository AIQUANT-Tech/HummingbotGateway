"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxBuilder = void 0;
/**
 * The main class by which TxBuilder classes are extended.
 *
 * @template Options The options that your TxBuilder will take upon instantiating.
 * @template Wallet The type of transaction building library that you plan to use. For example, if using Lucid, this would be of type Lucid and initialized at some point within the class.
 * @template Tx The transaction interface type that will be returned from Lib when building a new transaction. For example, in Lucid this is of type Tx.
 *
 * @group Exported TxBuilders
 */
class TxBuilder {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static PARAMS;
}
exports.TxBuilder = TxBuilder;
//# sourceMappingURL=TxBuilder.abstract.class.js.map