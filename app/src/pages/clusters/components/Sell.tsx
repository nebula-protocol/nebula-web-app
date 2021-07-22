import { ArrowSouthIcon, WalletIcon } from '@nebula-js/icons';
import { formatUInput, formatUToken, microfy } from '@nebula-js/notation';
import { CT, u, UST } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  EmptyButton,
  IconSeparator,
  TokenInput,
  TokenSpan,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { ClusterInfo } from '@nebula-js/webapp-fns';
import {
  useCW20SellTokenForm,
  useCW20SellTokenTx,
} from '@nebula-js/webapp-provider';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { BigSource } from 'big.js';
import { FeeBox } from 'components/boxes/FeeBox';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import React, { useCallback } from 'react';
import styled from 'styled-components';

export interface ClusterSellProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function ClusterSellBase({
  className,
  clusterInfo: { clusterState, terraswapPair, clusterTokenInfo },
}: ClusterSellProps) {
  const connectedWallet = useConnectedWallet();

  const { broadcast } = useTxBroadcast();

  const postTx = useCW20SellTokenTx(
    clusterState.cluster_token,
    terraswapPair.contract_addr,
    clusterTokenInfo.symbol,
  );

  const [updateInput, states] = useCW20SellTokenForm({
    ustCtPairAddr: terraswapPair.contract_addr,
    ctAddr: clusterState.cluster_token,
  });

  const buttonSize = useScreenSizeValue<'normal' | 'medium'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  const initForm = useCallback(() => {
    updateInput({
      ustAmount: '' as UST,
      tokenAmount: '' as CT,
    });
  }, [updateInput]);

  const proceed = useCallback(
    (tokenAmount: CT, txFee: u<UST<BigSource>>) => {
      const stream = postTx?.({
        sellAmount: microfy(tokenAmount).toFixed() as u<UST>,
        txFee: big(txFee).toFixed() as u<UST>,
        onTxSucceed: initForm,
      });

      if (stream) {
        console.log('Sell.tsx..()', stream);
        broadcast(stream);
      }
    },
    [broadcast, initForm, postTx],
  );

  return (
    <div className={className}>
      <TokenInput
        maxDecimalPoints={6}
        value={states.tokenAmount ?? ('' as CT)}
        onChange={(nextTokenAmount) =>
          updateInput({ tokenAmount: nextTokenAmount, ustAmount: undefined })
        }
        placeholder="0.00"
        label="FROM"
        suggest={
          <EmptyButton
            onClick={() =>
              updateInput({
                tokenAmount: formatUInput(states.tokenBalance) as CT,
                ustAmount: undefined,
              })
            }
          >
            <WalletIcon
              style={{
                transform: 'translateX(-0.3em)',
              }}
            />{' '}
            {formatUToken(states.tokenBalance)}
          </EmptyButton>
        }
        token={<TokenSpan>{clusterTokenInfo.symbol}</TokenSpan>}
      />

      <IconSeparator>
        <ArrowSouthIcon />
      </IconSeparator>

      <TokenInput
        maxDecimalPoints={6}
        value={states.ustAmount ?? ('' as UST)}
        onChange={(nextUstAmount) =>
          updateInput({ ustAmount: nextUstAmount, tokenAmount: undefined })
        }
        placeholder="0.00"
        label="TO"
        token={<TokenSpan>UST</TokenSpan>}
      />

      <FeeBox className="feebox">
        <li>
          <span>Tx Fee</span>
          <span>{'txFee' in states ? formatUToken(states.txFee) : 0} UST</span>
        </li>
      </FeeBox>

      <Button
        className="submit"
        color="paleblue"
        size={buttonSize}
        disabled={
          !connectedWallet ||
          !connectedWallet.availablePost ||
          !states ||
          !states.tokenAmount ||
          states.tokenAmount.length === 0 ||
          !('txFee' in states)
        }
        onClick={() =>
          states.tokenAmount &&
          'txFee' in states &&
          proceed(states.tokenAmount, states.txFee)
        }
      >
        Sell
      </Button>
    </div>
  );
}

export const ClusterSell = styled(ClusterSellBase)`
  font-size: 1rem;

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
