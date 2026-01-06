import { UmiPlugin } from '@metaplex-foundation/umi';
import { createMplFaucetProgram } from './generated';

export const mplFaucet = (): UmiPlugin => ({
  install(umi) {
    umi.programs.add(createMplFaucetProgram(), false);
  },
});
