import { FormInput, FormStates } from '@libs/use-form';
import {
  ClusterInfo,
  ClusterRedeemAdvancedFormAsyncStates,
  ClusterRedeemAdvancedFormStates,
  ClusterRedeemAdvancedFormInput,
} from '@nebula-js/app-fns';
import { terraswap, Token, u, UST, CT } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  TokenInputMinimal,
  TokenSpan,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { AddAssetBadges } from 'components/form/AddAssetBadges';
import { TokenInputRemoveTool } from 'components/form/TokenInputRemoveTool';
import { fixHMR } from 'fix-hmr';
import React, { ReactNode, useCallback } from 'react';
import styled from 'styled-components';

export interface TokenFormBurnProps {
  clusterInfo: ClusterInfo;
  updateInput: FormInput<ClusterRedeemAdvancedFormInput>;
  states: FormStates<
    ClusterRedeemAdvancedFormStates,
    ClusterRedeemAdvancedFormAsyncStates
  >;
  onProceed: (amount: CT, assetAmounts: Token[], txFee: u<UST>) => void;
  children: ReactNode;
  className?: string;
}

function TokenFormBurnBase({
  clusterInfo: { clusterState, assetTokenInfos },
  updateInput,
  states,
  children,
  onProceed,
  className,
}: TokenFormBurnProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

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

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  const buttonSize = useScreenSizeValue<'normal' | 'medium'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

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
      <ul className="added-tokens" style={{ gap: '2em' }}>
        {clusterState.target.length > 0 &&
          clusterState.target.map(
            (asset, i) =>
              states.addedAssets.has(asset) && (
                <li key={'added-asset' + i}>
                  <TokenInputMinimal<Token>
                    style={{
                      padding: '0em',
                      display: 'flex',
                      alignItems: 'center',
                      minHeight: '4.28572em',
                    }}
                    maxDecimalPoints={6}
                    value={states.amounts[i]}
                    onChange={(nextAmount) => updateAmount(asset, nextAmount)}
                    placeholder="0.00"
                    token={
                      <TokenSpan style={{ marginLeft: '1.42857em' }}>
                        {assetTokenInfos[i].tokenInfo.symbol ?? ''}
                      </TokenSpan>
                    }
                  >
                    <div
                      style={{
                        borderLeft: '1px solid var(--color-gray34)',
                        padding: '0.8em 1.42857em 0.8em 1.42857em',
                        marginLeft: '1.42857em',
                        minHeight: '4.28572em',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <TokenInputRemoveTool
                        onDelete={() => removeAsset(asset)}
                      />
                    </div>
                  </TokenInputMinimal>
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
          style={{ marginTop: '2em' }}
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
          !!states.invalidBurntAmount ||
          !!states.invalidTokenAmount ||
          states.amounts.every((amount) => amount.length === 0)
        }
        onClick={() =>
          states.txFee &&
          onProceed(states.tokenAmount, states.amounts, states.txFee)
        }
      >
        Burn
      </Button>
    </div>
  );
}

const StyledTokenFormBurn = styled(TokenFormBurnBase)`
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

  .warning {
    margin-top: 2em;
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

export const TokenFormBurn = fixHMR(StyledTokenFormBurn);
