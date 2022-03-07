import { demicrofy, formatUTokenInteger } from '@libs/formatter';
import { FormInput, FormStates } from '@libs/use-form';
import {
  ClusterInfo,
  ClusterMintAdvancedFormAsyncStates,
  ClusterMintAdvancedFormInput,
  ClusterMintAdvancedFormStates,
  ClusterMintTerraswapArbitrageFormAsyncStates,
  ClusterMintTerraswapArbitrageFormInput,
  ClusterMintTerraswapArbitrageFormStates,
} from '@nebula-js/app-fns';
import { WalletIcon } from '@nebula-js/icons';
import { terraswap, Token, u } from '@nebula-js/types';
import { TextButton, TokenInput, TokenSpan } from '@nebula-js/ui';
import big from 'big.js';
import { AddAssetBadges } from 'components/form/AddAssetBadges';
import { TokenInputRemoveTool } from 'components/form/TokenInputRemoveTool';
import { fixHMR } from 'fix-hmr';
import React, { ReactNode, useCallback } from 'react';
import styled from 'styled-components';

export interface TokenFormMintProps {
  clusterInfo: ClusterInfo;
  updateInput:
    | FormInput<ClusterMintAdvancedFormInput>
    | FormInput<ClusterMintTerraswapArbitrageFormInput>;
  states:
    | FormStates<
        ClusterMintAdvancedFormStates,
        ClusterMintAdvancedFormAsyncStates
      >
    | FormStates<
        ClusterMintTerraswapArbitrageFormStates,
        ClusterMintTerraswapArbitrageFormAsyncStates
      >;
  children: ReactNode;
  className?: string;
}

function TokenFormMintBase({
  clusterInfo: { clusterState, assetTokenInfos },
  updateInput,
  states,
  children,
  className,
}: TokenFormMintProps) {
  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const addAsset = useCallback(
    (asset: terraswap.Asset<Token>) => {
      updateInput(
        (
          prev:
            | ClusterMintAdvancedFormInput
            | ClusterMintTerraswapArbitrageFormInput,
        ) => {
          const nextAddedAssets = new Set(prev.addedAssets);
          nextAddedAssets.add(asset);
          return {
            ...prev,
            addedAssets: nextAddedAssets,
          };
        },
      );
    },
    [updateInput],
  );

  const removeAsset = useCallback(
    (asset: terraswap.Asset<Token>) => {
      updateInput(
        (
          prev:
            | ClusterMintAdvancedFormInput
            | ClusterMintTerraswapArbitrageFormInput,
        ) => {
          const index = clusterState.target.findIndex(
            ({ info }) => info === asset.info,
          );

          const nextAmounts = [...prev.amounts];
          nextAmounts[index] = '' as Token;

          const nextAddedAssets = new Set(prev.addedAssets);

          return nextAddedAssets.delete(asset)
            ? {
                ...prev,
                addedAssets: nextAddedAssets,
                amounts: nextAmounts,
              }
            : prev;
        },
      );
    },
    [clusterState.target, updateInput],
  );

  const updateAmount = useCallback(
    (asset: terraswap.Asset<Token>, amount: Token) => {
      updateInput(
        (
          prev:
            | ClusterMintAdvancedFormInput
            | ClusterMintTerraswapArbitrageFormInput,
        ) => {
          const index = clusterState.target.findIndex(
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
        },
      );
    },
    [clusterState.target, updateInput],
  );

  return (
    <div className={className}>
      <ul className="added-tokens">
        {clusterState.target.length > 0 &&
          clusterState.target.map(
            (asset, i) =>
              states.addedAssets.has(asset) && (
                <li key={'added-asset' + i}>
                  <TokenInput<Token>
                    maxDecimalPoints={6}
                    value={states.amounts[i]}
                    onChange={(nextAmount) => updateAmount(asset, nextAmount)}
                    placeholder="0.00"
                    label={assetTokenInfos[i].tokenInfo.symbol}
                    token={
                      <TokenSpan>
                        {assetTokenInfos[i].tokenInfo.symbol ?? ''}
                      </TokenSpan>
                    }
                    suggest={
                      big(states.balances?.balances[i].balance ?? 0).gt(0) && (
                        <TextButton
                          fontSize={12}
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
                          {assetTokenInfos[i].tokenInfo.symbol ?? ''}
                        </TextButton>
                      )
                    }
                    error={states.invalidAmounts[i]}
                  >
                    <TokenInputRemoveTool onDelete={() => removeAsset(asset)} />
                  </TokenInput>
                </li>
              ),
          )}
      </ul>

      {states.remainAssets.length > 0 && (
        <AddAssetBadges
          className="add-token"
          assets={states.remainAssets}
          assetTokenInfos={assetTokenInfos}
          addedAssets={states.addedAssets}
          onAdd={addAsset}
        />
      )}

      {children}
    </div>
  );
}

const StyledTokenFormMint = styled(TokenFormMintBase)`
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

export const TokenFormMint = fixHMR(StyledTokenFormMint);
