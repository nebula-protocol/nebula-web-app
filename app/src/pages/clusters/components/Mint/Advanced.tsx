import { WalletIcon } from '@nebula-js/icons';
import { demicrofy, formatUTokenDecimal2, microfy } from '@nebula-js/notation';
import { terraswap, Token } from '@nebula-js/types';
import { EmptyButton, TokenInput, TokenSpan } from '@nebula-js/ui';
import { ClusterInfo } from '@nebula-js/webapp-fns';
import { useTerraBalancesQuery } from '@nebula-js/webapp-provider';
import { TokenInputRemoveTool } from 'components/form/TokenInputRemoveTool';
import { fixHMR } from 'fix-hmr';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

export interface MintAdvancedProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function MintAdvancedBase({
  className,
  clusterInfo: { clusterState, assetTokenInfoIndex },
}: MintAdvancedProps) {
  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { data: { balancesIndex } = {} } = useTerraBalancesQuery(
    clusterState.assets,
  );

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [assets, setAssets] = useState<Set<terraswap.AssetInfo>>(
    // TODO empty set
    () => new Set(clusterState.assets.slice(0, 2)),
  );

  const [amounts, setAmounts] = useState<Map<terraswap.AssetInfo, Token>>(
    () => new Map(),
  );

  const addedAssets = useMemo(() => {
    return clusterState.assets.filter((asset) => {
      return assets.has(asset);
    });
  }, [assets, clusterState.assets]);

  const remainAssets = useMemo(() => {
    return clusterState.assets.filter((asset) => {
      return !assets.has(asset);
    });
  }, [assets, clusterState.assets]);

  const invalidAmounts = useMemo(() => {
    const map = new Map();

    for (const asset of assets) {
      const amount = amounts.get(asset);
      const balance = balancesIndex?.get(asset);

      if (
        balance &&
        amount &&
        amount.length > 0 &&
        microfy(amount).gt(balance)
      ) {
        map.set(asset, 'Not enough assets');
      }
    }

    return map;
  }, [amounts, assets, balancesIndex]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const addAsset = useCallback((asset: terraswap.AssetInfo) => {
    setAssets((prev) => {
      const next = new Set(prev);
      next.add(asset);
      return next;
    });
  }, []);

  const removeAsset = useCallback((asset: terraswap.AssetInfo) => {
    setAssets((prev) => {
      const next = new Set(prev);
      return next.delete(asset) ? next : prev;
    });
  }, []);

  const updateAmount = useCallback(
    (asset: terraswap.AssetInfo, amount: Token) => {
      setAmounts((prev) => {
        const next = new Map(prev);
        next.set(asset, amount);
        return next;
      });
    },
    [],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <div className={className}>
      <ul className="added-tokens">
        {addedAssets.length > 0 &&
          addedAssets.map((asset, i) => (
            <li key={'added-asset' + i}>
              <TokenInput<Token>
                maxDecimalPoints={6}
                value={amounts.get(asset) ?? ('' as Token)}
                onChange={(nextAmount) => updateAmount(asset, nextAmount)}
                placeholder="0.00"
                label={assetTokenInfoIndex.get(asset)!.symbol}
                token={
                  <TokenSpan>
                    {assetTokenInfoIndex.get(asset)!.symbol}
                  </TokenSpan>
                }
                suggest={
                  balancesIndex?.has(asset) && (
                    <EmptyButton
                      onClick={() =>
                        updateAmount(
                          asset,
                          demicrofy(
                            balancesIndex.get(asset)!,
                          ).toFixed() as Token,
                        )
                      }
                    >
                      <WalletIcon
                        style={{
                          transform: 'translate(-0.3em, -0.1em)',
                        }}
                      />{' '}
                      {formatUTokenDecimal2(balancesIndex.get(asset)!)}{' '}
                      {assetTokenInfoIndex.get(asset)!.symbol}
                    </EmptyButton>
                  )
                }
                error={invalidAmounts.get(asset)}
              >
                <TokenInputRemoveTool onDelete={() => removeAsset(asset)}>
                  Target:{' '}
                  <s>1,000,000 {assetTokenInfoIndex.get(asset)!.symbol}</s>
                </TokenInputRemoveTool>
              </TokenInput>
            </li>
          ))}
      </ul>

      <h3>Remain</h3>

      <ul>
        {remainAssets.length > 0 &&
          remainAssets.map((asset, i) => (
            <li key={'remain-asset' + i} onClick={() => addAsset(asset)}>
              {assetTokenInfoIndex.get(asset)!.symbol}
            </li>
          ))}
      </ul>
    </div>
  );
}

export const StyledMintAdvanced = styled(MintAdvancedBase)`
  .added-tokens {
    list-style: none;
    padding: 0;

    display: flex;
    flex-direction: column;
    gap: 2.28571429em;
  }
`;

export const MintAdvanced = fixHMR(StyledMintAdvanced);
