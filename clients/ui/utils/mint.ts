import { createV1, create, createCollection, writeData, ExternalPluginAdapterSchema, fetchAssetsByOwner, AssetV1 } from "@metaplex-foundation/mpl-core";
import { generateSigner, Umi } from "@metaplex-foundation/umi";

export const mintChallenge0 = async (umi: Umi) => {
  const asset = generateSigner(umi);
  return await createV1(umi, { asset, name: 'Challenge 1 - Basic Asset', uri: 'https://example.com/asset.json' }).sendAndConfirm(umi);
};

export const mintChallenge1 = async (umi: Umi) => {
  const asset = generateSigner(umi);
  return await create(umi, { asset, name: 'Challenge 2 - Attributes', uri: 'https://example.com/asset.json', plugins: [{ type: 'Attributes', attributeList: [] }] }).sendAndConfirm(umi);
};

export const mintChallenge2 = async (umi: Umi) => {
  const collection = generateSigner(umi);
  const asset = generateSigner(umi);
  
  return await createCollection(umi, { 
    collection, 
    name: 'Edition Collection', 
    uri: 'https://example.com/collection.json', 
    plugins: [{ type: 'MasterEdition' }] 
  })
  .add(create(umi, { 
    asset,
    collection,
    name: 'Challenge 3 - Edition', 
    uri: 'https://example.com/asset.json', 
    plugins: [{ type: 'Edition', number: 1 }] 
  }))
  .sendAndConfirm(umi);
};

export const mintChallenge3 = async (umi: Umi) => {
  const asset = generateSigner(umi);
  return await create(umi, { asset, name: 'Challenge 4 - AppData', uri: 'https://example.com/asset.json', plugins: [{ type: 'AppData', schema: ExternalPluginAdapterSchema.Binary, dataAuthority: { type: 'UpdateAuthority' } }] }).sendAndConfirm(umi);
};

export const mintChallenge4 = async (umi: Umi, onAssetFound?: (assets: AssetV1[]) => void) => {
  const collection = generateSigner(umi);
  const asset = generateSigner(umi);
  
  await createCollection(umi, { 
    collection, 
    name: 'LinkedAppData Collection', 
    uri: 'https://example.com/collection.json', 
    plugins: [{ type: 'LinkedAppData', schema: ExternalPluginAdapterSchema.Binary, dataAuthority: { type: 'UpdateAuthority' } }] 
  })
  .add(create(umi, { 
    asset,
    collection,
    name: 'Challenge 5 - LinkedAppData', 
    uri: 'https://example.com/asset.json' 
  }))
  .sendAndConfirm(umi);
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await writeData(umi, { 
    asset: asset.publicKey, 
    collection: collection.publicKey, 
    key: { type: 'LinkedAppData', dataAuthority: { type: 'UpdateAuthority' } }, 
    data: new Uint8Array([1]) 
  }).sendAndConfirm(umi);

  // Poll for asset
  for (let i = 0; i < 15; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const assets = await fetchAssetsByOwner(umi, umi.identity.publicKey);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c4Asset = assets.find(a => (a as unknown as { linkedAppDatas: any[] }).linkedAppDatas?.length > 0);
    if (c4Asset) {
      if (onAssetFound) onAssetFound(assets);
      return;
    }
  }
};

export const getMintFunction = (index: number) => {
  const basicMinters = [mintChallenge0, mintChallenge1, mintChallenge2, mintChallenge3];
  if (index < 4) return basicMinters[index];
  return mintChallenge4; 
};
