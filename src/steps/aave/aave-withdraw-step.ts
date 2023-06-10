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

  export class AaveWithdrawStep extends Step {
    readonly config: StepConfig = {
        name: 'Aave Pool Withdraw',
        description: 'Withdraws WETH into Aave Pool contract',
    };

    private readonly asset: Optional<String>;
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

    protected abstract getStepOutput(
      input: StepInput,
    ): Promise<UnvalidatedStepOutput>;
  
  
  }
  