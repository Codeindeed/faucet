import {
  Context,
  Pda,
  PublicKey,
  Signer,
  TransactionBuilder,
  publicKey,
  transactionBuilder,
  AccountMeta,
  isSigner,
  isPda,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  mapSerializer,
  struct,
  u8,
} from '@metaplex-foundation/umi/serializers';
import { findTreasuryPda, findProofPda } from './pdas';

// Shared helpers
type ResolvedAccount<T = PublicKey | Pda | Signer | null> = {
  isWritable: boolean;
  value: T;
};

type ResolvedAccountsWithIndices = Record<
  string,
  ResolvedAccount & { index: number }
>;

function expectPublicKey(value: PublicKey | Pda | Signer | null | undefined): PublicKey {
  if (!value) {
    throw new Error('Expected a PublicKey.');
  }
  return publicKey(value, false);
}

function getAccountMetasAndSigners(
  accounts: ResolvedAccount[],
  optionalAccountStrategy: 'omitted' | 'programId',
  programId: PublicKey
): [AccountMeta[], Signer[]] {
  const keys: AccountMeta[] = [];
  const signers: Signer[] = [];

  accounts.forEach((account) => {
    if (!account.value) {
      if (optionalAccountStrategy === 'omitted') return;
      keys.push({ pubkey: programId, isSigner: false, isWritable: false });
      return;
    }

    if (isSigner(account.value)) {
      signers.push(account.value);
    }
    keys.push({
      pubkey: publicKey(account.value, false),
      isSigner: isSigner(account.value),
      isWritable: account.isWritable,
    });
  });

  return [keys, signers];
}

// Instruction accounts type
export type ChallengeInstructionAccounts = {
  asset: PublicKey | Pda;
  collection?: PublicKey | Pda;
  owner: Signer;
  proof?: PublicKey | Pda;
  treasury?: PublicKey | Pda;
  mplCoreProgram?: PublicKey | Pda;
  systemProgram?: PublicKey | Pda;
};

// Generic challenge instruction builder
function buildChallengeInstruction(
  context: Pick<Context, 'eddsa' | 'programs'>,
  input: ChallengeInstructionAccounts,
  discriminator: number
): TransactionBuilder {
  const programId = context.programs.getPublicKey(
    'mplFaucet',
    'FAUCp7gqwz4tv1XpxqBQ3J9p8kVATc2m1bvMvHvhg9A3'
  );

  const resolvedAccounts = {
    asset: { index: 0, isWritable: true, value: input.asset ?? null },
    collection: { index: 1, isWritable: true, value: input.collection ?? null },
    owner: { index: 2, isWritable: true, value: input.owner ?? null },
    proof: { index: 3, isWritable: true, value: input.proof ?? null },
    treasury: { index: 4, isWritable: true, value: input.treasury ?? null },
    mplCoreProgram: { index: 5, isWritable: false, value: input.mplCoreProgram ?? null },
    systemProgram: { index: 6, isWritable: false, value: input.systemProgram ?? null },
  } satisfies ResolvedAccountsWithIndices;

  // Default values
  if (!resolvedAccounts.proof.value) {
    resolvedAccounts.proof.value = findProofPda(context, {
      challenge: discriminator,
      owner: expectPublicKey(resolvedAccounts.owner.value),
    });
  }
  if (!resolvedAccounts.treasury.value) {
    resolvedAccounts.treasury.value = findTreasuryPda(context);
  }
  if (!resolvedAccounts.mplCoreProgram.value) {
    resolvedAccounts.mplCoreProgram.value = publicKey('CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d');
  }
  if (!resolvedAccounts.systemProgram.value) {
    resolvedAccounts.systemProgram.value = context.programs.getPublicKey(
      'splSystem',
      '11111111111111111111111111111111'
    );
    resolvedAccounts.systemProgram.isWritable = false;
  }

  const orderedAccounts: ResolvedAccount[] = Object.values(resolvedAccounts).sort(
    (a, b) => a.index - b.index
  );

  const [keys, signers] = getAccountMetasAndSigners(orderedAccounts, 'programId', programId);

  // Serialize data with discriminator
  const data = struct<{ discriminator: number }>([['discriminator', u8()]])
    .serialize({ discriminator });

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain: 0 },
  ]);
}

// Challenge instruction builders
export function challenge0(
  context: Pick<Context, 'eddsa' | 'programs'>,
  input: ChallengeInstructionAccounts
): TransactionBuilder {
  return buildChallengeInstruction(context, input, 0);
}

export function challenge1(
  context: Pick<Context, 'eddsa' | 'programs'>,
  input: ChallengeInstructionAccounts
): TransactionBuilder {
  return buildChallengeInstruction(context, input, 1);
}

export function challenge2(
  context: Pick<Context, 'eddsa' | 'programs'>,
  input: ChallengeInstructionAccounts
): TransactionBuilder {
  return buildChallengeInstruction(context, input, 2);
}

export function challenge3(
  context: Pick<Context, 'eddsa' | 'programs'>,
  input: ChallengeInstructionAccounts
): TransactionBuilder {
  return buildChallengeInstruction(context, input, 3);
}

export function challenge4(
  context: Pick<Context, 'eddsa' | 'programs'>,
  input: ChallengeInstructionAccounts
): TransactionBuilder {
  return buildChallengeInstruction(context, input, 4);
}
