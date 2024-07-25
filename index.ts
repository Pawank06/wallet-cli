const { Command } = require('commander');
const {
  Connection,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction
} = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

const program = new Command();

program.version('0.1.0');


program
  .command('generate-keypair')
  .description('Generate a new keypair')
  .action(() => {
    const keypair = Keypair.generate();
    const keypairPath = path.resolve(__dirname, 'keypair.json');
    fs.writeFileSync(keypairPath, JSON.stringify(Array.from(keypair.secretKey)));
    console.log(`Keypair generated and saved to ${keypairPath}`);
  });

// Command to airdrop SOL to the wallet
program
  .command('airdrop <amount>')
  .description('Request an airdrop of SOL')
  .action(async (amount: any) => {
    const connection = new Connection(clusterApiUrl('devnet'));
    const keypair = loadKeypair();
    const airdropSignature = await connection.requestAirdrop(
      keypair.publicKey,
      amount * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature);
    console.log(`Airdropped ${amount} SOL to ${keypair.publicKey.toBase58()}`);
  });


program
  .command('balance')
  .description('Check the wallet balance')
  .action(async () => {
    const connection = new Connection(clusterApiUrl('devnet'));
    const keypair = loadKeypair();
    const balance = await connection.getBalance(keypair.publicKey);
    console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
  });


program
  .command('send <to> <amount>')
  .description('Send SOL to another wallet')
  .action(async (to: any, amount: any) => {
    const connection = new Connection(clusterApiUrl('devnet'));
    const keypair = loadKeypair();
    const toPublicKey = new PublicKey(to);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: toPublicKey,
        lamports: amount * LAMPORTS_PER_SOL
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [keypair]);
    console.log(`Sent ${amount} SOL to ${to} in transaction ${signature}`);
  });

function loadKeypair() {
  const keypairPath = path.resolve(__dirname, 'keypair.json');
  const secretKey = new Uint8Array(JSON.parse(fs.readFileSync(keypairPath)));
  return Keypair.fromSecretKey(secretKey);
}

program.parse(process.argv);
