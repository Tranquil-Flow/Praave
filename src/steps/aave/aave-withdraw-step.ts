import {
    RecipeERC20AmountRecipient,
    RecipeERC20Info,
    StepConfig,
    StepInput,
    StepOutputERC20Amount,
    UnvalidatedStepOutput,
  } from '../../models/export-models';
  import { compareERC20Info, isApprovedForSpender } from '../../utils/token';
  import { Step } from '../step';
  import { AavePoolContract } from '../../contract/aave/aave-pool-contract';
  import { BigNumberish } from 'ethers';

  export class AaveWithdrawStep extends Step {
    readonly config: StepConfig = {
        name: 'Aave Pool Withdraw',
        description: 'Withdraws WETH into Aave Pool contract',
    };

    private readonly asset: Optional<string>;
    private readonly amount: Optional<BigNumberish>;
    private readonly to: Optional<string>;

    constructor(
        asset: Optional<string>,
        amount: Optional<BigNumberish>,
        to: Optional<string>,
    ) {
        super();
        this.asset = asset;
        this.amount = amount;
        this.to = to;
    }

    protected async getStepOutput(
      input: StepInput,
    ): Promise<UnvalidatedStepOutput> {

        const { erc20Amounts } = input;
      
        const depositERC20Decimals = BigInt(18);    // TO-DO: Remove hardcoded variables
        const wethPool = '0xe7ec1b0015eb2adeedb1b7f9f1ce82f9dad6df08';            // Sepolia Aave Pool
        const wethAddress = '0xD0dF82dE051244f04BfF3A8bB1f62E1cD39eED92'      // Sepolia WETH
  
        const depositERC20Info: RecipeERC20Info = {
          tokenAddress: this.asset,
          decimals: depositERC20Decimals,
        };
        const { erc20AmountForStep, unusedERC20Amounts } =
        this.getValidInputERC20Amount(
          erc20Amounts,
          erc20Amount =>
            compareERC20Info(erc20Amount, depositERC20Info) &&
            isApprovedForSpender(erc20Amount, wethPool),
          undefined, // amount
        );
  
        const contract = new AavePoolContract(wethPool);
        const crossContractCall = await contract.createWithdraw(
          undefined,
          this.amount,
          this.to
        );
  
        const amountBigNumberishValue: BigNumberish = this.amount;
        const amountBigIntValue: bigint = BigInt(amountBigNumberishValue.toString());
  
        const spentERC20AmountRecipient: RecipeERC20AmountRecipient = {
          ...depositERC20Info,
          amount: erc20AmountForStep.expectedBalance,
          recipient: `Pool Vault`,
        };
        const outputERC20Amount: StepOutputERC20Amount = {
          tokenAddress: wethAddress,
          decimals: depositERC20Decimals,
          expectedBalance: amountBigIntValue,
          minBalance: amountBigIntValue,
          approvedSpender: undefined,
        };
  
        return {
          crossContractCalls: [crossContractCall],
          spentERC20Amounts: [spentERC20AmountRecipient],
          outputERC20Amounts: [outputERC20Amount, ...unusedERC20Amounts],
          outputNFTs: input.nfts,
        }
        
    };  

};