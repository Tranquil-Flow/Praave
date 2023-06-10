import {
    RecipeERC20AmountRecipient,
    RecipeERC20Info,
    StepConfig,
    StepInput,
    StepOutput,
    StepOutputERC20Amount,
    UnvalidatedStepOutput,
  } from '../../models/export-models';
  import { compareERC20Info, isApprovedForSpender } from '../../utils/token';
  import { Step } from '../step';
  import { AavePoolData } from '../../api/aave';
  import { AavePoolContract } from '../../contract/borrow/aave/aave-pool-contract';
  import { calculateOutputsForAaveSupply } from './aave-util';
  import { BigNumberish } from 'ethers';
  
  import { ERC20AmountFilter, filterERC20AmountInputs,} from '../../utils/filters';
  import { validateStepOutput } from '../../validators/step-validator';

  export abstract class AaveDepositStep extends Step {
    readonly config: StepConfig = {
        name: 'Aave Pool Deposit',
        description: 'Deposits WETH into Aave Pool contract',
    };

    // input asset is only WETH for PoC. Can code in rather than take input?
    private readonly asset: Optional<String>;
    private readonly amount: Optional<BigNumberish>;
    private readonly onBehalfOf: Optional<string>;
    private readonly referralCode: Optional<BigNumberish>;

    constructor(
        asset: Optional<string>,
        amount: Optional<BigNumberish>,
        onBehalfOf: Optional<string>,
        referralCode: Optional<BigNumberish>,
    ) {
        super();
        this.asset = asset;
        this.amount = amount;
        this.onBehalfOf = onBehalfOf;
        this.referralCode = referralCode;
    }

    protected abstract getStepOutput(
      input: StepInput,
    ): Promise<UnvalidatedStepOutput>;
  
  
  }
  