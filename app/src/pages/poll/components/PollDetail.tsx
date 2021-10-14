import { formatUToken } from '@libs/formatter';
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
} from '@nebula-js/types';
import { Section } from '@nebula-js/ui';
import { useWallet } from '@terra-dev/use-wallet';
import { fixHMR } from 'fix-hmr';
import { TokenLabel } from 'pages/poll/components/TokenLabel';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface PollDetailProps {
  className?: string;
  parsedPoll: ParsedPoll;
}

function PollDetailBase({ className, parsedPoll }: PollDetailProps) {
  const { contractAddress } = useNebulaApp();

  return (
    <Section className={className}>
      <div>
        <h4>Description</h4>
        <p>{parsedPoll.poll.description}</p>
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

      {parsedPoll.executeMsg?.contract === contractAddress.clusterFactory &&
        'create_cluster' in parsedPoll.executeMsg.msg && (
          <WhitelistCluster msg={parsedPoll.executeMsg.msg} />
        )}

      {parsedPoll.executeMsg?.contract === contractAddress.clusterFactory &&
        'decommission_cluster' in parsedPoll.executeMsg.msg && (
          <BlacklistCluster msg={parsedPoll.executeMsg.msg} />
        )}

      {parsedPoll.executeMsg?.contract === contractAddress.gov &&
        'update_config' in parsedPoll.executeMsg.msg && (
          <GovernanceParameterChange msg={parsedPoll.executeMsg.msg} />
        )}

      {parsedPoll.executeMsg?.contract === contractAddress.community &&
        'spend' in parsedPoll.executeMsg.msg && (
          <CommunityPoolSpend msg={parsedPoll.executeMsg.msg} />
        )}

      {parsedPoll.executeMsg &&
        parsedPoll.executeMsg.contract !== contractAddress.gov &&
        'update_config' in parsedPoll.executeMsg.msg && (
          <ClusterParameterChange
            msg={parsedPoll.executeMsg.msg}
            clusterAddr={parsedPoll.executeMsg.contract}
          />
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
            chainID={network.chainID}
            address={params.pricing_oracle}
          />
        </p>
      </div>

      <div>
        <h4>Target Oracle Address</h4>
        <p>
          <FinderAddressLink
            chainID={network.chainID}
            address={params.target_oracle}
          />
        </p>
      </div>

      <div>
        <h4>Penalty Address</h4>
        <p>
          <FinderAddressLink
            chainID={network.chainID}
            address={params.penalty}
          />
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
                <td>{formatUToken(amount)}</td>
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
          <p>
            <s>{govConfig?.voting_period}</s>
          </p>
          <p>{update_config.voting_period}</p>
        </div>
      )}

      {update_config.effective_delay && (
        <div>
          <h4>Effective Deplay</h4>
          <p>
            <s>{govConfig?.effective_delay}</s>
          </p>
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

  return (
    <>
      <div>
        <h4>Recipient</h4>
        <p>
          <FinderAddressLink
            chainID={network.chainID}
            address={spend.recipient}
          />
        </p>
      </div>

      <div>
        <h4>Amount</h4>
        <p>{formatUToken(spend.amount)} NEB</p>
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
          <p>
            <s>{clusterConfig?.config.name}</s>
          </p>
          <p>{update_config.name}</p>
        </div>
      )}

      {update_config.description && (
        <div>
          <h4>Description</h4>
          <p>
            <s>{clusterConfig?.config.description}</s>
          </p>
          <p>{update_config.description}</p>
        </div>
      )}

      {update_config.pricing_oracle && (
        <div>
          <h4>Price Oracle Address</h4>
          {clusterConfig?.config.pricing_oracle && (
            <p>
              <s>
                <FinderAddressLink
                  chainID={network.chainID}
                  address={clusterConfig.config.pricing_oracle}
                />
              </s>
            </p>
          )}
          <p>
            <FinderAddressLink
              chainID={network.chainID}
              address={update_config.pricing_oracle}
            />
          </p>
        </div>
      )}

      {update_config.target_oracle && (
        <div>
          <h4>Target Oracle Address</h4>
          {clusterConfig?.config.target_oracle && (
            <p>
              <s>
                <FinderAddressLink
                  chainID={network.chainID}
                  address={clusterConfig.config.target_oracle}
                />
              </s>
            </p>
          )}
          <p>
            <FinderAddressLink
              chainID={network.chainID}
              address={update_config.target_oracle}
            />
          </p>
        </div>
      )}

      {update_config.penalty && (
        <div>
          <h4>Penalty Address</h4>
          {clusterConfig?.config.penalty && (
            <p>
              <s>
                <FinderAddressLink
                  chainID={network.chainID}
                  address={clusterConfig.config.penalty}
                />
              </s>
            </p>
          )}
          <p>
            <FinderAddressLink
              chainID={network.chainID}
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
                  <td>{formatUToken(amount)}</td>
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
`;

export const PollDetail = fixHMR(StyledPollDetail);
