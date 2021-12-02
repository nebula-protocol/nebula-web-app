import { useMemo } from 'react';
import { sum } from '@libs/big-math';
import big, { Big } from 'big.js';
import {
  useGovStakerQuery,
  useMypageHoldingsQuery,
  useMypageStakingQuery,
  useNebulaApp,
} from '../../../@nebula-js/app-provider';
import { u, UST, NEB, Token } from '@nebula-js/types';
import { useCW20PoolInfoQuery } from '../../../@libs/app-provider';
import { useConnectedWallet } from '@terra-money/use-wallet';

const useTotalValue = () => {
  const connectedWallet = useConnectedWallet();
  const { contractAddress } = useNebulaApp();
  const { data: holdingData = [] } = useMypageHoldingsQuery();
  const { data: stakingData = [] } = useMypageStakingQuery();
  const { data: nebInfo } = useCW20PoolInfoQuery<NEB>(contractAddress.cw20.NEB);
  const { data: { govStaker } = {} } = useGovStakerQuery(
    connectedWallet?.walletAddress,
  );

  const holdings = useMemo(() => {
    return holdingData
      .filter(({ tokenBalance }) => big(tokenBalance.balance).gt(0))
      .map(
        ({
          tokenAddr,
          tokenInfo,
          tokenBalance,
          terraswapPoolInfo,
          clusterState,
        }) => {
          const price = terraswapPoolInfo.tokenPrice;
          const balance = tokenBalance.balance;
          const value = big(balance).mul(price) as u<UST<Big>>;

          return {
            symbol: tokenInfo.symbol,
            name: tokenInfo.name,
            price,
            balance,
            value,
            to:
              tokenAddr === contractAddress.cw20.NEB
                ? `/gov/trade`
                : `/clusters/${clusterState?.cluster_contract_address}/buy`,
          };
        },
      );
  }, [contractAddress.cw20.NEB, holdingData]);

  const totalHoldingsValue = useMemo(() => {
    return sum(...holdings.map(({ value }) => value)) as u<UST<Big>>;
  }, [holdings]);

  const stakings = useMemo(() => {
    return stakingData.map(
      ({ tokenAddr, tokenInfo, rewardInfo, terraswapPoolInfo }) => {
        const withdrawableToken = big(terraswapPoolInfo.tokenPoolSize)
          .mul(rewardInfo.bond_amount)
          .div(
            terraswapPoolInfo.lpShare === '0' ? 1 : terraswapPoolInfo.lpShare,
          ) as u<Token<Big>>;

        const withdrawableUst = big(terraswapPoolInfo.ustPoolSize)
          .mul(rewardInfo.bond_amount)
          .div(
            terraswapPoolInfo.lpShare === '0' ? 1 : terraswapPoolInfo.lpShare,
          ) as u<UST<Big>>;

        const withdrawableValue = withdrawableToken.mul(
          terraswapPoolInfo.tokenPrice,
        ) as u<UST<Big>>;

        return {
          symbol: tokenInfo.symbol,
          staked: rewardInfo.bond_amount,
          withdrawableToken,
          withdrawableUst,
          withdrawableValue,
          rewardAmount: rewardInfo.pending_reward,
          rewardAmountValue: (nebInfo
            ? big(rewardInfo.pending_reward).mul(
                nebInfo.terraswapPoolInfo.tokenPrice,
              )
            : big(0)) as u<UST<Big>>,
          to: `/staking/${tokenAddr}/unstake`,
        };
      },
    );
  }, [stakingData, nebInfo]);

  const stakingsTotal = useMemo(() => {
    return stakings.reduce(
      (total, { rewardAmount, rewardAmountValue, withdrawableValue }) => {
        total.farmValue = total.farmValue.plus(withdrawableValue) as u<
          UST<Big>
        >;
        total.reward = total.reward.plus(rewardAmount) as u<NEB<Big>>;
        total.rewardValue = total.rewardValue.plus(rewardAmountValue) as u<
          UST<Big>
        >;
        return total;
      },
      {
        farmValue: big(0) as u<UST<Big>>,
        reward: big(0) as u<NEB<Big>>,
        rewardValue: big(0) as u<UST<Big>>,
      },
    );
  }, [stakings]);

  // ? big(rewardInfo.pending_reward).mul(
  //   nebInfo.terraswapPoolInfo.tokenPrice,
  // )

  const govValues = {
    stakedNeb: big(govStaker?.balance || '0') as u<NEB<Big>>,
    votingReward: big(govStaker?.pending_voting_rewards || '0') as u<NEB<Big>>,
  };
  const govVotingRewardValue = big(
    govStaker?.pending_voting_rewards || '0',
  ).mul(nebInfo?.terraswapPoolInfo?.tokenPrice || '1');

  return {
    totalHoldingsValue,
    totalStakingValue: stakingsTotal.farmValue,
    totalGovValue: big(govStaker?.balance || '0').mul(
      nebInfo?.terraswapPoolInfo?.tokenPrice || '1',
    ) as u<UST<Big>>,
    totalRewardValue: stakingsTotal.rewardValue.plus(govVotingRewardValue) as u<
      UST<Big>
    >,
    stakingsTotal,
    govValues,
  };
};

export { useTotalValue };
