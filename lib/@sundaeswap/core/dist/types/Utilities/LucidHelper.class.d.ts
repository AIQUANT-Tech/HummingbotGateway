import { TDatum, TSupportedNetworks } from "../@types/index.js";
/**
 * A helper class that provides utility functions for validating and processing
 * Cardano addresses. These functions include:
 * - Parsing address hashes from a Bech32 or hex encoded address
 * - Validating an address as being a valid Cardano address and that it is on the correct network
 * - Checking if an address is a script address
 * - Validating that an address matches the given network
 * - Throwing an error if the address is on the wrong network
 * - Throwing an error if an invalid address is supplied
 *
 * @example
 * ```typescript
 *  const hashes = LucidHelper.getAddressHashes("addr_test...")
 *  LucidHelper.validateAddressAndDatumAreValid({ address: "addr_test...", network: "mainnet" });
 *  const isScript = LucidHelper.isScriptAddress("addr_test...");
 * ```
 */
export declare class LucidHelper {
    /**
     * Helper function to parse addresses hashes from a Bech32 or hex encoded address.
     * @param address
     * @returns
     */
    static getAddressHashes(address: string): {
        paymentCredentials: string;
        stakeCredentials?: string;
    };
    /**
     * Validates that an address and optional datum are valid,
     * and that the address is on the correct network.
     */
    static validateAddressAndDatumAreValid({ address, datum, network, }: {
        address: string;
        datum: TDatum;
        network: TSupportedNetworks;
    }): void | never;
    /**
     * Helper function to check if an address is a script address.
     * @param address The Bech32 encoded address.
     * @returns
     */
    static isScriptAddress(address: string): boolean;
    /**
     * Validates that an address matches the provided network.
     */
    static validateAddressNetwork(address: string, network: TSupportedNetworks): void | never;
    /**
     * Throws a useful error if the address, network, and instance network are on the wrong network.
     * @param addressNetwork
     * @param address
     */
    static maybeThrowNetworkError(addressNetwork: number, address: string, network: TSupportedNetworks): never | void;
    static inlineDatumToHash(inline: string): string;
    /**
     * Throws an error describing the address and contextual information.
     */
    static throwInvalidOrderAddressesError(address: string, errorMessage: string): never;
}
//# sourceMappingURL=LucidHelper.class.d.ts.map