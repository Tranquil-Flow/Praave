import axios from 'axios';

export enum AaveV3ApiEndpoint {
    GetPools = '',
}

/*
    decimals
    asset pool address
    depositFee
    gasAmount
*/

const AAVE_V3_API_URL = 'https://aave-api-v2.aave.com';

export const getAaveV3ApiData = async<T>(endpoint: AaveV3ApiEndpoint): Promise<T> => {
    const url = `$AAVE_V3_API_URL/$endpoint`;

    const response = await axios.get(url);

    return response.data;
}