
# wave-portal

A web dapp for people who want to send a message to someone that will be stored in the blockchain forever.

## Frontend
In the project we used ReactJS to make the visual of our application and use of some features like useEffect and useState from the framework together with *vite.js* for the *HMR* (hot mode reloading) so we could be easily seeing the changes we made to our dapp.

If you want to test the dapp, all you need to do is run a `npm install` and run a `npm run dev` to start locally our frontend.

## Backend
Here we made use of hardhat to ease the development and test of our solidity contract locally. 

In case you want to deploy our contract from your wallet to the Goerli testnet all you would need to do is configure a **.env** file with the parameters *STAGING_ALCHEMY_KEY* and *PRIVATE_KEY*.

For the *STAGING_ALCHEMY_KEY* you would need to create a account in the alchemy.com that is a helper so we can easily deploy our smart contract to the blockchain. After you create a account you would have to create a app and copy the information in **VIEW KEY** from the *HTTPS* section.

For the *PRIVATE_KEY* you would need to copy the private key from the wallet that you want to use to deploy the contract.


### Run locally
If you want to run the project in your laptop with a local blockchain, we have two possible ways:

> The first option we can use the command `npx hardhat run scripts/run.js` were we will run a local test with a script that will create a blockchain only for some moments while the script run and it will be destroyed shortly after.

> The second option is where we run `npx hardhat node` so we create a local blockchain and in another terminal we can run `npx hardhat run scripts/deploy.js --network localhost` to deploy our smart contract in this blockchain that was created, that different from the first option this one will be active till we terminate the process started in the command before the deploy.

### Run on testnet
We also can deploy our project in the testnet Goerli.
> For this we would need to already have configured in our **.env** file the parameter *STAGING_ALCHEMY_KEY* so we will have the help from Alchemy to do the deploy on Goerli.
>
> After this we only need to run the command `npx hardhat run scripts/deploy.js --network goerli` and wait to see the terminal show us the number of the contract that was deployed so we can use it to connect the frontend to our contract.
> 
> We will need to update the contract address and ABI in the *wave-frontend/src/utils/WavePortal.json* (paste the ABI here) and *wave-frontend/App.jsx* the value of the variable **contractAddress** with the address that was provided after the success of the deployment.
