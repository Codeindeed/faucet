import { AssetV1 } from "@metaplex-foundation/mpl-core";
import { challenge0, challenge1, challenge2, challenge3, challenge4 } from "@metaplex-foundation/mpl-faucet";

export const filterChallenge0 = (assets: AssetV1[]) => 
  assets.filter(a => {
    // Basic asset has NO plugins of the tested types
    // We check existence of these plugin arrays/objects
    const hasAttributes = a.attributes !== undefined;
    const hasEdition = a.edition !== undefined;
    // Using any for safety if types are slightly off, but trying to be specific
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasAppDatas = (a as any).appDatas?.length > 0; 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasLinkedAppDatas = (a as any).linkedAppDatas?.length > 0;
    return !hasAttributes && !hasEdition && !hasAppDatas && !hasLinkedAppDatas;
  });

export const filterChallenge1 = (assets: AssetV1[]) => 
  assets.filter(a => a.attributes !== undefined);

export const filterChallenge2 = (assets: AssetV1[]) => 
  assets.filter(a => a.edition !== undefined);

export const filterChallenge3 = (assets: AssetV1[]) => 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assets.filter(a => (a as any).appDatas?.some((p: any) => 
    (p.dataAuthority?.type === 'UpdateAuthority' || p.dataAuthority?.__kind === 'UpdateAuthority' || p.dataAuthority === 'UpdateAuthority') ||
    (p.authority?.type === 'UpdateAuthority' || p.authority?.__kind === 'UpdateAuthority' || p.authority === 'UpdateAuthority')
  ));

export const filterChallenge4 = (assets: AssetV1[]) => 
  assets.filter(a => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const linked = (a as any).linkedAppDatas;
    return linked !== undefined && linked.length > 0;
  });

export const getAssetsForChallenge = (index: number, assets: AssetV1[]) => {
  const filters = [filterChallenge0, filterChallenge1, filterChallenge2, filterChallenge3, filterChallenge4];
  return filters[index] ? filters[index](assets) : [];
};

export const getBurnFunction = (index: number) => {
  const functions = [challenge0, challenge1, challenge2, challenge3, challenge4];
  return functions[index];
};
