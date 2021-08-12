import { WalletIcon } from '@nebula-js/icons';
import { Add } from '@material-ui/icons';
import { formatUInput, formatUToken } from '@nebula-js/notation';
import { Token, u } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  EmptyButton,
  Input,
  NativeSelect,
  Section,
  TokenInput,
  TokenSpan,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { useSendForm, useSendTokensForm } from '@nebula-js/webapp-provider';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { WarningMessageBox } from 'components/boxes/WarningMessageBox';
import { FormLayout } from 'components/layouts/FormLayout';
import { fixHMR } from 'fix-hmr';
import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useCW20AddrDialog } from './components/useCW20AddrDialog';

export interface SendMainProps {
  className?: string;
}

function SendMainBase({ className }: SendMainProps) {
  const connectedWallet = useConnectedWallet();

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
            <TokenSpan>{tokens.selectedTokenInfo.tokenInfo.symbol}</TokenSpan>
          }
          error={states.invalidAmount}
        />

        <Input
          className="to-address"
          value={states.toAddr}
          onChange={(nextToAddr) => updateInput({ toAddr: nextToAddr })}
          placeholder="terra1..."
          label="ADDRESS"
          token="TO"
          error={states.invalidToAddr}
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
            //!postTx ||
            !states ||
            !states.availableTx
          }
        >
          Send
        </Button>
      </Section>

      {cw20AddrDialogElement}
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
