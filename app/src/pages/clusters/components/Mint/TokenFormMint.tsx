import { demicrofy, formatUTokenInteger } from '@libs/formatter';
import { FormInput, FormStates } from '@libs/use-form';
import {
  ClusterInfo,
  ClusterMintAdvancedFormAsyncStates,
  ClusterMintAdvancedFormInput,
  ClusterMintAdvancedFormStates,
} from '@nebula-js/app-fns';
import { WalletIcon } from '@nebula-js/icons';
import { terraswap, Token, u, UST } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  TextButton,
  TokenInput,
  TokenSpan,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big from 'big.js';
import { AddAssetBadges } from 'components/form/AddAssetBadges';
import { TokenInputRemoveTool } from 'components/form/TokenInputRemoveTool';
import { fixHMR } from 'fix-hmr';
import React, { ReactNode, useCallback } from 'react';
import styled from 'styled-components';

export interface TokenFormMintProps {
  clusterInfo: ClusterInfo;
  updateInput: FormInput<ClusterMintAdvancedFormInput>;
  states: FormStates<
    ClusterMintAdvancedFormStates,
    ClusterMintAdvancedFormAsyncStates
  >;
  onProceed: (amounts: Token[], txFee: u<UST>) => void;
  children: ReactNode;
  className?: string;
}

function TokenFormMintBase({
  clusterInfo: { clusterState, assetTokenInfos },
  updateInput,
  states,
  children,
  onProceed,
  className,
}: TokenFormMintProps) {
  const connectedWallet = useConnectedWallet();

  const buttonSize = useScreenSizeValue<'normal' | 'medium'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  // TODO: confuse to display
  // const assetView = useMemo<AssetView[]>(() => {
  //   return toAssetView(clusterState, assetTokenInfos);
  // }, [clusterState, assetTokenInfos]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const addAsset = useCallback(
    (asset: terraswap.Asset<Token>) => {
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
    (asset: terraswap.Asset<Token>) => {
      updateInput((prev) => {
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
      });
    },
    [clusterState.target, updateInput],
  );

  const updateAmount = useCallback(
    (asset: terraswap.Asset<Token>, amount: Token) => {
      updateInput((prev) => {
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
      });
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
                    <TokenInputRemoveTool onDelete={() => removeAsset(asset)}>
                      {/* TOOD: Confuse to display */}
                      {/* <span
                        style={{
                          color: assetView[i].targetColor,
                        }}
                      >
                        Target:{' '}
                        {formatUTokenDecimal2(assetView[i].targetAmount)}{' '}
                        {assetTokenInfos[i].tokenInfo.symbol}
                      </span> */}
                    </TokenInputRemoveTool>
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

      <Button
        className="submit"
        color="paleblue"
        size={buttonSize}
        disabled={
          !connectedWallet ||
          !connectedWallet.availablePost ||
          !states ||
          !states.txFee ||
          states.amounts.every((amount) => amount.length === 0)
        }
        onClick={() => states.txFee && onProceed(states.amounts, states.txFee)}
      >
        Mint
      </Button>
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

  .feebox {
    margin-top: 2.8em;
  }

  .submit {
    display: block;
    width: 100%;
    max-width: 360px;
    margin: 2.8em auto 0 auto;
  }

  @media (max-width: ${breakpoints.mobile.max}px) {
    .feebox {
      font-size: 0.9em;
      margin-top: 2.2em;
    }

    .submit {
      margin-top: 2.2em;
    }
  }
`;

export const TokenFormMint = fixHMR(StyledTokenFormMint);
