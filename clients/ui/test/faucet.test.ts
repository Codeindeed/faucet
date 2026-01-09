import assert from 'node:assert';
import { test, describe } from 'node:test';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner, publicKey } from '@metaplex-foundation/umi';
import {
  mplFaucet,
  MPL_FAUCET_PROGRAM_ID,
  findTreasuryPda,
  findProofPda,
  TREASURY_SEED,
  CORE_ASSET_REWARD,
  BUBBLEGUM_V2_REWARD,
  challenge0,
  challenge1,
  challenge2,
  challenge3,
  challenge4,
} from '../lib/faucet';

// Create a mock Umi context for testing
function createTestUmi() {
  const umi = createUmi('https://api.devnet.solana.com');
  umi.use(mplFaucet());
  return umi;
}

describe('mplFaucet plugin', () => {
  test('registers the program correctly', () => {
    const umi = createTestUmi();
    const program = umi.programs.get('mplFaucet');
    assert.strictEqual(program.name, 'mplFaucet');
    assert.strictEqual(program.publicKey, MPL_FAUCET_PROGRAM_ID);
  });

  test('MPL_FAUCET_PROGRAM_ID is correct', () => {
    assert.strictEqual(MPL_FAUCET_PROGRAM_ID, 'FAUCp7gqwz4tv1XpxqBQ3J9p8kVATc2m1bvMvHvhg9A3');
  });
});

describe('Constants', () => {
  test('TREASURY_SEED is correct', () => {
    assert.strictEqual(TREASURY_SEED, 'treasury');
  });

  test('CORE_ASSET_REWARD is 0.1 SOL', () => {
    assert.strictEqual(CORE_ASSET_REWARD, BigInt(100_000_000));
  });

  test('BUBBLEGUM_V2_REWARD is 1 SOL', () => {
    assert.strictEqual(BUBBLEGUM_V2_REWARD, BigInt(1_000_000_000));
  });
});

describe('PDA derivation', () => {
  test('findTreasuryPda derives a valid PDA', () => {
    const umi = createTestUmi();
    const treasuryPda = findTreasuryPda(umi);
    
    assert.ok(Array.isArray(treasuryPda), 'Treasury PDA should be an array (Pda type)');
    assert.ok(treasuryPda.length >= 1, 'Treasury PDA should have at least one element');
    assert.strictEqual(typeof treasuryPda[0], 'string', 'First element should be the public key string');
  });

  test('findTreasuryPda returns consistent results', () => {
    const umi = createTestUmi();
    const pda1 = findTreasuryPda(umi);
    const pda2 = findTreasuryPda(umi);
    
    assert.strictEqual(pda1[0], pda2[0], 'Same inputs should produce same PDA');
  });

  test('findProofPda derives a valid PDA for each challenge', () => {
    const umi = createTestUmi();
    const owner = generateSigner(umi).publicKey;
    
    for (let i = 0; i < 5; i++) {
      const proofPda = findProofPda(umi, { challenge: i, owner });
      assert.ok(Array.isArray(proofPda), `Proof PDA for challenge ${i} should be an array`);
      assert.ok(proofPda.length >= 1, `Proof PDA for challenge ${i} should have at least one element`);
    }
  });

  test('findProofPda returns different PDAs for different challenges', () => {
    const umi = createTestUmi();
    const owner = generateSigner(umi).publicKey;
    
    const pda0 = findProofPda(umi, { challenge: 0, owner });
    const pda1 = findProofPda(umi, { challenge: 1, owner });
    
    assert.notStrictEqual(pda0[0], pda1[0], 'Different challenges should produce different PDAs');
  });

  test('findProofPda returns different PDAs for different owners', () => {
    const umi = createTestUmi();
    const owner1 = generateSigner(umi).publicKey;
    const owner2 = generateSigner(umi).publicKey;
    
    const pda1 = findProofPda(umi, { challenge: 0, owner: owner1 });
    const pda2 = findProofPda(umi, { challenge: 0, owner: owner2 });
    
    assert.notStrictEqual(pda1[0], pda2[0], 'Different owners should produce different PDAs');
  });
});

