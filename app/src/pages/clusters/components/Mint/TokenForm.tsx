import { Add } from '@material-ui/icons';
import { WalletIcon } from '@nebula-js/icons';
import { demicrofy, formatUTokenInteger } from '@nebula-js/notation';
import { terraswap, Token, u } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  EmptyButton,
  TokenInput,
  TokenSpan,
  useScreenSizeValue,
} from '@nebula-js/ui';
import {
  ClusterInfo,
  ClusterMintAdvancedFormAsyncStates,
  ClusterMintAdvancedFormInput,
  ClusterMintAdvancedFormStates,
} from '@nebula-js/webapp-fns';
import { FormInput, FormStates } from '@terra-dev/use-form';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big from 'big.js';
import { useAssetSelectDialog } from 'components/dialogs/useAssetSelectDialog';
import { AddAssetTextButton } from 'components/form/AddAssetTextButton';
import { TokenInputRemoveTool } from 'components/form/TokenInputRemoveTool';
import { fixHMR } from 'fix-hmr';
import React, { ReactNode, useCallback } from 'react';
import styled from 'styled-components';

export interface TokenFormProps {
  clusterInfo: ClusterInfo;
  updateInput: FormInput<ClusterMintAdvancedFormInput>;
  states: FormStates<
    ClusterMintAdvancedFormStates,
    ClusterMintAdvancedFormAsyncStates
  >;
  onProceed: (amounts: Token[]) => void;
  children: ReactNode;
  className?: string;
}

function TokenFormBase({
  clusterInfo: { clusterState, assetTokenInfoIndex, clusterTokenInfo },
  updateInput,
  states,
  children,
  onProceed,
  className,
}: TokenFormProps) {
  const connectedWallet = useConnectedWallet();

  const buttonSize = useScreenSizeValue<'normal' | 'medium'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  const [openAssetSelect, assetSelectElement] = useAssetSelectDialog();

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
        const index = clusterState.assets.findIndex(
          (targetAsset) => targetAsset === asset,
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
    [clusterState.assets, updateInput],
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
    const selectedAsset = await openAssetSelect({
      title: 'Select Asset',
      assets: states.remainAssets,
      assetTokenInfoIndex,
    });

    if (selectedAsset) {
      addAsset(selectedAsset);
    }
  }, [addAsset, assetTokenInfoIndex, openAssetSelect, states.remainAssets]);

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

      {children}

      <Button
        className="submit"
        color="paleblue"
        size={buttonSize}
        disabled={
          !connectedWallet ||
          !connectedWallet.availablePost ||
          !states ||
          states.amounts.every((amount) => amount.length === 0)
        }
        onClick={() => onProceed(states.amounts)}
      >
        Mint
      </Button>

      {assetSelectElement}
    </div>
  );
}

const StyledTokenForm = styled(TokenFormBase)`
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

export const TokenForm = fixHMR(StyledTokenForm);
