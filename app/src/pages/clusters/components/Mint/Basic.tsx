import { WalletIcon } from '@nebula-js/icons';
import { formatUInput, formatUToken } from '@nebula-js/notation';
import { UST } from '@nebula-js/types';
import { EmptyButton, TokenInput, TokenSpan } from '@nebula-js/ui';
import { ClusterInfo } from '@nebula-js/webapp-fns';
import { useClusterMintBasicForm } from '@nebula-js/webapp-provider';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';

export interface MintBasicProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function MintBasicBase({
  className,
  clusterInfo: { clusterState, assetTokenInfoIndex, clusterTokenInfo },
}: MintBasicProps) {
  //const connectedWallet = useConnectedWallet();

  const [updateInput, states] = useClusterMintBasicForm({ clusterState });

  return (
    <div className={className}>
      <TokenInput<UST>
        maxDecimalPoints={6}
        value={states.ustAmount ?? ('' as UST)}
        onChange={(nextUstAmount) => updateInput({ ustAmount: nextUstAmount })}
        placeholder="0.00"
        label="FROM"
        suggest={
          <EmptyButton
            onClick={() =>
              updateInput({
                ustAmount: formatUInput(states.maxUstAmount) as UST,
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
    </div>
  );
}

export const StyledMintBasic = styled(MintBasicBase)`
  // TODO
`;

export const MintBasic = fixHMR(StyledMintBasic);
