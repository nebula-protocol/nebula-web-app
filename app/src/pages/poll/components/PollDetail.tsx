import { formatRate, formatUToken } from '@libs/formatter';
import { FinderAddressLink } from '@libs/ui';
import { ParsedPoll } from '@nebula-js/app-fns';
import {
  useClusterInfoQuery,
  useGovConfigQuery,
  useNebulaApp,
} from '@nebula-js/app-provider';
import {
  cluster,
  cluster_factory,
  community,
  gov,
  HumanAddr,
  Rate,
} from '@nebula-js/types';
import { Section } from '@nebula-js/ui';
import { useWallet } from '@terra-money/use-wallet';
import { fixHMR } from 'fix-hmr';
import { TokenLabel } from 'pages/poll/components/TokenLabel';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import useClipboard from 'react-use-clipboard';
import styled from 'styled-components';
import { FileCopy, Check } from '@material-ui/icons';
import { sum } from '@libs/big-math';
import big from 'big.js';
import { useTerraTokenDisplayInfo } from '@libs/app-provider';

export interface PollDetailProps {
  className?: string;
  parsedPoll: ParsedPoll;
}

function PollDetailBase({ className, parsedPoll }: PollDetailProps) {
  const { contractAddress } = useNebulaApp();

  const [isCopied, setCopied] = useClipboard(
    JSON.stringify(parsedPoll?.executeMsgs) ?? '',
    {
      successDuration: 1000 * 3,
    },
  );

  const executedMsgJson = useMemo(() => {
    if (!parsedPoll?.executeMsgs) return undefined;

    return JSON.stringify(parsedPoll?.executeMsgs, null, 2);
  }, [parsedPoll]);

  const parsedDescription = useMemo(() => {
    return parsedPoll.poll.description
      .replace('#n', '\nCluster Name: ')
      .replace('#s', '\nCluster Symbol: ')
      .replace('#d', '\nCluster Description: ');
  }, [parsedPoll.poll.description]);

  return (
    <Section className={className}>
      <div>
        <h4>Description</h4>
        <pre>{parsedDescription}</pre>
      </div>

      {parsedPoll.poll?.link && parsedPoll.poll.link.startsWith('http') && (
        <div>
          <h4>Link</h4>
          <p>
            <a href={parsedPoll.poll.link} target="_blank" rel="noreferrer">
              {parsedPoll.poll.link}
            </a>
          </p>
        </div>
      )}

      {parsedPoll.executeMsgs?.[0].contract ===
        contractAddress.clusterFactory &&
        'create_cluster' in parsedPoll.executeMsgs?.[0].msg && (
          <WhitelistCluster msg={parsedPoll.executeMsgs?.[0].msg} />
        )}

      {parsedPoll.executeMsgs?.[0].contract ===
        contractAddress.clusterFactory &&
        'decommission_cluster' in parsedPoll.executeMsgs?.[0].msg && (
          <BlacklistCluster msg={parsedPoll.executeMsgs?.[0].msg} />
        )}

      {parsedPoll.executeMsgs?.[0].contract === contractAddress.gov &&
        'update_config' in parsedPoll.executeMsgs?.[0].msg && (
          <GovernanceParameterChange msg={parsedPoll.executeMsgs?.[0].msg} />
        )}

      {parsedPoll.executeMsgs?.[0].contract === contractAddress.community &&
        'spend' in parsedPoll.executeMsgs?.[0].msg && (
          <CommunityPoolSpend msg={parsedPoll.executeMsgs?.[0].msg} />
        )}

      {parsedPoll.executeMsgs &&
        parsedPoll.executeMsgs?.[0].contract !== contractAddress.gov &&
        'update_config' in parsedPoll.executeMsgs?.[0].msg && (
          <ClusterParameterChange
            msg={parsedPoll.executeMsgs?.[0].msg}
            clusterAddr={parsedPoll.executeMsgs?.[0].contract}
          />
        )}

      {parsedPoll?.executeMsgs && executedMsgJson && (
        <div>
          <div className="execute-header">
            <h4>Executed Message</h4>
            <div onClick={setCopied}>
              {isCopied ? <Check /> : <FileCopy />}{' '}
              {isCopied ? 'Copied' : 'Copy'}
            </div>
          </div>
          <div className="json-box">
            <pre>{executedMsgJson}</pre>
          </div>
        </div>
      )}
    </Section>
  );
}

