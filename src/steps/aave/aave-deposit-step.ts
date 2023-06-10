import {
    RecipeERC20AmountRecipient,
    RecipeERC20Info,
    StepConfig,
    StepInput,
    // StepOutput,
    StepOutputERC20Amount,
    UnvalidatedStepOutput,
  } from '../../models/export-models';
  import { compareERC20Info, isApprovedForSpender } from '../../utils/token';
  import { Step } from '../step';
  //import { AavePoolData } from '../../api/aave';
  import { AavePoolContract } from '../../contract/aave/aave-pool-contract';
    // import { calculateOutputsForAaveSupply } from './aave-util';
  import { BigNumberish } from 'ethers';
  // import { ERC20AmountFilter, filterERC20AmountInputs,} from '../../utils/filters';
  // import { validateStepOutput } from '../../validators/step-validator';

  export class AaveDepositStep extends Step {
    readonly config: StepConfig = {
        name: 'Aave Pool Deposit',
        description: 'Deposits WMATIC into Aave Pool contract',
    };

    private readonly asset: Optional<string>;
    private readonly amount: Optional<BigNumberish>;
    private readonly onBehalfOf: Optional<string>;
    private readonly referralCode: Optional<BigNumberish>;

    constructor(
        asset: Optional<string>,
        amount: Optional<BigNumberish>,
        onBehalfOf: Optional<string>,
        referralCode: Optional<BigNumberish>,
        // pool: AavePoolData,
    ) {
        super();
        this.asset = asset;
        this.amount = amount;
        this.onBehalfOf = onBehalfOf;
        this.referralCode = referralCode;
    }

    protected async getStepOutput(
      input: StepInput,
    ): Promise<UnvalidatedStepOutput> {

      const { erc20Amounts } = input;
      
      const depositERC20Decimals = BigInt(18);    // TO-DO: Remove hardcoded variables
      const maticPool = '0xb77fc84a549ecc0b410d6fa15159C2df207545a3';      // Polygon Aave Pool
      const aPolWMATIC = '0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97'      // Polygon aPolWMATIC

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
      const crossContractCall = await contract.createSupply(
        this.asset,
        this.amount,
        this.onBehalfOf,
        this.referralCode
      );

      const amountBigNumberishValue: BigNumberish = this.amount;
      const amountBigIntValue: bigint = BigInt(amountBigNumberishValue.toString());

      const spentERC20AmountRecipient: RecipeERC20AmountRecipient = {
        ...depositERC20Info,
        amount: erc20AmountForStep.expectedBalance,
        recipient: `Pool Vault`,
      };
      const outputERC20Amount: StepOutputERC20Amount = {
        tokenAddress: aPolWMATIC,
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
  
  }
  