import { ConfigManagerV2 } from '../../services/config-manager-v2';
export interface NetworkConfig {
  name: string;
  apiurl: string;
}

interface Config {
  network: NetworkConfig;
  allowedSlippage: string;
  blockfrostProjectId: string;
  preprodBlockfrostProjectId: string;
  ttl: string;
  defaultPoolId: string;
  defaultAddress: string;
  nativeCurrencySymbol: string;
}

export function getCardanoConfig(
  chainName: string,
  networkName: string
): Config {
  const network = networkName;
  return {
    network: {
      name: network,
      apiurl: ConfigManagerV2.getInstance().get(
        chainName + '.contractAddresses.' + networkName + '.apiurl'
      )
    },

    allowedSlippage: ConfigManagerV2.getInstance().get(
      chainName + '.allowedSlippage'
    ),
    blockfrostProjectId: ConfigManagerV2.getInstance().get(
      chainName + '.blockfrostProjectId'
    ),
    preprodBlockfrostProjectId: ConfigManagerV2.getInstance().get(
      chainName + '.preprodBlockfrostProjectId'
    ),
    defaultPoolId: ConfigManagerV2.getInstance().get(
      chainName + '.defaultPoolId.' + networkName + '.poolId'
    ),
    defaultAddress: ConfigManagerV2.getInstance().get(
      chainName + '.defaultAddress'
    ),
    ttl: ConfigManagerV2.getInstance().get(
      chainName + '.ttl'
    ),
    nativeCurrencySymbol: ConfigManagerV2.getInstance().get(
      chainName + '.nativeCurrencySymbol'
    ),
  };
}
