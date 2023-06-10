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

  export class AaveGetLoanStep extends Step {
    readonly config: StepConfig = {
        name: 'Aave Get Loan',
        description: 'Borrows DAI from Aave',
    };

    private readonly asset: Optional<string>;
    private readonly amount: Optional<BigNumberish>;
    private readonly interestRateMode: Optional<BigNumberish>;
    private readonly referralCode: Optional<BigNumberish>;
    private readonly onBehalfOf: Optional<string>;

    constructor(
        asset: Optional<string>,
        amount: Optional<BigNumberish>,
        interestRateMode: Optional<BigNumberish>,
        referralCode: Optional<BigNumberish>,
        onBehalfOf: Optional<string>,
        
    ) {
        super();
        this.asset = asset;
        this.amount = amount;
        this.interestRateMode = interestRateMode;
        this.referralCode = referralCode;
        this.onBehalfOf = onBehalfOf;
        
    }

    protected async getStepOutput(
      input: StepInput,
    ): Promise<UnvalidatedStepOutput> {
      
      const receiveERC20Decimals = BigInt(18);    // TO-DO: Remove hardcoded variables
      const wethPool = '0xe7ec1b0015eb2adeedb1b7f9f1ce82f9dad6df08';            // Sepolia Aave Pool
      const variableDebtEthDAIAddress = '0x1badcb245082a0E90c41770d47C7B58CBA59af74' // Sepolia Aave Ethereum Variable Debt DAI

      const receiveERC20Info: RecipeERC20Info = {
        tokenAddress: this.asset,
        decimals: receiveERC20Decimals,
      };

      const contract = new AavePoolContract(wethPool);
      const crossContractCall = await contract.createBorrow(
        this.asset,
        this.amount,
        this.interestRateMode,
        this.referralCode,
        this.onBehalfOf,
      );

      const amountBigNumberishValue: BigNumberish = this.amount;
      const amountBigIntValue: bigint = BigInt(amountBigNumberishValue.toString());


      const outputDaiAmount: StepOutputERC20Amount = {
        tokenAddress: receiveERC20Info.tokenAddress,
        decimals: receiveERC20Info.decimals,
        expectedBalance: amountBigIntValue,
        minBalance: amountBigIntValue,
        approvedSpender: undefined,
      };
      const outputvariableDebtEthAmount: StepOutputERC20Amount = {
        tokenAddress: variableDebtEthDAIAddress,
        decimals: receiveERC20Decimals,
        expectedBalance: amountBigIntValue,
        minBalance: amountBigIntValue,
        approvedSpender: undefined,
      };

      return {
        crossContractCalls: [crossContractCall],
        outputERC20Amounts: [outputDaiAmount, outputvariableDebtEthAmount],
        outputNFTs: input.nfts,
      }

    };
  
  }
  