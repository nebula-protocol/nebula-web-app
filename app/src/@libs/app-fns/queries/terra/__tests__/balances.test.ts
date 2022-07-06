import { terraBalancesQuery } from '@libs/app-fns';
import { TEST_LCD_CLIENT, TEST_WALLET_ADDRESS } from '@libs/app-fns/test-env';
import { terraswap } from '@libs/types';

const assetInfos: terraswap.AssetInfo[] = [
  {
    native_token: {
      denom: 'uluna',
    },
  },
  {
    token: {
      // NEB
      contract_addr:
        'terra103g6fdulfjl2vqc6xgme73q40syu2huw8ustpy9xg674a67sqavq62h54m',
    },
  },
] as any;

describe('terraBalancesQuery()', () => {
  test('should get result from lcd client', async () => {
    const result = await terraBalancesQuery(
      TEST_WALLET_ADDRESS,
      assetInfos,
      TEST_LCD_CLIENT,
    );

    expect(result.balances[0].asset).toEqual({
      native_token: { denom: 'uluna' },
    });
    expect(result.balances[1].asset).toEqual({
      token: {
        contract_addr:
          'terra103g6fdulfjl2vqc6xgme73q40syu2huw8ustpy9xg674a67sqavq62h54m',
      },
    });
    expect(+result.balances[0].balance).not.toBeNaN();
    expect(+result.balances[1].balance).not.toBeNaN();
    expect(result.balancesIndex.size).toBe(2);
  });

  // TODO: support hive client
});
