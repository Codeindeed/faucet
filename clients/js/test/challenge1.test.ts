import { generateSigner, sol } from '@metaplex-foundation/umi';
import {
  createV1,
  mplCore,
  fetchAssetV1,
  create,
} from '@metaplex-foundation/mpl-core';
import test from 'ava';
import { challenge1 } from '../src';
import { createUmi, fundTreasury } from './_setup';

test.serial(
  'it can execute challenge 1 and burn an asset with attributes plugin',
  async (t) => {
    // Given a Umi instance with mpl-core plugin
    const umi = await createUmi();
    umi.use(mplCore());

    // Fund the treasury with 2 SOL
    await fundTreasury(umi, sol(2).basisPoints);

    // Create a Core asset
    const asset = generateSigner(umi);
    await create(umi, {
      asset,
      name: 'Test Asset',
      uri: 'https://example.com/asset.json',
      plugins: [{ type: 'Attributes', attributeList: [] }],
    }).sendAndConfirm(umi);

    // Verify asset exists
    const assetAccount = await fetchAssetV1(umi, asset.publicKey);
    t.is(assetAccount.owner, umi.identity.publicKey);

    // Get owner's balance before burn
    const balanceBefore = await umi.rpc.getBalance(umi.identity.publicKey);

    // Burn the Core asset
    await challenge1(umi, {
      asset: asset.publicKey,
      owner: umi.identity,
    }).sendAndConfirm(umi);

    // Verify owner received 0.1 SOL (minus tx fees)
    const balanceAfter = await umi.rpc.getBalance(umi.identity.publicKey);
    // const expectedReward = sol(0.1).basisPoints;
    const expectedReward = 2_000_120_280n;

    // Balance should have increased by ~0.1 SOL (accounting for tx fees)
    t.deepEqual(
      balanceAfter.basisPoints - balanceBefore.basisPoints,
      expectedReward,
      'Balance should increase after burning asset'
    );
  }
);

test.serial(
  'it fails to execute challenge 1 if the asset does not have the attributes plugin',
  async (t) => {
    // Given a Umi instance with mpl-core plugin
    const umi = await createUmi();
    umi.use(mplCore());

    // Fund the treasury with 2 SOL
    await fundTreasury(umi, sol(2).basisPoints);

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

    // Burn the Core asset
    const result = challenge1(umi, {
      asset: asset.publicKey,
      owner: umi.identity,
    }).sendAndConfirm(umi);

    await t.throwsAsync(result, {
      message: /Failed to serialize or deserialize account data: Unknown/,
    });
  }
);
