import { ArrowSouthIcon, WalletIcon } from '@nebula-js/icons';
import { formatUInput, formatUToken } from '@nebula-js/notation';
import { CT, UST } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  EmptyButton,
  IconSeparator,
  TokenInput,
  TokenSpan,
  useScreenSizeValue,
} from '@nebula-js/ui';
import {
  ClusterInfo,
  cw20BuyTokenForm,
  CW20BuyTokenFormInput,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useNebulaWebapp } from '@nebula-js/webapp-provider';
import { useForm } from '@terra-dev/use-form';
import { useBank, useTerraWebapp } from '@terra-money/webapp-provider';
import { FeeBox } from 'components/boxes/FeeBox';
import React from 'react';
import styled from 'styled-components';

export interface ClusterBuyProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function ClusterBuyBase({
  className,
  clusterInfo: { clusterState, terraswapPair, clusterTokenInfo },
}: ClusterBuyProps) {
  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

  const {
    constants: { fixedGas },
  } = useNebulaWebapp();

  const { tax, tokenBalances } = useBank<NebulaTokenBalances, NebulaTax>();

  const [updateInput, states] = useForm(
    cw20BuyTokenForm,
    {
      ustCtPairAddr: terraswapPair.contract_addr,
      ctAddr: clusterState.cluster_token,
      mantleEndpoint,
      mantleFetch,
      ustBalance: tokenBalances.uUST,
      tax,
      fixedGas,
    },
    () => ({ ustAmount: '' as UST } as CW20BuyTokenFormInput<CT>),
  );

  const buttonSize = useScreenSizeValue<'normal' | 'medium'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  return (
    <div className={className}>
      <TokenInput
        maxDecimalPoints={6}
        value={states.ustAmount ?? ('' as UST)}
        onChange={(nextUstAmount) =>
          updateInput({ ustAmount: nextUstAmount, tokenAmount: undefined })
        }
        placeholder="0.00"
        label="FROM"
        suggest={
          <EmptyButton
            onClick={() =>
              updateInput({
                ustAmount: formatUInput(states.maxUstAmount) as UST,
                tokenAmount: undefined,
              })
            }
          >
            <WalletIcon
              style={{
                transform: 'translateX(-0.3em)',
              }}
            />{' '}
            {formatUToken(states.maxUstAmount)}
          </EmptyButton>
        }
        token={<TokenSpan>UST</TokenSpan>}
      />

      <IconSeparator>
        <ArrowSouthIcon />
      </IconSeparator>

      <TokenInput
        maxDecimalPoints={6}
        value={states.tokenAmount ?? ('' as CT)}
        onChange={(nextCtAmount) =>
          updateInput({ ustAmount: undefined, tokenAmount: nextCtAmount })
        }
        placeholder="0.00"
        label="TO"
        token={<TokenSpan>{clusterTokenInfo.symbol}</TokenSpan>}
      />

      <FeeBox className="feebox">
        <li>
          <span>Tx Fee</span>
          <span>{'txFee' in states ? formatUToken(states.txFee) : 0} UST</span>
        </li>
      </FeeBox>

      <Button className="submit" color="paleblue" size={buttonSize}>
        Buy
      </Button>
    </div>
  );
}

export const ClusterBuy = styled(ClusterBuyBase)`
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
