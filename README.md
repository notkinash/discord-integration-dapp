# discord-integration-dapp
A Descentralized App + Discord Bot to integrate your wallet address and Discord account (multi-chain) using [create-web3-dapp](https://github.com/alchemyplatform/create-web3-dapp)

## Getting started
Copy `.env.local.example` to `.env.local`:
```
$ cp .env.local.example .env.local
```
Set all necessary values and then install all project dependencies:
```
$ npm install
```
Copy `.env.example` to `.env` the same way you did to `.env.local.example`.
Then config your `DATABASE_URL` in the `.env` and run database migrations:
```
$ npx prisma migrate dev
```
After all that, you can test your application:
```
$ npm run dev
```
Don't forget to set the interactions url in your Discord Application page.