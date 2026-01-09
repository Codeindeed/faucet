import { Context, Pda, PublicKey } from '@metaplex-foundation/umi';
import { publicKey as publicKeySerializer, string, u8 } from '@metaplex-foundation/umi/serializers';
import { MPL_FAUCET_PROGRAM_ID } from './plugin';

/** Treasury PDA seed */
export const TREASURY_SEED = 'treasury';

/** Reward amount for burning a Core asset (0.1 SOL in lamports) */
export const CORE_ASSET_REWARD = BigInt(100_000_000);

/** Reward amount for burning a Bubblegum V2 cNFT (1 SOL in lamports) */
export const BUBBLEGUM_V2_REWARD = BigInt(1_000_000_000);

/**
 * Derives the treasury PDA address.
 */
export function findTreasuryPda(
  context: Pick<Context, 'eddsa' | 'programs'>,
  programId: PublicKey = MPL_FAUCET_PROGRAM_ID
): Pda {
  return context.eddsa.findPda(programId, [
    Buffer.from(TREASURY_SEED, 'utf-8'),
  ]);
}

/**
 * Derives the proof PDA address for a specific challenge and owner.
 */
export function findProofPda(
  context: Pick<Context, 'eddsa' | 'programs'>,
  seeds: {
    challenge: number;
    owner: PublicKey;
  }
): Pda {
  const programId = context.programs.getPublicKey(
    'mplFaucet',
    MPL_FAUCET_PROGRAM_ID
  );
  return context.eddsa.findPda(programId, [
    string({ size: 'variable' }).serialize('proof'),
    u8().serialize(seeds.challenge),
    publicKeySerializer().serialize(seeds.owner),
  ]);
}
