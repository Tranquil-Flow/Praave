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

  export class AaveGetLoanStep extends Step {
    readonly config: StepConfig = {
        name: 'Aave Get Loan',
        description: 'Borrows DAI from Aave',
    };

    private readonly asset: Optional<String>;
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
        this.referralCode = referralCode;
        this.onBehalfOf = onBehalfOf;
        
    }

    protected abstract getStepOutput(
      input: StepInput,
    ): Promise<UnvalidatedStepOutput>;
  
  
  }
  