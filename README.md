# lecture-1

## Solana CLI Wallet

A command-line interface (CLI) wallet for Solana that allows you to generate keypairs, request airdrops, check balances, and send SOL.

## Installation

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.6. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Commands

Generate a New Keypair:

```bash
bun index.ts generate-keypair
```

Request an Airdrop:

```bash
bun index.ts airdrop <amount>
```

Check Wallet Balance:

```bash
bun index.ts balance
```

Send SOL:

```bash
bun index.ts send <recipient_public_key> <amount>
```