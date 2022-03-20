import { HumanAddr, u, NEB } from '@nebula-js/types';
import { QueryClient } from '@libs/query-client';
import { airdropIsClaimedQuery } from './isClaimed';

export interface Airdrop {
  delegator: string;
  proof: string; // JsonString<Array<string>>
  amount: u<NEB>;
  stage: number;
}

export async function airdropCheckQuery(
  walletAddress: HumanAddr | undefined,
  airdropContract: HumanAddr,
  chainId: string,
  queryClient: QueryClient,
): Promise<Airdrop | undefined> {
  if (
    !walletAddress ||
    !(chainId.startsWith('columbus') || chainId.startsWith('bombay'))
  )
    return undefined;

  try {
    const endpoint = chainId.startsWith('columbus')
      ? 'https://nebula-airdrop.vercel.app'
      : 'https://nebula-airdrop-bombay.vercel.app';

    const airdrop: Airdrop = await fetch(
      `${endpoint}/api/get?address=${walletAddress}`,
    ).then((res) => res.json());

    if (Object.keys(airdrop).length === 0) {
      return undefined;
    }

    // HARD-CODED because there is only one round.
    const stage = chainId.startsWith('columbus') ? 1 : 2;
    airdrop.stage = stage;

    const { isClaimed } = await airdropIsClaimedQuery(
      airdropContract,
      walletAddress,
      stage,
      queryClient,
    );

    if (!isClaimed.is_claimed) {
      return airdrop;
    }

    return undefined;
  } catch (e) {
    console.log(`Airdrop: ${e}`);
    return undefined;
  }
}