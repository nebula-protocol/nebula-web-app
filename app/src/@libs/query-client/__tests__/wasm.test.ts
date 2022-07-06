import { cw20, HumanAddr, Token } from '@libs/types';
import { WasmQuery, WasmQueryInput } from '../interface';
import { lcdFetch } from '../lcd/client';

describe('wasm query test', () => {
  test('should get wasm json result from lcd endpoint', async () => {
    const nebTokenAddress =
      'terra1d6gepuu0ykszjayvzzfddg2fqsqyjemdrg9xrahewgknawxfusmq5e0n0h';

    const balanceQuery = {
      balance: { address: 'terra12hnhh5vtyg5juqnzm43970nh4fw42pt27nw9g9' },
    };

    const res = await fetch(
      `https:///pisco-lcd.terra.dev/cosmwasm/wasm/v1/contract/${nebTokenAddress}/smart/${Buffer.from(
        JSON.stringify(balanceQuery),
      ).toString('base64')}`,
    );
    const data = await res.json();

    expect(typeof +data.data.balance).toBe('number');
  });

  interface TestQuery {
    neb: WasmQuery<cw20.Balance, cw20.BalanceResponse<Token>>;
  }

  const testQuery: WasmQueryInput<TestQuery> = {
    neb: {
      contractAddress:
        'terra103g6fdulfjl2vqc6xgme73q40syu2huw8ustpy9xg674a67sqavq62h54m' as HumanAddr,
      query: {
        balance: {
          address: 'terra12hnhh5vtyg5juqnzm43970nh4fw42pt27nw9g9' as HumanAddr,
        },
      },
    },
  };

  test('should get wasm json result from lcd client', async () => {
    const result = await lcdFetch<TestQuery>({
      wasmQuery: testQuery,
      lcdEndpoint: 'https://pisco-lcd.terra.dev',
    });

    expect(typeof +result.neb.balance).toBe('number');
  });

  // TODO: support hive client
  // test('should get wasm json result from hive client', async () => {
  //   const result = await hiveFetch<TestQuery>({
  //     wasmQuery: testQuery,
  //     hiveEndpoint: 'https://pisco-hive.terra.dev/graphql',
  //     variables: {},
  //   });

  //   console.log(result);

  //   expect(typeof +result.bluna.balance).toBe('number');
  //   expect(typeof +result.beth.balance).toBe('number');
  // });
});
