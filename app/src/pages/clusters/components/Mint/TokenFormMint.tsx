import { demicrofy, formatUToken } from '@libs/formatter';
import { FormInput, FormStates } from '@libs/use-form';
import {
  ClusterInfo,
  ClusterMintAdvancedFormAsyncStates,
  ClusterMintAdvancedFormInput,
  ClusterMintAdvancedFormStates,
  ClusterMintArbAdvancedFormInput,
  ClusterMintArbAdvancedFormStates,
  ClusterMintArbAdvancedFormAsyncStates,
  computeProRata,
} from '@nebula-js/app-fns';
import { WalletIcon } from '@nebula-js/icons';
import { terraswap, Token, u } from '@nebula-js/types';
import { TextButton, TokenInput, TokenSpan } from '@nebula-js/ui';
import big from 'big.js';
import { AddAssetBadges } from 'components/form/AddAssetBadges';
import { TokenInputRemoveTool } from 'components/form/TokenInputRemoveTool';
import { fixHMR } from 'fix-hmr';
import React, { ReactNode, useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { BasicSwitch } from '@nebula-js/ui/switches';

export interface TokenFormMintProps {
  clusterInfo: ClusterInfo;
  updateInput:
    | FormInput<ClusterMintAdvancedFormInput>
    | FormInput<ClusterMintArbAdvancedFormInput>;
  states:
    | FormStates<
        ClusterMintAdvancedFormStates,
        ClusterMintAdvancedFormAsyncStates
      >
    | FormStates<
        ClusterMintArbAdvancedFormStates,
        ClusterMintArbAdvancedFormAsyncStates
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
  // states
  // ---------------------------------------------
  const [proRata, setProRata] = useState(false);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const addAsset = useCallback(
    (asset: terraswap.Asset<Token>) => {
      updateInput(
        (
          prev: ClusterMintAdvancedFormInput | ClusterMintArbAdvancedFormInput,
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
          prev: ClusterMintAdvancedFormInput | ClusterMintArbAdvancedFormInput,
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
          prev: ClusterMintAdvancedFormInput | ClusterMintArbAdvancedFormInput,
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

  const updateAmountProRata = useCallback(
    (asset: terraswap.Asset<Token>, amount: Token) => {
      const allAssets = new Set(clusterState.target);

      const index = clusterState.target.findIndex(
        (targetAsset) => targetAsset === asset,
      );

      const proRataAmounts = computeProRata(clusterState.inv, amount, index);

      updateInput({ addedAssets: allAssets, amounts: proRataAmounts });
    },
    [clusterState.inv, clusterState.target, updateInput],
  );

  // ---------------------------------------------
  // side effects
  // ---------------------------------------------
  useEffect(() => {
    const hasAmountIdx = states.amounts.findIndex(
      (amount) => amount.length !== 0,
    );

    if (proRata) {
      if (hasAmountIdx >= 0) {
        updateAmountProRata(
          clusterState.target[hasAmountIdx],
          states.amounts[hasAmountIdx],
        );
      } else {
        // initial with 0
        updateAmountProRata(clusterState.target[0], '0' as Token);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proRata, clusterState.target, updateAmountProRata]);

  return (
    <div className={className}>
      <BasicSwitch
        title="Pro Rata"
        checked={proRata}
        updateChecked={setProRata}
      />
      <ul className="added-tokens">
        {clusterState.target.length > 0 &&
          clusterState.target.map(
            (asset, i) =>
              states.addedAssets.has(asset) && (
                <li key={'added-asset' + i}>
                  <TokenInput<Token>
                    maxDecimalPoints={6}
                    value={states.amounts[i]}
                    onChange={(nextAmount) =>
                      proRata
                        ? updateAmountProRata(asset, nextAmount)
                        : updateAmount(asset, nextAmount)
                    }
                    placeholder="0.00"
                    label={assetTokenInfos[i].tokenInfo.symbol}
                    token={
                      <TokenSpan symbol={assetTokenInfos[i].tokenInfo.symbol}>
                        {assetTokenInfos[i].tokenInfo.symbol ?? ''}
                      </TokenSpan>
                    }
                    suggest={
                      big(states.balances?.[i].balance ?? 0).gt(0) && (
                        <TextButton
                          fontSize={12}
                          onClick={() => {
                            if (states.balances) {
                              const newBalance = demicrofy(
                                states.balances[i].balance,
                              ).toFixed() as Token;

                              proRata
                                ? updateAmountProRata(asset, newBalance)
                                : updateAmount(asset, newBalance);
                            }
                          }}
                        >
                          <WalletIcon
                            style={{
                              transform: 'translate(-0.3em, 0)',
                            }}
                          />{' '}
                          {formatUToken(
                            (states.balances?.[i].balance ?? '0') as u<Token>,
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
