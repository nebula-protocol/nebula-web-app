import { useFixedFee } from '@libs/app-provider';
import { formatUToken } from '@libs/formatter';
import {
  BytesValid,
  useValidateStringBytes,
} from '@libs/use-string-bytes-length';
import {
  useGovConfigQuery,
  useGovCreatePollTx,
  useNebBalance,
} from '@nebula-js/app-provider';
import { validateLinkAddress } from '@nebula-js/app-fns';
import { WalletIcon } from '@nebula-js/icons';
import { NEB, u } from '@nebula-js/types';
import {
  Button,
  FormLabel,
  FormLabelAside,
  Section,
  TextInput,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big from 'big.js';
import { FeeBox } from 'components/boxes/FeeBox';
import { FormLayout } from 'components/layouts/FormLayout';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import { fixHMR } from 'fix-hmr';
import React, { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

interface PollWhitelistClusterTextBaseProps {
  className?: string;
}

function PollWhitelistClusterTextBase({
  className,
}: PollWhitelistClusterTextBaseProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const history = useHistory();

  const { broadcast } = useTxBroadcast();

  const postTx = useGovCreatePollTx();

  const fixedFee = useFixedFee();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------

  const { data: { govConfig } = {} } = useGovConfigQuery();

  const uNEB = useNebBalance(connectedWallet?.walletAddress);

  // ---------------------------------------------
  // states
  // ---------------------------------------------

  const [pollTitle, setPollTitle] = useState<string>('');
  const [pollExternalLink, setPollExternalLink] = useState<string>('');
  const [clusterSymbol, setClusterSymbol] = useState<string>('');
  const [clusterName, setClusterName] = useState<string>('');
  const [clusterDescription, setClusterDescription] = useState<string>('');

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidDepositAmount = useMemo(() => {
    if (!govConfig) {
      return null;
    }

    return big(uNEB).lt(govConfig.proposal_deposit) ? 'Not enough NEB' : null;
  }, [govConfig, uNEB]);

  const invalidPollTitleBytes = useValidateStringBytes(pollTitle, 3, 64);

  const invalidPollExternalLinkBytes = useValidateStringBytes(
    pollExternalLink,
    12,
    128,
  );

  const invalidPollExternalLinkProtocol = useMemo(() => {
    return validateLinkAddress(pollExternalLink);
  }, [pollExternalLink]);

  const invalidSymbolLength = useValidateStringBytes(clusterSymbol, 2, 9);

  const invalidSymbolRegex = !clusterSymbol.match(/^[a-zA-Z]*$/);

  const invalidClusterName = useValidateStringBytes(clusterName, 3, 41);

  const invalidClusterDescription = useValidateStringBytes(
    clusterDescription,
    4,
    202,
  );

  const pollDescription = useMemo(() => {
    return `#n${clusterName}#s${clusterSymbol}#d${clusterDescription}`;
  }, [clusterName, clusterSymbol, clusterDescription]);

  const submitButtonStatus = useMemo(
    () =>
      clusterSymbol.length > 0 &&
      clusterName.length > 0 &&
      clusterDescription.length > 0 &&
      !invalidSymbolLength &&
      !invalidSymbolRegex &&
      !invalidClusterName &&
      !invalidClusterDescription
        ? true
        : 'disabled',
    [
      clusterSymbol,
      clusterName,
      clusterDescription,
      invalidSymbolLength,
      invalidSymbolRegex,
      invalidClusterName,
      invalidClusterDescription,
    ],
  );

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------

  const proceed = useCallback(
    async (
      _title: string,
      _description: string,
      _link: string,
      _depositAmount: u<NEB>,
    ) => {
      const stream = postTx?.({
        title: _title,
        description: _description,
        link: _link.length > 0 ? _link : undefined,
        depositAmount: _depositAmount,
        onTxSucceed: () => {
          history.push(`/gov`);
        },
      });

      if (stream) {
        broadcast(stream);
      }
    },
    [broadcast, history, postTx],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  const buttonSize = useScreenSizeValue<'medium' | 'normal'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  return (
    <FormLayout className={className} title="Create Poll">
      <Section className="header">
        <h2>Whitelist Cluster</h2>
        <p>Register a new cluster on Nebula Protocol</p>
      </Section>

      <Section className="body">
        <FormLabel label="Title" className="form-label">
          <TextInput
            placeholder="Enter poll title"
            fullWidth
            value={pollTitle}
            onChange={({ target }) => setPollTitle(target.value)}
            error={!!invalidPollTitleBytes}
            helperText={
              invalidPollTitleBytes === BytesValid.LESS
                ? 'Title must be at least 4 bytes.'
                : invalidPollTitleBytes === BytesValid.MUCH
                ? 'Title cannot be longer than 64 bytes.'
                : undefined
            }
          />
        </FormLabel>
        <FormLabel label="External Link" className="form-label">
          <TextInput
            placeholder="https://"
            fullWidth
            value={pollExternalLink}
            onChange={({ target }) => setPollExternalLink(target.value)}
            error={
              !!invalidPollExternalLinkBytes ||
              !!invalidPollExternalLinkProtocol
            }
            helperText={
              invalidPollExternalLinkBytes === BytesValid.LESS
                ? 'Information link must be at least 12 bytes.'
                : invalidPollExternalLinkBytes === BytesValid.MUCH
                ? 'Information link cannot be longer than 128 bytes.'
                : invalidPollExternalLinkProtocol
            }
          />
        </FormLabel>
        <FormLabel label="Cluster Name" className="form-label">
          <TextInput
            fullWidth
            value={clusterName}
            onChange={({ target }) => setClusterName(target.value)}
            error={!!invalidClusterName}
            helperText={
              invalidClusterName === BytesValid.LESS
                ? 'Cluster name must be at least 4 bytes.'
                : invalidClusterName === BytesValid.MUCH
                ? 'Cluster name cannot be longer than 64 bytes.'
                : undefined
            }
          />
        </FormLabel>
        <FormLabel label="Symbol" className="form-label">
          <TextInput
            fullWidth
            value={clusterSymbol}
            onChange={({ target }) => setClusterSymbol(target.value)}
            error={!!invalidSymbolLength || invalidSymbolRegex}
            helperText={
              invalidSymbolLength === BytesValid.LESS
                ? 'Symbol must be at least 3 bytes.'
                : invalidSymbolLength === BytesValid.MUCH
                ? 'Symbol cannot be longer than 12 bytes.'
                : invalidSymbolRegex
                ? 'Symbol can only include a-z or A-Z.'
                : undefined
            }
          />
        </FormLabel>
        <FormLabel label="Cluster Description" className="form-label">
          <TextInput
            fullWidth
            multiline
            minRows={4}
            maxRows={10}
            value={clusterDescription}
            onChange={({ target }) => setClusterDescription(target.value)}
            error={!!invalidClusterDescription}
            helperText={
              invalidClusterDescription === BytesValid.LESS
                ? 'Clusterster description must be at least 4 bytes.'
                : invalidClusterDescription === BytesValid.MUCH
                ? 'Clusterster description exceeds.'
                : undefined
            }
          />
        </FormLabel>

        {govConfig && (
          <FormLabel
            label="Deposit"
            aside={
              <FormLabelAside>
                <WalletIcon /> {formatUToken(uNEB)}
              </FormLabelAside>
            }
            className="form-label"
          >
            <Deposit>
              <span>{formatUToken(govConfig.proposal_deposit)}</span>
              <span>NEB</span>
            </Deposit>
          </FormLabel>
        )}
        <FeeBox className="fee-box">
          <li>
            <span>Tx Fee</span>
            <span>{formatUToken(fixedFee)} UST</span>
          </li>
        </FeeBox>
        <Button
          className="submit"
          fullWidth
          size={buttonSize}
          color="paleblue"
          disabled={
            submitButtonStatus !== true ||
            !connectedWallet ||
            !connectedWallet.availablePost ||
            !postTx ||
            pollTitle.length === 0 ||
            pollDescription.length === 0 ||
            !!invalidDepositAmount ||
            !!invalidPollTitleBytes ||
            !!invalidPollExternalLinkBytes ||
            !!invalidPollExternalLinkProtocol
          }
          onClick={() =>
            govConfig &&
            proceed(
              pollTitle,
              pollDescription,
              pollExternalLink,
              govConfig.proposal_deposit,
            )
          }
        >
          Submit
        </Button>
      </Section>
    </FormLayout>
  );
}

const Deposit = styled.div`
  border-radius: 8px;
  background-color: var(--color-gray22);
  padding: 20px;
  display: flex;
  justify-content: space-between;
`;

export const StyledPollWhitelistClusterTextBase = styled(
  PollWhitelistClusterTextBase,
)`
  --max-content-width: 704px;

  .header {
    background-color: var(--color-gray18);

    h2 {
      font-size: 2em;
      font-weight: 500;

      margin-bottom: 0.28571429em;
    }

    p {
      font-size: 1em;
      font-weight: 400;
      color: var(--color-white44);
    }

    margin-bottom: 0.85714286em;
  }

  .body {
    background-color: var(--color-gray18);
  }

  .form-label:not(:first-child) {
    margin-top: 2.57142857142857em;
  }

  .fee-box {
    margin: 2.57142857142857em 0;
  }

  .submit {
    display: block;
    max-width: 360px;
    margin: 0 auto;
  }
`;

const PollWhitelistClusterTextPoll = fixHMR(StyledPollWhitelistClusterTextBase);

export default PollWhitelistClusterTextPoll;
