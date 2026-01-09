import { UmiPlugin, Program, PublicKey, Context, ClusterFilter, ProgramError } from '@metaplex-foundation/umi';

// Program ID
export const MPL_FAUCET_PROGRAM_ID = 
  'FAUCp7gqwz4tv1XpxqBQ3J9p8kVATc2m1bvMvHvhg9A3' as PublicKey<'FAUCp7gqwz4tv1XpxqBQ3J9p8kVATc2m1bvMvHvhg9A3'>;

// Error handling
type ProgramErrorConstructor = new (program: Program, cause?: Error) => ProgramError;
const codeToErrorMap: Map<number, ProgramErrorConstructor> = new Map();
const nameToErrorMap: Map<string, ProgramErrorConstructor> = new Map();

export class InvalidSystemProgramError extends ProgramError {
  override readonly name: string = 'InvalidSystemProgram';
  readonly code: number = 0x0;
  constructor(program: Program, cause?: Error) {
    super('Invalid System Program', program, cause);
  }
}
codeToErrorMap.set(0x0, InvalidSystemProgramError);
nameToErrorMap.set('InvalidSystemProgram', InvalidSystemProgramError);

export class DeserializationErrorError extends ProgramError {
  override readonly name: string = 'DeserializationError';
  readonly code: number = 0x1;
  constructor(program: Program, cause?: Error) {
    super('Error deserializing account', program, cause);
  }
}
codeToErrorMap.set(0x1, DeserializationErrorError);
nameToErrorMap.set('DeserializationError', DeserializationErrorError);

export class InsufficientTreasuryBalanceError extends ProgramError {
  override readonly name: string = 'InsufficientTreasuryBalance';
  readonly code: number = 0x3;
  constructor(program: Program, cause?: Error) {
    super('Insufficient treasury balance', program, cause);
  }
}
codeToErrorMap.set(0x3, InsufficientTreasuryBalanceError);
nameToErrorMap.set('InsufficientTreasuryBalance', InsufficientTreasuryBalanceError);

export class InvalidProofDerivationError extends ProgramError {
  override readonly name: string = 'InvalidProofDerivation';
  readonly code: number = 0x7;
  constructor(program: Program, cause?: Error) {
    super('Invalid proof derivation', program, cause);
  }
}
codeToErrorMap.set(0x7, InvalidProofDerivationError);
nameToErrorMap.set('InvalidProofDerivation', InvalidProofDerivationError);

function getMplFaucetErrorFromCode(code: number, program: Program, cause?: Error): ProgramError | null {
  const constructor = codeToErrorMap.get(code);
  return constructor ? new constructor(program, cause) : null;
}

function getMplFaucetErrorFromName(name: string, program: Program, cause?: Error): ProgramError | null {
  const constructor = nameToErrorMap.get(name);
  return constructor ? new constructor(program, cause) : null;
}

// Program creation
export function createMplFaucetProgram(): Program {
  return {
    name: 'mplFaucet',
    publicKey: MPL_FAUCET_PROGRAM_ID,
    getErrorFromCode(code: number, cause?: Error) {
      return getMplFaucetErrorFromCode(code, this, cause);
    },
    getErrorFromName(name: string, cause?: Error) {
      return getMplFaucetErrorFromName(name, this, cause);
    },
    isOnCluster() {
      return true;
    },
  };
}

export function getMplFaucetProgram<T extends Program = Program>(
  context: Pick<Context, 'programs'>,
  clusterFilter?: ClusterFilter
): T {
  return context.programs.get<T>('mplFaucet', clusterFilter);
}

// Umi Plugin
export const mplFaucet = (): UmiPlugin => ({
  install(umi) {
    umi.programs.add(createMplFaucetProgram(), false);
  },
});
