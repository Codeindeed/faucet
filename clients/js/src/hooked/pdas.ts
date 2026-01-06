import { Context, Pda, PublicKey } from '@metaplex-foundation/umi';
import { MPL_FAUCET_PROGRAM_ID } from '../generated';

/** Treasury PDA seed */
export const TREASURY_SEED = 'treasury';

/**
 * Derives the treasury PDA address.
 * The treasury holds SOL that is distributed as rewards when users burn assets.
 */
export function findTreasuryPda(
  context: Pick<Context, 'eddsa' | 'programs'>,
  programId: PublicKey = MPL_FAUCET_PROGRAM_ID
): Pda {
  return context.eddsa.findPda(programId, [
    Buffer.from(TREASURY_SEED, 'utf-8'),
  ]);
}

/** Reward amount for burning a Core asset (0.1 SOL in lamports) */
export const CORE_ASSET_REWARD = 100_000_000n;

/** Reward amount for burning a Bubblegum V2 cNFT (1 SOL in lamports) */
export const BUBBLEGUM_V2_REWARD = 1_000_000_000n;
