import { gov } from '@nebula-js/types';
import { Button, Section } from '@nebula-js/ui';
import { FormLayout } from 'components/layouts/FormLayout';
import { fixHMR } from 'fix-hmr';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

export interface PollCreateBaseProps {
  className?: string;

  title: string;
  description: ReactNode;
  children: ReactNode;
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
  return (
    <FormLayout className={className} title="Create Poll">
      <Section className="header">
        <h2>{title}</h2>
        <p>{description}</p>
      </Section>

      <Section>
        {children}
        {submitButtonStatus !== 'hidden' && (
          <Button disabled={submitButtonStatus === 'disabled'}>Submit</Button>
        )}
      </Section>
    </FormLayout>
  );
}

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
`;

export const PollCreateBase = fixHMR(StyledPollCreateBase);
