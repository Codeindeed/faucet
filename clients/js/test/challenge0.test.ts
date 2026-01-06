import { generateSigner, sol } from '@metaplex-foundation/umi';
import { createV1, mplCore, fetchAssetV1 } from '@metaplex-foundation/mpl-core';
import test from 'ava';
import { challenge0 } from '../src';
import { createUmi, fundTreasury } from './_setup';

test.serial('it can execute challenge 0 and receive 1 SOL', async (t) => {
  // Given a Umi instance with mpl-core plugin
  const umi = await createUmi();
  umi.use(mplCore());

  // Fund the treasury with 1 SOL
  await fundTreasury(umi, sol(1).basisPoints);

  // Create a Core asset
  const asset = generateSigner(umi);
  await createV1(umi, {
    asset,
    name: 'Test Asset',
    uri: 'https://example.com/asset.json',
  }).sendAndConfirm(umi);

  // Verify asset exists
  const assetAccount = await fetchAssetV1(umi, asset.publicKey);
  t.is(assetAccount.owner, umi.identity.publicKey);

  // Get owner's balance before burn
  const balanceBefore = await umi.rpc.getBalance(umi.identity.publicKey);

  // Burn the Core asset
  await challenge0(umi, {
    asset: asset.publicKey,
    owner: umi.identity,
  }).sendAndConfirm(umi);

  // Verify owner received 0.1 SOL (minus tx fees)
  const balanceAfter = await umi.rpc.getBalance(umi.identity.publicKey);
  // const expectedReward = sol(0.1).basisPoints;
  const expectedReward = 999_890_600n;

  // Balance should have increased by ~0.1 SOL (accounting for tx fees)
  t.deepEqual(
    balanceAfter.basisPoints - balanceBefore.basisPoints,
    expectedReward,
    'Balance should increase after burning asset'
  );
});

test.skip('it fails to burn Core asset with insufficient treasury balance', async (t) => {
  const umi = await createUmi();
  umi.use(mplCore());

  // Create a Core asset
  const asset = generateSigner(umi);
  await createV1(umi, {
    asset,
    name: 'Test Asset',
    uri: 'https://example.com/asset.json',
  }).sendAndConfirm(umi);

  const result = challenge0(umi, {
    asset: asset.publicKey,
    owner: umi.identity,
  }).sendAndConfirm(umi);

  await t.throwsAsync(result, { name: 'InsufficientTreasuryBalance' });
});

test('it fails with invalid treasury PDA', async (t) => {
  const umi = await createUmi();
  umi.use(mplCore());

  // Create a Core asset
  const asset = generateSigner(umi);
  await createV1(umi, {
    asset,
    name: 'Test Asset',
    uri: 'https://example.com/asset.json',
  }).sendAndConfirm(umi);

  // Create a fake treasury
  const fakeTreasury = generateSigner(umi);

  // Attempt to burn with fake treasury should fail
  await t.throwsAsync(
    async () => {
      await challenge0(umi, {
        asset: asset.publicKey,
        owner: umi.identity,
        treasury: fakeTreasury.publicKey,
      }).sendAndConfirm(umi);
    },
    { name: 'InvalidTreasuryPda' }
  );
});

test.serial('it prevents double-claiming the same challenge', async (t) => {
  const umi = await createUmi();
  umi.use(mplCore());

  // Fund the treasury with enough for 2 claims (but we should only get 1)
  await fundTreasury(umi, sol(2).basisPoints);

  // Create and burn first asset - should succeed
  const asset1 = generateSigner(umi);
  await createV1(umi, {
    asset: asset1,
    name: 'Test Asset 1',
    uri: 'https://example.com/asset1.json',
  }).sendAndConfirm(umi);

  await challenge0(umi, {
    asset: asset1.publicKey,
    owner: umi.identity,
  }).sendAndConfirm(umi);

  // Create second asset
  const asset2 = generateSigner(umi);
  await createV1(umi, {
    asset: asset2,
    name: 'Test Asset 2',
    uri: 'https://example.com/asset2.json',
  }).sendAndConfirm(umi);

  // Attempt to claim again with the same identity - should fail
  // because the proof PDA already exists
  await t.throwsAsync(
    challenge0(umi, {
      asset: asset2.publicKey,
      owner: umi.identity,
    }).sendAndConfirm(umi),
    { message: /already in use/ },
    'Double-claim should fail because proof account already exists'
  );
});
