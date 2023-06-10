import { 
    NetworkName, removeUndefineds,
} from '@railgun-community/shared-models';
  import { AaveV3ApiEndpoint, getAaveV3ApiData } from './aave-fetch';
  import { compareTokenAddress } from '../../utils';
  import { CookbookDebug } from '../../utils/cookbook-debug';
  import { numToBasisPoints } from '../../utils/basis-points';

export type AaveV3Network = 'ethereum' |
                            'polygon' |
                            'sepolia';
export type AaveV3Chain = 'ethereum' | 'polygon' | 'sepolia';

type PoolData = {
    name: string;
    token: string;
    tokenAddress: string;
    tokenDecimals: string;
}

export abstract class AaveAPI {
    static cachedPoolData: Optional<PoolData[]>;
    static cachedTimestamp: Optional<number>;

    static async supportsNetwork(name: string): Promise<boolean> {
        return;
    }

    static async getPoolByAsset(asset: string): Promise<PoolData> {
        return;
    }

    static async getHealthFactor() {

    }

    static async getEstimatedGasFees() {

    }
}