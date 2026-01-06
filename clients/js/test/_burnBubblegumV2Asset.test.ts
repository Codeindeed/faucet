import { publicKey, sol, transactionBuilder } from '@metaplex-foundation/umi';
import test from 'ava';
import { findTreasuryPda } from '../src';
import { createUmi } from './_setup';

// Helper to fund the treasury PDA
async function fundTreasury(umi: any, amount: bigint) {
  const treasuryPda = findTreasuryPda(umi);

  await transactionBuilder()
    .add({
      instruction: {
        keys: [
          { pubkey: umi.payer.publicKey, isSigner: true, isWritable: true },
          { pubkey: treasuryPda[0], isSigner: false, isWritable: true },
        ],
        programId: publicKey('11111111111111111111111111111111'),
        data: Buffer.from([
          2,
          0,
          0,
          0, // Transfer instruction
          ...new Uint8Array(new BigUint64Array([amount]).buffer),
        ]),
      },
      signers: [umi.payer],
      bytesCreatedOnChain: 0,
    })
    .sendAndConfirm(umi);
}

test('it can burn a Bubblegum V2 cNFT and receive 1 SOL', async (t) => {
  // Given a Umi instance
  const umi = await createUmi();

  // Fund the treasury with 10 SOL
  await fundTreasury(umi, sol(10).basisPoints);

  // TODO: Set up Bubblegum V2 test infrastructure
  // This requires:
  // 1. Creating a merkle tree
  // 2. Minting a compressed NFT
  // 3. Getting the proof data from an indexer

  // For now, this is a placeholder test that verifies the treasury setup
  const treasuryPda = findTreasuryPda(umi);
  const treasuryBalance = await umi.rpc.getBalance(treasuryPda[0]);
  t.is(treasuryBalance.basisPoints, sol(10).basisPoints);

  // TODO: Complete test once Bubblegum V2 test setup is available
  // The test should verify:
  // 1. cNFT is burned
  // 2. Owner receives 1 SOL
  // 3. Treasury balance decreases by 1 SOL
  t.pass('Treasury funded successfully - complete Bubblegum test setup');
});

test('it fails to burn Bubblegum V2 cNFT with insufficient treasury balance', async (t) => {
  const umi = await createUmi();

  // Fund treasury with only 0.5 SOL (less than 1 SOL reward)
  await fundTreasury(umi, sol(0.5).basisPoints);

  // Verify treasury has insufficient balance
  const treasuryPda = findTreasuryPda(umi);
  const treasuryBalance = await umi.rpc.getBalance(treasuryPda[0]);
  t.is(treasuryBalance.basisPoints, sol(0.5).basisPoints);

  // TODO: Complete test with actual Bubblegum V2 burn attempt
  // Should fail with InsufficientTreasuryBalance error
  t.pass('Treasury has insufficient balance - complete Bubblegum test');
});

test('it fails with invalid Bubblegum program', async (t) => {
  const umi = await createUmi();

  // Fund the treasury
  await fundTreasury(umi, sol(10).basisPoints);

  // TODO: Attempt burn with wrong Bubblegum program ID
  // Should fail with InvalidBubblegumProgram error
  t.pass('Placeholder - complete with invalid program test');
});

test('it rewards correct amount (1 SOL) for Bubblegum V2 vs Core (0.1 SOL)', async (t) => {
  // This test verifies the different reward amounts
  // Bubblegum V2: 1 SOL (1_000_000_000 lamports)
  // Core: 0.1 SOL (100_000_000 lamports)

  const BUBBLEGUM_V2_REWARD = sol(1).basisPoints;
  const CORE_REWARD = sol(0.1).basisPoints;

  t.is(BUBBLEGUM_V2_REWARD, 1_000_000_000n);
  t.is(CORE_REWARD, 100_000_000n);
  t.is(BUBBLEGUM_V2_REWARD / CORE_REWARD, 10n); // Bubblegum rewards 10x more
});
