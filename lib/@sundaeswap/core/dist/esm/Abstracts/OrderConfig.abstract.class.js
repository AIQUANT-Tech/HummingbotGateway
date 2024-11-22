import { Config } from "./Config.abstract.class.js";
/**
 * The OrderConfig class extends Config and represents the configuration for an order.
 * It includes settings such as the pool and order addresses.
 *
 * @template Args The type of the arguments object, defaulting to an empty object.
 */
export class OrderConfig extends Config {
    /**
     * The data for the pool involved in the order.
     */
    pool;
    /**
     * The addresses for the order.
     */
    orderAddresses;
    /**
     * Set the {@link Core.TOrderAddresses} for a swap's required datum.
     * @param {TOrderAddresses} orderAddresses - The addresses for the order.
     * @returns {OrderConfig} The current instance of the class.
     */
    setOrderAddresses(orderAddresses) {
        this.orderAddresses = orderAddresses;
        return this;
    }
    /**
     * Set the pool data directly for the swap you use.
     *
     * @param {IPoolData} pool - The data for the pool involved in the order.
     * @returns {OrderConfig} The current instance of the class.
     */
    setPool(pool) {
        this.pool = pool;
        return this;
    }
    /**
     * Validates the current configuration.
     * If the pool or the order addresses are not set, it throws an error.
     * @throws {Error} If the pool or the order addresses are not set.
     */
    validate() {
        super.validate();
        if (!this.pool) {
            throw new Error("You haven't set a pool in your Config. Set a pool with .setPool()");
        }
        if (!this.orderAddresses) {
            throw new Error("You haven't defined the OrderAddresses in your Config. Set with .setOrderAddresses()");
        }
    }
}
//# sourceMappingURL=OrderConfig.abstract.class.js.map