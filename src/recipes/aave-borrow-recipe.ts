import { Recipe } from './recipe';
import { ApproveERC20SpenderStep, Step } from '../steps';
// import { AaveAPI } from '../api/aave';
import { NetworkName } from '@railgun-community/shared-models';
import {
    RecipeConfig,
    RecipeERC20Info,
    StepInput,
} from '../models/export-models';
import { AaveDepositStep, AaveGetLoanStep } from '../steps/aave';
import { BigNumberish, ethers } from 'ethers';

export class AaveBorrowRecipe extends Recipe {
    readonly config: RecipeConfig = {
        name: 'Aave Borrow',
        description:
            'Deposits MATIC into Aave Pool and borrows DAI'
    };

    private readonly supportedNetworks: NetworkName[] = [];

    // TO-DO make hardcoded values imported into constructor call
    constructor(
        config: RecipeConfig,
        supportedNetworks: NetworkName[],
        ) {
        super();
        this.config = config;
        this.supportedNetworks = supportedNetworks;
    }

    protected supportsNetwork(networkName: NetworkName): boolean {
        return this.supportedNetworks.includes(networkName);
    }

    protected async getInternalSteps(
        firstInternalStepInput: StepInput,
      ): Promise<Step[]> {
        const { networkName } = firstInternalStepInput;
        const spender = '0xe7ec1b0015eb2adeedb1b7f9f1ce82f9dad6df08';   // Aave Pool
        const matic = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270';      // Polygon WMATIC
        const dai = '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063';       // Polygon DAI
        const referralCode = 0;                                         // Default value submitted when interacting with Aave frontend
        const maticDepositAmount = 0; // TO-DO: Take input from front end and plug in here
        const daiLoanAmount = 0;     // TO-DO: Take input from front end and plug in here
        const interestRateMode = 0;  // TO-DO: Take input from front end and plug in here
        const onBehalfOf = '0x0';    // TO-DO: Get msg.sender
        const depositERC20Info: RecipeERC20Info = {
          tokenAddress: matic,
          decimals: BigInt(18),
        };
        return [
          new ApproveERC20SpenderStep(spender, depositERC20Info),
          new AaveDepositStep(matic, maticDepositAmount, onBehalfOf, referralCode),
          new AaveGetLoanStep(dai, daiLoanAmount, interestRateMode, referralCode, onBehalfOf),
        ];
      }

}
