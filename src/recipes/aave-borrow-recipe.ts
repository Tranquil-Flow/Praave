import { Recipe } from './recipe';
import { ApproveERC20SpenderStep, Step } from '../steps';
import { AaveAPI } from '../api/aave';
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
            'Deposits WETH into Aave Pool and borrows DAI'
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
        const spender = '0xe7ec1b0015eb2adeedb1b7f9f1ce82f9dad6df08';   // Aave WETH Pool
        const weth = '0xD0dF82dE051244f04BfF3A8bB1f62E1cD39eED92';      // Sepolia WETH
        const dai = '0x68194a729C2450ad26072b3D33ADaCbcef39D574';       // Sepolia DAI
        const referralCode = 0;                                         // Default value submitted when interacting with Aave frontend
        const wethDepositAmount = 0; // TO-DO: Take input from front end and plug in here
        const daiLoanAmount = 0;     // TO-DO: Take input from front end and plug in here
        const interestRateMode = 0;  // TO-DO: Take input from front end and plug in here
        const onBehalfOf = '0x0';    // TO-DO: Get msg.sender
        const depositERC20Info: RecipeERC20Info = {
          tokenAddress: weth,
          decimals: BigInt(18),
        };
        return [
          new ApproveERC20SpenderStep(spender, depositERC20Info),
          new AaveDepositStep(weth, wethDepositAmount, onBehalfOf, referralCode),
          new AaveGetLoanStep(dai, daiLoanAmount, interestRateMode, referralCode, onBehalfOf),
        ];
      }

}
