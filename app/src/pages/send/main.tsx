import { formatUInput, formatUToken, microfy } from '@libs/formatter';
import { useSendForm, useSendTx } from '@libs/app-provider';
import { Add } from '@material-ui/icons';
import { WalletIcon } from '@nebula-js/icons';
import { HumanAddr, terraswap, Token, u, UST } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  EmptyButton,
  Input,
  NativeSelect,
  Section,
  TokenInput,
  TokenSpan,
  useConfirm,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { useSendTokensForm } from '@nebula-js/app-provider';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { BigSource } from 'big.js';
import { WarningMessageBox } from 'components/boxes/WarningMessageBox';
import { FormLayout } from 'components/layouts/FormLayout';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import { fixHMR } from 'fix-hmr';
import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useCW20AddrDialog } from './components/useCW20AddrDialog';

export interface SendMainProps {
  className?: string;
}

function SendMainBase({ className }: SendMainProps) {
  const connectedWallet = useConnectedWallet();

  const { broadcast } = useTxBroadcast();

  const [openConfirm, confirmElement] = useConfirm();

  const postTx = useSendTx();

  const [updateTokens, tokens] = useSendTokensForm();

  const [openCW20AddrDialog, cw20AddrDialogElement] = useCW20AddrDialog();

  const [updateInput, states] = useSendForm<Token>({
    tokenInfo: tokens.selectedTokenInfo,
  });

  useEffect(() => {
    updateInput({
      amount: '' as u<Token>,
    });
  }, [tokens.selectedTokenInfo, updateInput]);

  const addCW20Addr = useCallback(async () => {
    const addr = await openCW20AddrDialog({
      cw20Addrs: tokens.cw20Addrs,
    });

    if (addr) {
      updateTokens({
        cw20Addrs: [...tokens.cw20Addrs, addr],
        selectToken: (tokenInfos) =>
          tokenInfos.find(({ assetInfo }) => {
            return (
              'token' in assetInfo && assetInfo.token.contract_addr === addr
            );
          }),
      });
    }
  }, [openCW20AddrDialog, tokens.cw20Addrs, updateTokens]);

  const initForm = useCallback(() => {
    updateInput({
      amount: '' as Token,
      toAddr: '',
      memo: '',
    });
  }, [updateInput]);

  const proceed = useCallback(
    async (
      asset: terraswap.AssetInfo,
      amount: Token,
      toAddr: string,
      memo: string,
      txFee: u<UST<BigSource>>,
      warning: string | null,
    ) => {
      if (warning) {
        const confirm = await openConfirm({
          description: warning,
          agree: 'Send',
          disagree: 'Cancel',
        });

        if (!confirm) {
          return;
        }
      }

      const stream = postTx?.({
        amount: microfy(amount).toFixed() as u<UST>,
        asset,
        toAddr: toAddr as HumanAddr,
        memo: memo.length > 0 ? memo : undefined,
        txFee: big(txFee).toFixed() as u<UST>,
        onTxSucceed: initForm,
      });

      if (stream) {
        broadcast(stream);
      }
    },
    [broadcast, initForm, openConfirm, postTx],
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

  return (
    <FormLayout title="Send" className={className}>
      <Section>
        <div className="select-token">
          <NativeSelect
            fullWidth
            value={tokens.selectedTokenInfo.tokenInfo.symbol}
            onChange={({ currentTarget }) =>
              updateTokens({
                selectedTokenInfo: tokens.tokenInfos.find(
                  ({ tokenInfo: { symbol } }) => currentTarget.value === symbol,
                ),
              })
            }
          >
            {tokens.tokenInfos.map(({ tokenInfo: { symbol, name } }) => (
              <option key={'token' + symbol} value={symbol}>
                {symbol} - {name}
              </option>
            ))}
          </NativeSelect>

          <EmptyButton onClick={addCW20Addr} fontSize="2em">
            <Add />
          </EmptyButton>
        </div>

        <TokenInput
          className="amount"
          maxDecimalPoints={6}
          value={states.amount ?? ('' as Token)}
          onChange={(nextAmount) => updateInput({ amount: nextAmount })}
          placeholder="0.00"
          label="AMOUNT"
          suggest={
            <EmptyButton
              onClick={() =>
                updateInput({
                  amount: formatUInput(states.maxAmount) as Token,
                })
              }
            >
              <WalletIcon
                style={{
                  transform: 'translateX(-0.3em)',
                }}
              />{' '}
              {formatUToken(states.maxAmount)}
            </EmptyButton>
          }
          token={
            <TokenSpan symbol={tokens.selectedTokenInfo.tokenInfo.symbol}>
              {tokens.selectedTokenInfo.tokenInfo.symbol}
            </TokenSpan>
          }
          error={states.invalidAmount}
        />

        <Input
          className="to-address"
          value={states.toAddr}
          onChange={(nextToAddr) => updateInput({ toAddr: nextToAddr })}
          placeholder="terra1..."
          label="TO"
          error={states.invalidToAddr}
        />

        <Input
          className="memo"
          value={states.memo}
          onChange={(nextMemo) => updateInput({ memo: nextMemo })}
          label="MEMO"
          error={states.invalidMemo}
        />

        {states.invalidTxFee ? (
          <WarningMessageBox level="critical" className="warning">
            {states.invalidTxFee}
          </WarningMessageBox>
        ) : states.warningNextTxFee ? (
          <WarningMessageBox level="warning" className="warning">
            {states.warningNextTxFee}
          </WarningMessageBox>
        ) : states.warningEmptyMemo ? (
          <WarningMessageBox level="warning" className="warning">
            {states.warningEmptyMemo}
          </WarningMessageBox>
        ) : null}

        <Button
          className="submit"
          color="paleblue"
          size={buttonSize}
          disabled={
            !connectedWallet ||
            !connectedWallet.availablePost ||
            !postTx ||
            !states ||
            !states.availableTx
          }
          onClick={() =>
            'txFee' in states &&
            states.txFee &&
            proceed(
              tokens.selectedTokenInfo.assetInfo,
              states.amount,
              states.toAddr,
              states.memo,
              states.txFee,
              states.warningNextTxFee,
            )
          }
        >
          Send
        </Button>
      </Section>

      {cw20AddrDialogElement}
      {confirmElement}
    </FormLayout>
  );
}

const StyledSendMain = styled(SendMainBase)`
  font-size: 1rem;

  .feebox {
    margin-top: 2.8em;
  }

  .select-token {
    display: flex;
    align-items: center;
    gap: 1em;
  }

  .amount {
    margin-top: 2.14285714285714em;
  }

  .to-address {
    --text-align: left;
    margin-top: 2.14285714285714em;
  }

  .memo {
    --text-align: left;
    margin-top: 2.14285714285714em;
  }

  .warning {
    margin-top: 2.14285714285714em;
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

export default fixHMR(StyledSendMain);
