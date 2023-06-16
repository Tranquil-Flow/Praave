import { AaveBorrowRecipe } from "../recipes/aave-borrow-recipe";

const wmaticDeposit = 1;
const daiLoanAmount = 1;

const wmaticAddress = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270';      // Polygon WMATIC

const cook = new AaveBorrowRecipe(depositERC20Info);

// Inputs that will be unshielded from private balance.
const unshieldERC20Amounts = [{ ...depositERC20Info, wmaticDeposit }];

const recipeInput = { networkName, unshieldERC20Amounts };
const { crossContractCalls, erc20Amounts } = await swap.getRecipeOutput(recipeInput);

// Outputs to re-shield after the Recipe multicall.
const shieldERC20Addresses = erc20Amounts.map(({tokenAddress}) => tokenAddress);

// RAILGUN Quickstart will generate a [unshield -> call -> re-shield] transaction enclosing the Recipe multicall.
const crossContractCallsSerialized = crossContractCalls.map(
    serializeUnsignedTransaction,
)

const {gasEstimateString} = await gasEstimateForUnprovenCrossContractCalls(
    ...
    unshieldERC20Amounts,
    ...
    shieldERC20Addresses,
    ...
    crossContractCallsSerialized,
    ...
)
await generateCrossContractCallsProof(
    ...
    unshieldERC20Amounts,
    ...
    shieldERC20Addresses,
    ...
    crossContractCallsSerialized,
    ...
)
const {serializedTransaction} = await populateProvedCrossContractCalls(
    ...
    unshieldERC20Amounts,
    ...
    shieldERC20Addresses,
    ...
    crossContractCallsSerialized,
    ...
);

// Submit transaction to RPC.
const transaction = deserializeTransaction(serializedTransaction);
await wallet.sendTransaction(transaction);

// Note: use @railgun-community/waku-relayer-client to submit through a Relayer instead of signing with your own wallet.