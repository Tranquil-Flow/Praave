import ABI_ERC20 from './token/erc20.json';
import ABI_ERC721 from './token/erc721.json';
import ABI_RELAY_ADAPT from './adapt/RelayAdapt.json';
import ABI_ACCESS_CARD_ERC721 from './access-card/AccessCardERC721.json';
import ABI_ACCESS_CARD_OWNER_ACCOUNT from './access-card/AccessCardOwnerAccount.json';
import ABI_ACCESS_CARD_ACCOUNT_CREATOR from './access-card/AccessCardAccountCreator.json';
import ABI_AAVE_POOL from './aave/Pool.json'

export const abi = {
  token: {
    erc20: ABI_ERC20,
    erc721: ABI_ERC721,
    accessCardERC721: ABI_ACCESS_CARD_ERC721,
  },
  accessCard: {
    erc721: ABI_ACCESS_CARD_ERC721,
    ownerAccount: ABI_ACCESS_CARD_OWNER_ACCOUNT,
    accountCreator: ABI_ACCESS_CARD_ACCOUNT_CREATOR,
  },
  adapt: {
    relay: ABI_RELAY_ADAPT,
  },
  aave: {
    aave: ABI_AAVE_POOL,
  },
} as const;
