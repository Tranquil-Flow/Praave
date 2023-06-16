import {
    NetworkName,
    RailgunERC20Amount,
} from '@railgun-community/shared-models';
import { ContractTransaction, JsonRpcProvider, Wallet, keccak256 } from 'ethers';


const devPrivateKey = "ac0d1cff3a5e812a53e44f1de2dbdd7cdf3d7f49da04648ebb26f60e6ae5077d";

// Receiver of the shield.
const railgunAddress = '0zk123...456';


function getShieldPrivateKeySignatureMessage() {
    const currentTimestamp = new Date().toISOString();
    return `I am signing this message to confirm I own the private key as of ${currentTimestamp}`;
}


async function gasEstimateForShieldBaseToken(
    networkName: string,
    railgunAddress: string,
    shieldPrivateKey: string,
    wrappedERC20Amount: RailgunERC20Amount,
    fromWalletAddress: string
) {
    // Mocked data
    const mockGasEstimateString = '0x5208'; // This is 21000 in hexadecimal, the typical gas cost for a simple ETH transfer.
    const mockError = null;

    // Simulate some delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return { gasEstimateString: mockGasEstimateString, error: mockError };
}

async function main() {
// The shieldPrivateKey enables the sender to decrypt
// the receiver's address in the future.
    const wallet = new Wallet(devPrivateKey);
    const shieldSignatureMessage = getShieldPrivateKeySignatureMessage();
    const shieldPrivateKey = keccak256(
        await wallet.signMessage(shieldSignatureMessage),
    );

// Formatted wrapped token amount.
// Tokens will shield as ETH and auto-wrap into wETH.
    const wrappedERC20Amount: RailgunERC20Amount = {
        tokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // wETH
        amount: BigInt(100) ,
    };

// Public wallet to shield from.
    const fromWalletAddress: string    = '0xab5801a7d398351b8be11c439e05c5b3259aec9b';

    const {gasEstimateString, error} = await gasEstimateForShieldBaseToken(
        NetworkName.Ethereum,
        railgunAddress,
        shieldPrivateKey,
        wrappedERC20Amount,
        fromWalletAddress,
    );
    if (error) {
        // Handle gas estimate error.
    }

    console.log(gasEstimateString);

    // const gasEstimate = BigNumber.from(gasEstimateString);
}

main().catch(console.error);

export {};
