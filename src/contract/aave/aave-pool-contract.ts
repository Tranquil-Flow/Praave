import { BigNumberish, Contract, ContractTransaction, Provider } from 'ethers';
import { abi } from '../../abi/abi';
import { Pool } from '../../typechain';
import { validateAddress } from '../../utils/address';

export class AavePoolContract {
    private readonly contract: Pool;
  
    constructor(address: string, provider?: Provider) {
      if (!validateAddress(address)) {
        throw new Error('Invalid Vault address for Aave Pool contract');
      }
      this.contract = new Contract(
        address,
        abi.aave,   
        provider,
      ) as unknown as Pool;
    }
  
    // function supply(asset, amount, onBehalfOf, referralCode) deposits asset into Aave Pool
    createSupply(
        asset: string,
        amount: BigNumberish,
        onBehalfOf: string,
        referralCode: BigNumberish
    ): Promise<ContractTransaction> {
      return this.contract.supply.populateTransaction(
            asset,
            amount,
            onBehalfOf,
            referralCode
      );
    }
  
    // function borrow(asset, amount, interestRateMode, referralCode, onBehalfOf) borrows asset from Aave
    createBorrow(
        asset: string,
        amount: BigNumberish,
        interestRateMode: BigNumberish,
        referralCode: BigNumberish,
        onBehalfOf: string,
    ): Promise<ContractTransaction> {
      return this.contract.borrow.populateTransaction(
            asset,
            amount,
            interestRateMode,
            referralCode,
            onBehalfOf
      );
    }

    // function repay(asset, amount, interestRateMode, onBehalfOf) repays asset to Aave
    createRepay(
        asset: string,
        amount: BigNumberish,
        interestRateMode: BigNumberish,
        onBehalfOf: string,
    ): Promise<ContractTransaction> {
        return this.contract.repay.populateTransaction(
            asset,
            amount,
            interestRateMode,
            onBehalfOf,
        );
      }

    // function withdraw(asset, amount, to) withdraws asset from Aave Pool
    createWithdraw(
        asset: string,
        amount: BigNumberish,
        to: string,
    ): Promise<ContractTransaction> {
        return this.contract.withdraw.populateTransaction(
            asset,
            amount,
            to,
        );
      }
  }