describe('Challenge instruction builders', () => {
  test('challenge0 builds a valid transaction', () => {
    const umi = createTestUmi();
    const owner = generateSigner(umi);
    const asset = publicKey('AssetXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    
    const tx = challenge0(umi, { asset, owner });
    
    assert.ok(tx, 'Transaction builder should be returned');
    assert.ok(typeof tx.getInstructions === 'function', 'Should have getInstructions method');
    
    const instructions = tx.getInstructions();
    assert.strictEqual(instructions.length, 1, 'Should have exactly one instruction');
    assert.strictEqual(instructions[0].programId, MPL_FAUCET_PROGRAM_ID, 'Instruction should target faucet program');
  });

  test('challenge1 builds a valid transaction', () => {
    const umi = createTestUmi();
    const owner = generateSigner(umi);
    const asset = publicKey('AssetXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    
    const tx = challenge1(umi, { asset, owner });
    const instructions = tx.getInstructions();
    
    assert.strictEqual(instructions.length, 1);
    assert.strictEqual(instructions[0].programId, MPL_FAUCET_PROGRAM_ID);
  });

  test('challenge2 builds a valid transaction', () => {
    const umi = createTestUmi();
    const owner = generateSigner(umi);
    const asset = publicKey('AssetXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    
    const tx = challenge2(umi, { asset, owner });
    const instructions = tx.getInstructions();
    
    assert.strictEqual(instructions.length, 1);
    assert.strictEqual(instructions[0].programId, MPL_FAUCET_PROGRAM_ID);
  });

  test('challenge3 builds a valid transaction', () => {
    const umi = createTestUmi();
    const owner = generateSigner(umi);
    const asset = publicKey('AssetXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    
    const tx = challenge3(umi, { asset, owner });
    const instructions = tx.getInstructions();
    
    assert.strictEqual(instructions.length, 1);
    assert.strictEqual(instructions[0].programId, MPL_FAUCET_PROGRAM_ID);
  });

  test('challenge4 builds a valid transaction', () => {
    const umi = createTestUmi();
    const owner = generateSigner(umi);
    const asset = publicKey('AssetXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    
    const tx = challenge4(umi, { asset, owner });
    const instructions = tx.getInstructions();
    
    assert.strictEqual(instructions.length, 1);
    assert.strictEqual(instructions[0].programId, MPL_FAUCET_PROGRAM_ID);
  });

  test('challenge instructions have correct number of accounts', () => {
    const umi = createTestUmi();
    const owner = generateSigner(umi);
    const asset = publicKey('AssetXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    
    const tx = challenge0(umi, { asset, owner });
    const instructions = tx.getInstructions();
    
    // Should have 7 accounts: asset, collection, owner, proof, treasury, mplCoreProgram, systemProgram
    assert.strictEqual(instructions[0].keys.length, 7, 'Should have 7 account keys');
  });

  test('challenge instructions include owner as signer', () => {
    const umi = createTestUmi();
    const owner = generateSigner(umi);
    const asset = publicKey('AssetXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    
    const tx = challenge0(umi, { asset, owner });
    const instructions = tx.getInstructions();
    
    // Owner is at index 2
    const ownerKey = instructions[0].keys[2];
    assert.strictEqual(ownerKey.isSigner, true, 'Owner should be a signer');
    assert.strictEqual(ownerKey.isWritable, true, 'Owner should be writable');
  });

  test('different challenges have different discriminators', () => {
    const umi = createTestUmi();
    const owner = generateSigner(umi);
    const asset = publicKey('AssetXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    
    const tx0 = challenge0(umi, { asset, owner });
    const tx1 = challenge1(umi, { asset, owner });
    
    const data0 = tx0.getInstructions()[0].data;
    const data1 = tx1.getInstructions()[0].data;
    
    // First byte is the discriminator
    assert.notStrictEqual(data0[0], data1[0], 'Discriminators should be different');
    assert.strictEqual(data0[0], 0, 'Challenge 0 discriminator should be 0');
    assert.strictEqual(data1[0], 1, 'Challenge 1 discriminator should be 1');
  });
});
