# PrivyFi
Private interactions with lending protcols such as Aave utilizing Railgun for privacy preservation. Intended to be used by a browser extension which allows for a user to connect to a dApp with it's existing UI, but calling the contract function calls through the Railgun Relayer so that their interactions are private. For the Proof of Concept we will be utilizing Aave on Polygon.

## Railgun Integration
Railgun allows for users to transact between accounts privately, as well as with smart contracts. By combining this with the browser extension, a seamless UX is available for users who can utilize the UI they are used to while still retaining their privacy. An example flow of how this could work with Aave Protocol when taking out a loan:

- User approves WMATIC. Normally this approves the Aave Pool contract to use WMATIC, with Praave the user approves the Railgun Relayer.
- User calls the supply() function. Normally this deposits WMATIC to the Aave Pool, with Praave the user deposits WMATIC to the Railgun Relayer which in turn deposits on the Aave Pool.
- User calls the borrow() function. Normally this withdraws DAI from the Aave Pool, with Praave the Railgun Relayer calls the Pool and stores the DAI in the users Railgun Private Balance.

Made with <3 at ETHPrague 2023

# Railgun Deployments

## Optimism
- Treasury: 0x43EE0387F62a8ed5E15A9d537fAB94dfd229f50F
- RailgunSmartWallet: 0xfa48b9d1fF28066b83DB0fB64481146ea26e1ef7

## Gnosis
- Treasury: 0x21bef676c07648CE9FBCAF49C4a5fbE2882918fB
- RailgunSmartWallet: 0x1e8369c068eCcc5dFB848C87ce62c9eaaAd60393

## Mantle (Mantle Testnet)
- Treasury: 0x9Ee6b0FD155FDE766e52B0A3cFC4B51cC95e77Ab
- RailgunSmartWallet: 0xf4B7A7F63250DF306c6AC03abC00Cb02Ff9b42A0

## Taiko (Alpha-3 Testnet)
- Treasury: 0x9Ee6b0FD155FDE766e52B0A3cFC4B51cC95e77Ab
- RailgunSmartWallet: 0xf4B7A7F63250DF306c6AC03abC00Cb02Ff9b42A0

## Base (Base Goerli Testnet)
- Treasury: 0x55FEf7e9282701ebc5A18c2d751cE7e1123acFFb
- RailgunSmartWallet: 0x236da70A06dc965d81C1dd4D439a181Af8bf7a73
