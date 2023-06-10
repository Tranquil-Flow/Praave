import {
    RecipeERC20AmountRecipient,
    RecipeERC20Info,
    StepConfig,
    StepInput,
    StepOutputERC20Amount,
    UnvalidatedStepOutput,
  } from '../../models/export-models';
  import { Step } from '../step';
  import { AavePoolContract } from '../../contract/aave/aave-pool-contract';
  import { BigNumberish } from 'ethers';

  export class AaveReturnLoanStep extends Step {
    readonly config: StepConfig = {
        name: 'Aave Repay Loan',
        description: 'Repays a DAI loan to Aave',
    };

    private readonly asset: Optional<string>;
    private readonly amount: Optional<BigNumberish>;
    private readonly interestRateMode: Optional<BigNumberish>;
    private readonly onBehalfOf: Optional<string>;


    constructor(
        asset: Optional<string>,
        amount: Optional<BigNumberish>,
        interestRateMode: Optional<BigNumberish>,
        onBehalfOf: Optional<string>,
    ) {
        super();
        this.asset = asset;
        this.amount = amount;
        this.interestRateMode = interestRateMode;
        this.onBehalfOf = onBehalfOf;
    }

    protected async getStepOutput(
      input: StepInput,
    ): Promise<UnvalidatedStepOutput> {

        const receiveERC20Decimals = BigInt(18);    // TO-DO: Remove hardcoded variables
        const maticPool = '0xb77fc84a549ecc0b410d6fa15159C2df207545a3';            // Polygon Aave Pool
        const variableDebtPolDAI = '0x8619d80FB0141ba7F184CbF22fd724116D9f7ffC'    // Aave Polygon Variable Debt DAI
  
        const depositDaiInfo: RecipeERC20Info = {
          tokenAddress: this.asset,
          decimals: receiveERC20Decimals,
        };
  
        const depositvariableDebtEthInfo: RecipeERC20Info = {
            tokenAddress: variableDebtPolDAI,
            decimals: receiveERC20Decimals,
          };

        const contract = new AavePoolContract(maticPool);
        const crossContractCall = await contract.createRepay(
          this.asset,
          this.amount,
          this.interestRateMode,
          this.onBehalfOf,
        );
  
        const amountBigNumberishValue: BigNumberish = this.amount;
        const amountBigIntValue: bigint = BigInt(amountBigNumberishValue.toString());

  
        const spentDaiAmountRecipient: RecipeERC20AmountRecipient = {
            ...depositDaiInfo,
            amount: amountBigIntValue,
            recipient: `Pool Vault`,
          };

          const spentvariableDebtEthAmountRecipient: RecipeERC20AmountRecipient = {
            ...depositvariableDebtEthInfo,
            amount: amountBigIntValue,
            recipient: `Pool Vault`,
          };
  
        return {
          crossContractCalls: [crossContractCall],
          spentERC20Amounts: [spentDaiAmountRecipient, spentvariableDebtEthAmountRecipient],
          outputERC20Amounts: [],
          outputNFTs: input.nfts,
        }
  
      };
  
  }
  