function WhitelistCluster({
  msg: {
    create_cluster: { params },
  },
}: {
  msg: cluster_factory.CreateCluster;
}) {
  const { network } = useWallet();
  const targetSum = sum(...params.target.map(({ amount }) => amount));

  return (
    <>
      <div>
        <h4>Cluster Name</h4>
        <p>{params.name}</p>
      </div>

      <div>
        <h4>Cluster Description</h4>
        <p>{params.description}</p>
      </div>

      {params.weight && (
        <div>
          <h4>Weight</h4>
          <p>{params.weight}</p>
        </div>
      )}

      <div>
        <h4>Price Oracle Address</h4>
        <p>
          <FinderAddressLink
            network={network}
            address={params.pricing_oracle}
          />
        </p>
      </div>

      <div>
        <h4>Target Oracle Address</h4>
        <p>
          <FinderAddressLink network={network} address={params.target_oracle} />
        </p>
      </div>

      <div>
        <h4>Penalty Address</h4>
        <p>
          <FinderAddressLink network={network} address={params.penalty} />
        </p>
      </div>

      <div>
        <h4>Tokens</h4>
        <TokenTable>
          <thead>
            <tr>
              <th>Token</th>
              <th>Allocation</th>
            </tr>
          </thead>
          <tbody>
            {params.target.map(({ info, amount }, i) => (
              <tr key={`token-${i}`}>
                <td>
                  <TokenLabel assetInfo={info} />
                </td>
                <td>
                  {amount} (
                  {formatRate(big(amount).div(targetSum).toFixed() as Rate)}
                  %)
                </td>
              </tr>
            ))}
          </tbody>
        </TokenTable>
      </div>
    </>
  );
}

function BlacklistCluster({
  msg,
}: {
  msg: cluster_factory.DecommissionCluster;
}) {
  const { data: { clusterConfig, clusterState } = {} } = useClusterInfoQuery(
    msg.decommission_cluster.cluster_contract,
  );

  return (
    <>
      <div>
        <h4>Cluster</h4>
        <p>
          <Link to={`/clusters/${clusterState?.cluster_contract_address}`}>
            {clusterConfig?.config.name}
          </Link>
        </p>
      </div>
    </>
  );
}

function GovernanceParameterChange({
  msg: { update_config },
}: {
  msg: gov.UpdateConfig;
}) {
  const { data: { govConfig } = {} } = useGovConfigQuery();

  return (
    <>
      {update_config.quorum && (
        <div>
          <h4>Quorum</h4>
          <p>
            <s>{govConfig?.quorum}</s>
          </p>
          <p>{update_config.quorum}</p>
        </div>
      )}

      {update_config.threshold && (
        <div>
          <h4>Threshold</h4>
          <p>
            <s>{govConfig?.threshold}</s>
          </p>
          <p>{update_config.threshold}</p>
        </div>
      )}

      {update_config.voting_period && (
        <div>
          <h4>Voting Period</h4>
          {/* TODO */}
          {/* <p>
            <s>{govConfig?.voting_period}</s>
          </p> */}
          <p>{update_config.voting_period}</p>
        </div>
      )}

      {update_config.effective_delay && (
        <div>
          <h4>Effective Deplay</h4>
          {/* TODO */}
          {/* <p>
            <s>{govConfig?.effective_delay}</s>
          </p> */}
          <p>{update_config.effective_delay}</p>
        </div>
      )}

      {update_config.expiration_period && (
        <div>
          <h4>Expiration Period</h4>
          <p>
            <s>{govConfig?.expiration_period}</s>
          </p>
          <p>{update_config.expiration_period}</p>
        </div>
      )}

      {update_config.proposal_deposit && (
        <div>
          <h4>Proposal Deposit</h4>
          <p>
            <s>
              {govConfig?.proposal_deposit &&
                formatUToken(govConfig.proposal_deposit)}{' '}
              NEB
            </s>
          </p>
          <p>{formatUToken(update_config.proposal_deposit)} NEB</p>
        </div>
      )}

      {update_config.voter_weight && (
        <div>
          <h4>Voter Weight</h4>
          <p>
            <s>{govConfig?.voter_weight}</s>
          </p>
          <p>{update_config.voter_weight}</p>
        </div>
      )}

      {update_config.snapshot_period && (
        <div>
          <h4>Snapshot Period</h4>
          <p>
            <s>{govConfig?.snapshot_period}</s>
          </p>
          <p>{update_config.snapshot_period}</p>
        </div>
      )}
    </>
  );
}

