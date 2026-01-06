/* eslint-disable import/no-extraneous-dependencies */
import { createUmi as basecreateUmi } from '@metaplex-foundation/umi-bundle-tests';
import { publicKey, transactionBuilder } from '@metaplex-foundation/umi';
import { findTreasuryPda, mplFaucet } from '../src';

export const createUmi = async () => (await basecreateUmi()).use(mplFaucet());

// Helper to fund the treasury PDA
export async function fundTreasury(umi: any, amount: bigint) {
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
