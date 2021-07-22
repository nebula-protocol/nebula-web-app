import { Add } from '@material-ui/icons';
import { WalletIcon } from '@nebula-js/icons';
import {
  demicrofy,
  formatToken,
  formatUTokenInteger,
  microfy,
} from '@nebula-js/notation';
import { CT, terraswap, Token, u } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  EmptyButton,
  TokenInput,
  TokenSpan,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { ClusterInfo } from '@nebula-js/webapp-fns';
import { useClusterMintAdvancedForm } from '@nebula-js/webapp-provider';
import { useClusterMintTx } from '@nebula-js/webapp-provider';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big from 'big.js';
import { FeeBox } from 'components/boxes/FeeBox';
import { useAssetSelectDialog } from 'components/dialogs/useAssetSelectDialog';
import { AddAssetTextButton } from 'components/form/AddAssetTextButton';
import { TokenInputRemoveTool } from 'components/form/TokenInputRemoveTool';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import { fixHMR } from 'fix-hmr';
import React, { useCallback } from 'react';
import styled from 'styled-components';

export interface MintAdvancedProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function MintAdvancedBase({
  className,
  clusterInfo: { clusterState, assetTokenInfoIndex, clusterTokenInfo },
}: MintAdvancedProps) {
  const connectedWallet = useConnectedWallet();

  const [openAssetSelect, assetSelectElement] = useAssetSelectDialog();

  const [updateInput, states] = useClusterMintAdvancedForm({ clusterState });

  const { broadcast } = useTxBroadcast();

  const postTx = useClusterMintTx(
    clusterState.cluster_contract_address,
    clusterState.assets,
  );

  const buttonSize = useScreenSizeValue<'normal' | 'medium'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

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
    const selectedAsset = await openAssetSelect({
      title: 'Select Asset',
      assets: states.remainAssets,
      assetTokenInfoIndex,
    });

    if (selectedAsset) {
      addAsset(selectedAsset);
    }
  }, [addAsset, assetTokenInfoIndex, openAssetSelect, states.remainAssets]);

  const initForm = useCallback(() => {
    updateInput({
      amounts: clusterState.assets.map(() => '' as CT),
      addedAssets: new Set<terraswap.AssetInfo>(),
    });
  }, [clusterState.assets, updateInput]);

  const proceed = useCallback(
    (amounts: Token[]) => {
      const stream = postTx?.({
        amounts: amounts.map(
          (amount) =>
            (amount.length > 0 ? microfy(amount).toFixed() : '0') as u<Token>,
        ),
        onTxSucceed: initForm,
      });

      if (stream) {
        console.log('Advanced.tsx..()', stream);
        broadcast(stream);
      }
    },
    [broadcast, initForm, postTx],
  );

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

      <FeeBox className="feebox">
        {clusterTokenInfo && 'mintedAmount' in states && states.mintedAmount && (
          <li>
            <span>Minted {clusterTokenInfo.symbol}</span>
            <span>
              {formatToken(states.mintedAmount)} {clusterTokenInfo.symbol}
            </span>
          </li>
        )}

        {/*<li>*/}
        {/*  <span>Tx Fee</span>*/}
        {/*  <span>{'txFee' in states ? formatUToken(states.txFee) : 0} UST</span>*/}
        {/*</li>*/}
      </FeeBox>

      <Button
        className="submit"
        color="paleblue"
        size={buttonSize}
        disabled={
          !connectedWallet ||
          !connectedWallet.availablePost ||
          !postTx ||
          !states ||
          states.amounts.every((amount) => amount.length === 0)
        }
        onClick={() => proceed(states.amounts)}
      >
        Mint
      </Button>

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

export const MintAdvanced = fixHMR(StyledMintAdvanced);
