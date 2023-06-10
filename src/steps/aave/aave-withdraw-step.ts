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
        description: 'Withdraws MATIC into Aave Pool contract',
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
        const maticPool = '0xb77fc84a549ecc0b410d6fa15159C2df207545a3';        // Polygon Aave Pool
        const maticAddress = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'      // Polygon WMATIC
  
        const depositERC20Info: RecipeERC20Info = {
          tokenAddress: this.asset,
          decimals: depositERC20Decimals,
        };
        const { erc20AmountForStep, unusedERC20Amounts } =
        this.getValidInputERC20Amount(
          erc20Amounts,
          erc20Amount =>
            compareERC20Info(erc20Amount, depositERC20Info) &&
            isApprovedForSpender(erc20Amount, maticPool),
          undefined, // amount
        );
  
        const contract = new AavePoolContract(maticPool);
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
          tokenAddress: maticAddress,
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