function CommunityPoolSpend({ msg: { spend } }: { msg: community.Spend }) {
  const { network } = useWallet();
  const { tokenInfo } = useTerraTokenDisplayInfo(spend.asset.info);

  return (
    <>
      <div>
        <h4>Recipient</h4>
        <p>
          <FinderAddressLink network={network} address={spend.recipient} />
        </p>
      </div>

      <div>
        <h4>Amount</h4>
        <p>
          {formatUToken(spend.asset.amount)} {tokenInfo?.symbol}
        </p>
      </div>
    </>
  );
}

function ClusterParameterChange({
  msg: { update_config },
  clusterAddr,
}: {
  msg: cluster.UpdateConfig;
  clusterAddr: HumanAddr;
}) {
  const { network } = useWallet();

  const { data: { clusterConfig, clusterState } = {} } =
    useClusterInfoQuery(clusterAddr);

  return (
    <>
      <div>
        <h4>Cluster</h4>
        <p>
          <Link to={`/clusters/${clusterState?.cluster_contract_address}`}>
            {clusterConfig?.config.name}
          </Link>
        </p>
      </div>

      {update_config.name && (
        <div>
          <h4>Name</h4>
          {/* TODO: cannot display cluster's state after executing */}
          {/* <p>
            <s>{clusterConfig?.config.name}</s>
          </p> */}
          <p>{update_config.name}</p>
        </div>
      )}

      {update_config.description && (
        <div>
          <h4>Description</h4>
          {/* <p>
            <s>{clusterConfig?.config.description}</s>
          </p> */}
          <p>{update_config.description}</p>
        </div>
      )}

      {update_config.pricing_oracle && (
        <div>
          <h4>Price Oracle Address</h4>
          {/* {clusterConfig?.config.pricing_oracle && (
            <p>
              <s>
                <FinderAddressLink
                  network={network}
                  address={clusterConfig.config.pricing_oracle}
                />
              </s>
            </p>
          )} */}
          <p>
            <FinderAddressLink
              network={network}
              address={update_config.pricing_oracle}
            />
          </p>
        </div>
      )}

      {update_config.target_oracle && (
        <div>
          <h4>Target Oracle Address</h4>
          {/* {clusterConfig?.config.target_oracle && (
            <p>
              <s>
                <FinderAddressLink
                  network={network}
                  address={clusterConfig.config.target_oracle}
                />
              </s>
            </p>
          )} */}
          <p>
            <FinderAddressLink
              network={network}
              address={update_config.target_oracle}
            />
          </p>
        </div>
      )}

      {update_config.penalty && (
        <div>
          <h4>Penalty Address</h4>
          {/* {clusterConfig?.config.penalty && (
            <p>
              <s>
                <FinderAddressLink
                  network={network}
                  address={clusterConfig.config.penalty}
                />
              </s>
            </p>
          )} */}
          <p>
            <FinderAddressLink
              network={network}
              address={update_config.penalty}
            />
          </p>
        </div>
      )}

      {update_config.target && (
        <div>
          <h4>Tokens</h4>
          <TokenTable>
            <thead>
              <tr>
                <th>Token</th>
                <th>Allocation</th>
              </tr>
            </thead>
            <tbody>
              {update_config.target.map(({ info, amount }, i) => (
                <tr key={`token-${i}`}>
                  <td>
                    <TokenLabel assetInfo={info} />
                  </td>
                  <td>{amount}</td>
                </tr>
              ))}
            </tbody>
          </TokenTable>
        </div>
      )}
    </>
  );
}

const TokenTable = styled.table`
  min-width: 300px;

  th,
  td {
    text-align: left;
    padding-right: 20px;
  }

  tr {
    height: 55px;
  }
`;

export const StyledPollDetail = styled(PollDetailBase)`
  > div {
    font-size: 14px;

    h4 {
      color: var(--color-white44);
      font-weight: 500;

      margin-bottom: 4px;
    }

    p {
      line-height: 21px;
      color: var(--color-white100);
    }

    &:not(:last-child) {
      margin-bottom: 28px;
    }

    img.icon {
      max-width: 30px;
    }
  }

  .execute-header {
    display: flex;
    justify-content: space-between;

    > div {
      cursor: pointer;
      color: var(--color-blue01);
      font-size: var(--font-size12);
      display: flex;
      align-items: center;

      svg {
        margin-right: 0.3em;
        font-size: 16px;
      }
    }
  }

  .json-box {
    margin-top: 1em;
    background-color: var(--color-gray11);
    color: var(--color-white80);
    border-radius: 8px;
    padding: 1.4em 1.7em;
    word-break: break-word;

    &:empty {
      display: none;
    }
  }
`;

export const PollDetail = fixHMR(StyledPollDetail);
