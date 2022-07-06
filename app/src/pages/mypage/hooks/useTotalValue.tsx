import { useMemo } from 'react';
import { sum } from '@libs/big-math';
import big, { Big } from 'big.js';
import {
  useGovStakerQuery,
  useIncentiveRewardQuery,
  useMypageHoldingsQuery,
  useMypageStakingQuery,
  useNebulaApp,
} from '../../../@nebula-js/app-provider';
import { u, Luna, NEB, Token } from '@nebula-js/types';
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
  const { data: _inventiveReward } = useIncentiveRewardQuery();

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
          const value = big(balance).mul(price) as u<Luna<Big>>;

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
    return sum(...holdings.map(({ value }) => value)) as u<Luna<Big>>;
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
          ) as u<Luna<Big>>;

        const withdrawableValue = withdrawableToken.mul(
          terraswapPoolInfo.tokenPrice,
        ) as u<Luna<Big>>;

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
            : big(0)) as u<Luna<Big>>,
          to: `/staking/${tokenAddr}/unstake`,
        };
      },
    );
  }, [stakingData, nebInfo]);

  const stakingsTotal = useMemo(() => {
    return stakings.reduce(
      (total, { rewardAmount, rewardAmountValue, withdrawableValue }) => {
        total.farmValue = total.farmValue.plus(withdrawableValue) as u<
          Luna<Big>
        >;
        total.reward = total.reward.plus(rewardAmount) as u<NEB<Big>>;
        total.rewardValue = total.rewardValue.plus(rewardAmountValue) as u<
          Luna<Big>
        >;
        return total;
      },
      {
        farmValue: big(0) as u<Luna<Big>>,
        reward: big(0) as u<NEB<Big>>,
        rewardValue: big(0) as u<Luna<Big>>,
      },
    );
  }, [stakings]);

  const govValues = {
    stakedNeb: big(govStaker?.balance || '0') as u<NEB<Big>>,
    votingReward: big(govStaker?.pending_voting_rewards || '0') as u<NEB<Big>>,
  };
  const govVotingRewardValue = big(
    govStaker?.pending_voting_rewards || '0',
  ).mul(nebInfo?.terraswapPoolInfo?.tokenPrice || '1');

  const incentiveReward = big(
    _inventiveReward?.incentiveReward.pending_rewards ?? '0',
  ) as u<NEB<Big>>;

  const incentiveRewardValue = big(incentiveReward).mul(
    nebInfo?.terraswapPoolInfo?.tokenPrice || '1',
  );

  return {
    totalHoldingsValue,
    totalStakingValue: stakingsTotal.farmValue,
    totalGovValue: big(govStaker?.balance || '0').mul(
      nebInfo?.terraswapPoolInfo?.tokenPrice || '1',
    ) as u<Luna<Big>>,
    stakingReward: stakingsTotal.reward,
    govReward: govValues.votingReward,
    incentiveReward,
    totalReward: stakingsTotal.reward
      .plus(govValues.votingReward)
      .plus(incentiveReward) as u<NEB<Big>>,
    totalRewardValue: stakingsTotal.rewardValue
      .plus(govVotingRewardValue)
      .plus(incentiveRewardValue) as u<Luna<Big>>,
    stakingsTotal,
    govValues,
    nebPrice: nebInfo?.terraswapPoolInfo?.tokenPrice || '0',
  };
};

export { useTotalValue };
