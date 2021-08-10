import { InputAdornment } from '@material-ui/core';
import { WalletIcon } from '@nebula-js/icons';
import { gov } from '@nebula-js/types';
import {
  Button,
  FormLabel,
  Section,
  TextInput,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { FeeBox } from 'components/boxes/FeeBox';
import { FormLayout } from 'components/layouts/FormLayout';
import { fixHMR } from 'fix-hmr';
import React, { ReactNode, useState } from 'react';
import styled from 'styled-components';

export interface PollCreateBaseProps {
  className?: string;

  title: string;
  description: ReactNode;
  children?: ReactNode;
  submitButtonStatus: 'disabled' | 'hidden' | true;
  onCreateMsg: () => gov.ExecuteMsg[] | null;
}

function PollCreateBaseBase({
  className,
  title,
  description,
  onCreateMsg,
  submitButtonStatus,
  children,
}: PollCreateBaseProps) {
  const [pollTitle, setPollTitle] = useState<string>('');
  const [pollDescription, setPollDescription] = useState<string>('');
  const [pollExternalLink, setPollExternalLink] = useState<string>('');

  const buttonSize = useScreenSizeValue<'medium' | 'normal'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  return (
    <FormLayout className={className} title="Create Poll">
      <Section className="header">
        <h2>{title}</h2>
        <p>{description}</p>
      </Section>

      <Section>
        <FormLabel label="Title" className="form-label">
          <TextInput
            placeholder="Enter poll title"
            fullWidth
            value={pollTitle}
            onChange={({ target }) => setPollTitle(target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">TEST</InputAdornment>
              ),
            }}
          />
        </FormLabel>

        <FormLabel label="Description" className="form-label">
          <TextInput
            placeholder="Summary of the poll"
            fullWidth
            multiline
            minRows={4}
            maxRows={10}
            value={pollDescription}
            onChange={({ target }) => setPollDescription(target.value)}
          />
        </FormLabel>

        <FormLabel label="External Link" className="form-label">
          <TextInput
            placeholder="https://"
            fullWidth
            value={pollExternalLink}
            onChange={({ target }) => setPollExternalLink(target.value)}
          />
        </FormLabel>

        {children}

        <FormLabel
          label="Deposit"
          aside={
            <DepositAside>
              <WalletIcon /> 1,490,000
            </DepositAside>
          }
          className="form-label"
        >
          <Deposit>
            <span>1,000</span>
            <span>NEB</span>
          </Deposit>
        </FormLabel>

        <FeeBox className="fee-box">
          <li>
            <span>Tx Fee</span>
            <span>0.25 UST</span>
          </li>
        </FeeBox>

        {submitButtonStatus !== 'hidden' && (
          <Button
            className="submit"
            fullWidth
            size={buttonSize}
            color="paleblue"
            disabled={submitButtonStatus === 'disabled'}
          >
            Submit
          </Button>
        )}
      </Section>
    </FormLayout>
  );
}

const DepositAside = styled.span`
  font-size: 12px;

  svg {
    font-size: 1em;
    transform: scale(1.1) translateY(0.1em);
  }
`;

const Deposit = styled.div`
  border-radius: 8px;
  background-color: var(--color-gray22);
  padding: 20px;
  display: flex;
  justify-content: space-between;
`;

export const StyledPollCreateBase = styled(PollCreateBaseBase)`
  --max-content-width: 704px;

  .header {
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

export const PollCreateBase = fixHMR(StyledPollCreateBase);
