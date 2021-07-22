import { Add } from '@material-ui/icons';
import { WalletIcon } from '@nebula-js/icons';
import { demicrofy, formatUTokenInteger } from '@nebula-js/notation';
import { terraswap, Token, u } from '@nebula-js/types';
import { EmptyButton, TokenInput, TokenSpan } from '@nebula-js/ui';
import { ClusterInfo } from '@nebula-js/webapp-fns';
import { useClusterMintAdvancedForm } from '@nebula-js/webapp-provider';
import big from 'big.js';
import { useAssetSelectDialog } from 'components/dialogs/useAssetSelectDialog';
import { AddAssetTextButton } from 'components/form/AddAssetTextButton';
import { TokenInputRemoveTool } from 'components/form/TokenInputRemoveTool';
import { fixHMR } from 'fix-hmr';
import React, { useCallback } from 'react';
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
  // dependencies
  // ---------------------------------------------
  const [openAssetSelect, assetSelectElement] = useAssetSelectDialog();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [updateInput, states] = useClusterMintAdvancedForm({ clusterState });

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const addAsset = useCallback(
    (asset: terraswap.AssetInfo) => {
      updateInput((prev) => {
        const nextAddedAssets = new Set(prev.addedAssets);
        nextAddedAssets.add(asset);
        return {
          ...prev,
          addedAssets: nextAddedAssets,
        };
      });
    },
    [updateInput],
  );

  const removeAsset = useCallback(
    (asset: terraswap.AssetInfo) => {
      updateInput((prev) => {
        const nextAddedAssets = new Set(prev.addedAssets);
        return nextAddedAssets.delete(asset)
          ? {
              ...prev,
              addedAssets: nextAddedAssets,
            }
          : prev;
      });
    },
    [updateInput],
  );

  const updateAmount = useCallback(
    (asset: terraswap.AssetInfo, amount: Token) => {
      updateInput((prev) => {
        const index = clusterState.assets.findIndex(
          (targetAsset) => targetAsset === asset,
        );

        if (prev.amounts[index] === amount) {
          return prev;
        }

        const nextAmounts = [...prev.amounts];
        nextAmounts[index] = amount;

        return {
          ...prev,
          amounts: nextAmounts,
        };
      });
    },
    [clusterState.assets, updateInput],
  );

  const openAddAsset = useCallback(async () => {
    console.log('Advanced.tsx..() !!!');
    const selectedAsset = await openAssetSelect({
      title: 'Select Asset',
      assets: states.remainAssets,
      assetTokenInfoIndex,
    });

    if (selectedAsset) {
      addAsset(selectedAsset);
    }
  }, [addAsset, assetTokenInfoIndex, openAssetSelect, states.remainAssets]);

  //const proceed = useCallback(() => {}, []);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <div className={className}>
      <ul className="added-tokens">
        {clusterState.assets.length > 0 &&
          clusterState.assets.map(
            (asset, i) =>
              states.addedAssets.has(asset) && (
                <li key={'added-asset' + i}>
                  <TokenInput<Token>
                    maxDecimalPoints={6}
                    value={states.amounts[i]}
                    onChange={(nextAmount) => updateAmount(asset, nextAmount)}
                    placeholder="0.00"
                    label={assetTokenInfoIndex.get(asset)?.symbol ?? ''}
                    token={
                      <TokenSpan>
                        {assetTokenInfoIndex.get(asset)?.symbol ?? ''}
                      </TokenSpan>
                    }
                    suggest={
                      big(states.balances?.balances[i].balance ?? 0).gt(0) && (
                        <EmptyButton
                          onClick={() =>
                            states.balances?.balances &&
                            updateAmount(
                              asset,
                              demicrofy(
                                states.balances.balances[i].balance,
                              ).toFixed() as Token,
                            )
                          }
                        >
                          <WalletIcon
                            style={{
                              transform: 'translate(-0.3em, 0)',
                            }}
                          />{' '}
                          {formatUTokenInteger(
                            (states.balances?.balances[i].balance ??
                              '0') as u<Token>,
                          )}{' '}
                          {assetTokenInfoIndex.get(asset)?.symbol ?? ''}
                        </EmptyButton>
                      )
                    }
                    error={states.invalidAmounts[i]}
                  >
                    <TokenInputRemoveTool onDelete={() => removeAsset(asset)}>
                      Target:{' '}
                      <s>1,000,000 {assetTokenInfoIndex.get(asset)?.symbol}</s>
                    </TokenInputRemoveTool>
                  </TokenInput>
                </li>
              ),
          )}
      </ul>

      {states.remainAssets.length > 0 && (
        <AddAssetTextButton className="add-token" onClick={openAddAsset}>
          <Add /> Add another asset
        </AddAssetTextButton>
      )}

      {assetSelectElement}
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

  .add-token {
    margin-top: 2.57142857em;
  }
`;

export const MintAdvanced = fixHMR(StyledMintAdvanced);
